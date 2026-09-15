import { randomUUID } from "node:crypto";
import { dbTx } from "@/db";
import type { NewFile } from "@/db/schema";
import { InternalServerError, NotFound, PayloadTooLarge, type Result } from "@/lib/api-errors";
import { mapTxError } from "@/lib/db-errors";
import logger from "@/lib/logger";
import { Err, Ok } from "@/lib/result";
import * as objects from "@/objects";
import * as store from "@/services/files/store";
import { touchAncestorChain } from "@/services/folders";
import { getUser } from "@/services/utils";

const MAX_UPLOAD_SIZE_BYTES = 5 * 1024 ** 3;

function fileKey({ id, user_id }: { id: string; user_id: string }) {
	return `${user_id}/${id}`;
}

type InitiateUploadParams = {
	mime_type?: string;
	size: number;
};

type InitiateUploadResult = {
	id: string;
	uploadUrl: string;
};

/** Reserves an id and hands back a presigned `PUT` url. Writes nothing to the db - see docs/adr/0001. */
export async function initiateUpload({ mime_type, size }: InitiateUploadParams): Promise<Result<InitiateUploadResult>> {
	const { data: user, error } = await getUser();
	if (error) {
		return Err(error);
	}

	if (size > MAX_UPLOAD_SIZE_BYTES) {
		return Err(new PayloadTooLarge().setDebugCtx({ max: MAX_UPLOAD_SIZE_BYTES, size }));
	}

	const id = randomUUID();
	const key = fileKey({ id, user_id: user.id });
	const uploadUrl = await objects.getUploadUrl(key, { contentLength: size, contentType: mime_type });

	return Ok({ id, uploadUrl });
}

// Raw db shape, intentionally - see services/README.md#return-and-param-shapes-at-the-seam
export type File_ForConfirm = Pick<NewFile, "name" | "parent_id" | "mime_type"> & { id: string };

/** Verifies the object landed in S3, then creates the one row for it. `file.id` must come from `initiateUpload`. */
export async function confirmUpload(file: File_ForConfirm): Promise<Result<string>> {
	const { data: user, error } = await getUser();
	if (error) {
		return Err(error);
	}

	const key = fileKey({ id: file.id, user_id: user.id });
	const head = await objects.headObject(key);
	if (!head) {
		return Err(new NotFound().setDebugCtx({ id: file.id, key }));
	}

	return dbTx
		.transaction(async (tx) => {
			// If parent_id is present, touch it and everything above it. Also confirms the parent belongs
			// to the user and the file can be created under it.
			if (file.parent_id) {
				const touched = await touchAncestorChain(tx, {
					startFolderId: file.parent_id,
					updated_at: new Date(),
					user_id: user.id,
				});
				if (touched === 0) {
					throw new NotFound().setDebugCtx({ parent_id: file.parent_id });
				}
			}

			return store.createFile(tx, {
				id: file.id,
				key,
				mime_type: file.mime_type,
				name: file.name,
				parent_id: file.parent_id,
				size: head.size,
				user_id: user.id,
			});
		})
		.then(Ok)
		.catch(mapTxError);
}

type GetDownloadUrlParams = {
	id: string;
	disposition?: "inline" | "attachment";
};

/** Ownership-checked, short-lived presigned `GET` url - meant to be redirected to immediately, not stored. */
export async function getDownloadUrl({ id, disposition }: GetDownloadUrlParams): Promise<Result<string>> {
	const { data: user, error } = await getUser();
	if (error) {
		return Err(error);
	}

	const file = await store.getFile({ id, user_id: user.id });
	if (!file) {
		return Err(new NotFound().setDebugCtx({ id }));
	}

	try {
		const url = await objects.getDownloadUrl(file.key, { disposition, filename: file.name });
		return Ok(url);
	} catch (err) {
		return Err(new InternalServerError().setDebugCtx({ error: err }));
	}
}

export async function deleteFile(id: string): Promise<Result<void>> {
	const { data: user, error } = await getUser();
	if (error) {
		return Err(error);
	}

	return dbTx
		.transaction(async (tx) => {
			const deleted = await store.deleteFile(tx, { id, user_id: user.id });
			if (!deleted) {
				throw new NotFound().setDebugCtx({ id });
			}

			if (deleted.parent_id) {
				await touchAncestorChain(tx, {
					startFolderId: deleted.parent_id,
					updated_at: new Date(),
					user_id: user.id,
				});
			}

			return deleted;
		})
		.then((deleted) => {
			// Best-effort, outside the db transaction - an S3 call can't be rolled back, and a stray
			// orphaned object on rare failure is cheaper than a db transaction blocked on the network.
			objects.deleteObject(deleted.key).catch((err) => logger.error({ err, key: deleted.key }));
			return Ok(undefined);
		})
		.catch(mapTxError);
}

export async function renameFile(id: string, name: string): Promise<Result<void>> {
	const { data: user, error } = await getUser();
	if (error) {
		return Err(error);
	}

	return dbTx
		.transaction(async (tx) => {
			const renamed = await store.renameFile(tx, { id, name, user_id: user.id });
			if (!renamed) {
				throw new NotFound().setDebugCtx({ id });
			}
		})
		.then(() => Ok(undefined))
		.catch(mapTxError);
}
