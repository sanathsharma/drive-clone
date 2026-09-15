"use server";

import { revalidatePath } from "next/cache";
import { paths } from "@/constants/paths";
import { deleteFile } from "@/services/files";
import { deleteFolder } from "@/services/folders";

type Item = {
	id: string;
	type: "file" | "folder";
};

export async function deleteSelection(items: Item[], parentId?: string): Promise<{ error: string | null }> {
	const results = await Promise.all(
		items.map((item) => (item.type === "folder" ? deleteFolder(item.id) : deleteFile(item.id))),
	);

	const failed = results.find((result) => result.error);
	if (failed?.error) {
		return { error: failed.error.code };
	}

	revalidatePath(parentId ? paths.folder(parentId) : paths.root());
	return { error: null };
}
