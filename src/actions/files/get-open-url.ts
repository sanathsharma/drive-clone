"use server";

import { getDownloadUrl } from "@/services/files";

export async function getFileOpenUrl(id: string): Promise<{ url: string | null; error: string | null }> {
	const { data, error } = await getDownloadUrl({ disposition: "inline", id });
	if (error) {
		return { error: error.code, url: null };
	}

	return { error: null, url: data };
}
