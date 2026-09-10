"use server";

import type { File, Folder } from "@/db/schema";
import type { Result } from "@/lib/api-errors";
import { Err, Ok } from "@/lib/result";
import { getUser } from "@/services/utils";
import { type Crumb, getBreadcrumbs, getFiles, getFolders } from "./store";

export type { Crumb };

export type Content = {
	files: File[];
	folders: Folder[];
};

export async function get(currentFolderId: string): Promise<Result<Content>> {
	const { data: user, error } = await getUser();
	if (error) {
		return Err(error);
	}

	const [files, folders] = await Promise.all([
		getFiles(currentFolderId, user.id),
		getFolders(currentFolderId, user.id),
	]);

	return Ok({
		files,
		folders,
	});
}

export async function getBreadcrumbsFor(currentFolderId: string): Promise<Result<Crumb[]>> {
	const { data: user, error } = await getUser();
	if (error) {
		return Err(error);
	}

	const crumbs = await getBreadcrumbs(currentFolderId, user.id);

	return Ok(crumbs);
}
