import { dbTx } from "@/db";
import type { NewFile } from "@/db/schema";
import { NotFound, type Result } from "@/lib/api-errors";
import { mapTxError } from "@/lib/db-errors";
import { Err, Ok } from "@/lib/result";
import * as store from "@/services/files/store";
import { touchAncestorChain } from "@/services/folders";
import { getUser } from "@/services/utils";

// Raw db shape, intentionally - see services/README.md#return-and-param-shapes-at-the-seam
export type File_ForCreate = Omit<NewFile, "id" | "user_id" | "created_at" | "updated_at">;

export async function createFile(file: File_ForCreate): Promise<Result<string>> {
	const { data: user, error } = await getUser();
	if (error) {
		return Err(error);
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

			return store.createFile(tx, { ...file, user_id: user.id });
		})
		.then(Ok)
		.catch(mapTxError);
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
		})
		.then(() => Ok(undefined))
		.catch(mapTxError);
}
