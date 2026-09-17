"use client";

/** Navigates to `url` via a synthetic anchor click rather than `window.location`, so a Content-Disposition:
 * attachment response downloads in place instead of tripping Next's "don't navigate with `location`" lint rule. */
export function navigateForDownload(url: string): void {
	const anchor = document.createElement("a");
	anchor.href = url;
	anchor.rel = "noopener";
	document.body.appendChild(anchor);
	anchor.click();
	anchor.remove();
}

function extractFilename(header: string | null): string | undefined {
	if (!header) {
		return undefined;
	}

	const extended = /filename\*=UTF-8''([^;]+)/i.exec(header);
	if (extended) {
		return decodeURIComponent(extended[1]);
	}

	const quoted = /filename="([^"]+)"/i.exec(header);
	return quoted?.[1];
}

type SelectionItem = { id: string; type: "file" | "folder" };

type TriggerDownloadParams = {
	items: SelectionItem[];
	fallbackFilename: string;
};

/**
 * Posts `items` to `/api/download` (following its redirect for a lone selected file) and saves the
 * response body as a file via a synthetic anchor click, using the server's `Content-Disposition`
 * filename when present. Throws on a non-2xx response - callers decide how to surface that.
 */
export async function triggerDownload({ items, fallbackFilename }: TriggerDownloadParams): Promise<void> {
	const response = await fetch("/api/download", {
		body: JSON.stringify({ items }),
		headers: { "Content-Type": "application/json" },
		method: "POST",
	});

	if (!response.ok) {
		throw new Error(`download failed with status ${response.status}`);
	}

	const blob = await response.blob();
	const filename = extractFilename(response.headers.get("content-disposition")) ?? fallbackFilename;

	const objectUrl = URL.createObjectURL(blob);
	const anchor = document.createElement("a");
	anchor.href = objectUrl;
	anchor.download = filename;
	document.body.appendChild(anchor);
	anchor.click();
	anchor.remove();
	URL.revokeObjectURL(objectUrl);
}
