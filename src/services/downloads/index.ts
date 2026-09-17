import type { Readable } from "node:stream";
import { ZipArchive } from "archiver";
import { BadRequest, NotFound, PayloadTooLarge, type Result } from "@/lib/api-errors";
import { Err, Ok } from "@/lib/result";
import * as objects from "@/objects";
import { getUser } from "@/services/utils";
import * as store from "./store";

const MAX_ZIP_FILES = 500;
const MAX_ZIP_BYTES = 2 * 1024 ** 3;

export type SelectionItem = { id: string; type: "file" | "folder" };

type ZipEntry = { key: string; size: number; zip_path: string };

type ZipResult = { stream: Readable; filename: string };

type TopLevelNode =
	| { kind: "file"; id: string; name: string; key: string; size: number }
	| { kind: "folder"; id: string; name: string };

/** Picks a name unique within `used`, suffixing " (2)", " (3)"... on a collision - names in this
 * schema aren't guaranteed unique among siblings, so a zip's flat directory listing needs its own
 * dedupe pass to avoid one entry silently shadowing another. */
function dedupeName(name: string, used: Set<string>): string {
	if (!used.has(name)) {
		used.add(name);
		return name;
	}

	const dot = name.lastIndexOf(".");
	const base = dot > 0 ? name.slice(0, dot) : name;
	const ext = dot > 0 ? name.slice(dot) : "";

	let n = 2;
	let candidate = `${base} (${n})${ext}`;
	while (used.has(candidate)) {
		n += 1;
		candidate = `${base} (${n})${ext}`;
	}
	used.add(candidate);
	return candidate;
}

/** Resolves `nodes` (a flat top-level mix of files and folders) plus every folder's full subtree into
 * a deduped, hierarchy-preserving list of zip entries. A folder's own name becomes the top path
 * segment for everything nested inside it. */
async function resolveZipEntries(nodes: TopLevelNode[], user_id: string): Promise<ZipEntry[]> {
	const folderIds = nodes.filter((node) => node.kind === "folder").map((node) => node.id);

	const subtreeFolders = await store.getSubtreeFolders({ rootFolderIds: folderIds, user_id });
	const allFolderIds = subtreeFolders.map((folder) => folder.id);
	const subtreeFiles = await store.getSubtreeFiles({ folderIds: allFolderIds, user_id });

	const childFoldersOf = new Map<string, store.SubtreeFolder[]>();
	for (const folder of subtreeFolders) {
		if (!folder.parent_id) {
			continue;
		}
		const siblings = childFoldersOf.get(folder.parent_id) ?? [];
		siblings.push(folder);
		childFoldersOf.set(folder.parent_id, siblings);
	}

	const childFilesOf = new Map<string, store.SubtreeFile[]>();
	for (const file of subtreeFiles) {
		const siblings = childFilesOf.get(file.parent_id) ?? [];
		siblings.push(file);
		childFilesOf.set(file.parent_id, siblings);
	}

	const entries: ZipEntry[] = [];

	function walk(folderId: string, prefix: string) {
		const used = new Set<string>();

		for (const file of childFilesOf.get(folderId) ?? []) {
			const name = dedupeName(file.name, used);
			entries.push({ key: file.key, size: file.size, zip_path: `${prefix}/${name}` });
		}

		for (const folder of childFoldersOf.get(folderId) ?? []) {
			const name = dedupeName(folder.name, used);
			walk(folder.id, `${prefix}/${name}`);
		}
	}

	const usedTopLevel = new Set<string>();
	for (const node of nodes) {
		if (node.kind === "file") {
			const name = dedupeName(node.name, usedTopLevel);
			entries.push({ key: node.key, size: node.size, zip_path: name });
		} else {
			const name = dedupeName(node.name, usedTopLevel);
			walk(node.id, name);
		}
	}

	return entries;
}

function checkCaps(entries: ZipEntry[]): Result<void> {
	if (entries.length === 0) {
		return Err(new BadRequest().setDebugCtx({ reason: "nothing to zip" }));
	}

	if (entries.length > MAX_ZIP_FILES) {
		return Err(new PayloadTooLarge().setDebugCtx({ count: entries.length, max: MAX_ZIP_FILES }));
	}

	const totalBytes = entries.reduce((sum, entry) => sum + entry.size, 0);
	if (totalBytes > MAX_ZIP_BYTES) {
		return Err(new PayloadTooLarge().setDebugCtx({ max: MAX_ZIP_BYTES, total: totalBytes }));
	}

	return Ok(undefined);
}

/** Streams `entries` into a zip archive, fetching each object from storage one at a time. Any fetch
 * failure destroys the archive stream so the response ends incomplete rather than silently omitting
 * the failed entry. */
function buildArchive(entries: ZipEntry[]): Readable {
	const archive = new ZipArchive({ zlib: { level: 6 } });

	(async () => {
		try {
			for (const entry of entries) {
				const source = await objects.getObject(entry.key);
				await new Promise<void>((resolve, reject) => {
					source.once("error", reject);
					source.once("end", resolve);
					archive.append(source, { name: entry.zip_path });
				});
			}
			await archive.finalize();
		} catch (err) {
			archive.destroy(err instanceof Error ? err : new Error(String(err)));
		}
	})();

	return archive;
}

/**
 * Ownership-checked zip of a selection of files/folders. A lone file has no zip-building to do -
 * callers should redirect straight to `files.getDownloadUrl` instead of calling this. Loose files sit
 * at the zip root; each folder keeps its own subtree, nested under its own name.
 */
export async function getSelectionZip(items: SelectionItem[]): Promise<Result<ZipResult>> {
	const { data: user, error } = await getUser();
	if (error) {
		return Err(error);
	}

	if (items.length === 0) {
		return Err(new BadRequest().setDebugCtx({ reason: "no items" }));
	}

	const fileIds = items.filter((item) => item.type === "file").map((item) => item.id);
	const folderIds = items.filter((item) => item.type === "folder").map((item) => item.id);

	const [files, folders] = await Promise.all([
		store.getFilesByIds({ ids: fileIds, user_id: user.id }),
		store.getFoldersByIds({ ids: folderIds, user_id: user.id }),
	]);

	if (files.length === 0 && folders.length === 0) {
		return Err(new NotFound().setDebugCtx({ items }));
	}

	const nodes: TopLevelNode[] = [
		...files.map(
			(file): TopLevelNode => ({ id: file.id, key: file.key, kind: "file", name: file.name, size: file.size }),
		),
		...folders.map((folder): TopLevelNode => ({ id: folder.id, kind: "folder", name: folder.name })),
	];

	const entries = await resolveZipEntries(nodes, user.id);

	const capsError = checkCaps(entries);
	if (capsError.error) {
		return Err(capsError.error);
	}

	const filename = folders.length === 1 && files.length === 0 ? `${folders[0].name}.zip` : "download.zip";

	return Ok({ filename, stream: buildArchive(entries) });
}
