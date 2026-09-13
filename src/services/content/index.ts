"use server";

import type { File, Folder } from "@/db/schema";
import type { Result } from "@/lib/api-errors";
import { mapDbError } from "@/lib/db-errors";
import { Err, Ok } from "@/lib/result";
import { getUser } from "@/services/utils";
import { type Crumb, getBreadcrumbs, getFiles, getFolders } from "./store";

// Raw db shape, intentionally - see services/README.md#return-and-param-shapes-at-the-seam
export type { Crumb };

// Raw db shape, intentionally - see services/README.md#return-and-param-shapes-at-the-seam
export type Content = {
	files: File[];
	folders: Folder[];
};

export async function get(currentFolderId: string): Promise<Result<Content>> {
	const { data: user, error } = await getUser();
	if (error) {
		return Err(error);
	}

	try {
		const [files, folders] = await Promise.all([
			getFiles(currentFolderId, user.id),
			getFolders(currentFolderId, user.id),
		]);
		return Ok({ files, folders });
	} catch (err) {
		return mapDbError(err);
	}
}

export async function getBreadcrumbsFor(currentFolderId: string): Promise<Result<Crumb[]>> {
	const { data: user, error } = await getUser();
	if (error) {
		return Err(error);
	}

	return getBreadcrumbs(currentFolderId, user.id).then(Ok).catch(mapDbError);
}
