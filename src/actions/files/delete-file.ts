"use server";

import { revalidatePath } from "next/cache";
import { paths } from "@/constants/paths";
import { deleteFile as deleteFileService } from "@/services/files";

export async function deleteFile(id: string, parentId?: string): Promise<{ error: string | null }> {
	const { error } = await deleteFileService(id);
	if (error) {
		return { error: error.code };
	}

	revalidatePath(parentId ? paths.folder(parentId) : paths.root());
	return { error: null };
}
