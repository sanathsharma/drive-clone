/** True if `file` came from a dropped directory rather than a directly dropped file. */
export function isFromDirectory(file: File) {
	const path = (file as File & { path?: string }).path;
	if (!path) {
		return false;
	}

	// A flat drop's path is `/name` (from `entry.fullPath`) or `./name` (file-selector's own
	// fallback when it reads the file via a FileSystemHandle instead) - one real segment either
	// way. A path with more than one real segment means the file came from inside a folder.
	const segments = path.split("/").filter((segment) => segment && segment !== ".");
	return segments.length > 1;
}

async function readErrorCode(response: Response) {
	const body = await response.json().catch(() => null);
	return body?.error?.code as string | undefined;
}

type InitiateUploadResponse = {
	id: string;
	uploadUrl: string;
};

/** Runs the initiate -> direct-to-S3 PUT -> confirm sequence for one file. See docs/adr/0001. */
export async function uploadFile(file: File, parentId?: string): Promise<void> {
	const mime_type = file.type || undefined;

	const initiateResponse = await fetch("/api/files", {
		body: JSON.stringify({ mime_type, size: file.size }),
		headers: { "Content-Type": "application/json" },
		method: "POST",
	});
	if (!initiateResponse.ok) {
		throw new Error((await readErrorCode(initiateResponse)) ?? "Couldn't start the upload");
	}
	const { id, uploadUrl } = (await initiateResponse.json()) as InitiateUploadResponse;

	const putResponse = await fetch(uploadUrl, {
		body: file,
		headers: mime_type ? { "Content-Type": mime_type } : undefined,
		method: "PUT",
	});
	if (!putResponse.ok) {
		throw new Error("Upload to storage failed");
	}

	const confirmResponse = await fetch(`/api/files/${id}/confirm`, {
		body: JSON.stringify({ mime_type, name: file.name, parent_id: parentId }),
		headers: { "Content-Type": "application/json" },
		method: "POST",
	});
	if (!confirmResponse.ok) {
		throw new Error((await readErrorCode(confirmResponse)) ?? "Couldn't finish the upload");
	}
}
