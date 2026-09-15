"use server";

import { revalidatePath } from "next/cache";
import { paths } from "@/constants/paths";
import { deleteFolder as deleteFolderService } from "@/services/folders";

export async function deleteFolder(id: string, parentId?: string): Promise<{ error: string | null }> {
	const { error } = await deleteFolderService(id);
	if (error) {
		return { error: error.code };
	}

	revalidatePath(parentId ? paths.folder(parentId) : paths.root());
	return { error: null };
}
