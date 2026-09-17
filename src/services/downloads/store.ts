import { and, eq, inArray, sql } from "drizzle-orm";
import { db } from "@/db";
import { filesTable, foldersTable } from "@/db/schema";
import { DESCENDANT_CHAIN_CTE, descendantChain } from "@/services/descendant-chain";

// Raw db shape, intentionally - see services/README.md#return-and-param-shapes-at-the-seam
export type SubtreeFolder = { id: string; parent_id: string | null; name: string };
export type SubtreeFile = { id: string; parent_id: string; name: string; key: string; size: number };

type ByIdsParams = { ids: string[]; user_id: string };

export async function getFilesByIds({ ids, user_id }: ByIdsParams) {
	if (ids.length === 0) {
		return [];
	}

	return db
		.select({ id: filesTable.id, key: filesTable.key, name: filesTable.name, size: filesTable.size })
		.from(filesTable)
		.where(and(inArray(filesTable.id, ids), eq(filesTable.user_id, user_id)));
}

export async function getFoldersByIds({ ids, user_id }: ByIdsParams) {
	if (ids.length === 0) {
		return [];
	}

	return db
		.select({ id: foldersTable.id, name: foldersTable.name })
		.from(foldersTable)
		.where(and(inArray(foldersTable.id, ids), eq(foldersTable.user_id, user_id)));
}

type GetSubtreeFoldersParams = { rootFolderIds: string[]; user_id: string };

/** Every folder nested (at any depth) under any of `rootFolderIds`, including the roots themselves. */
export async function getSubtreeFolders({ rootFolderIds, user_id }: GetSubtreeFoldersParams): Promise<SubtreeFolder[]> {
	if (rootFolderIds.length === 0) {
		return [];
	}

	const query = sql`
		${descendantChain({ rootFolderIds, userId: user_id })}
		SELECT id, parent_id, name FROM ${sql.raw(DESCENDANT_CHAIN_CTE)}
	`;

	const { rows } = await db.execute(query);
	return rows as SubtreeFolder[];
}

type GetSubtreeFilesParams = { folderIds: string[]; user_id: string };

/** Every file whose direct parent is one of `folderIds` (typically a subtree's folder ids, roots included). */
export async function getSubtreeFiles({ folderIds, user_id }: GetSubtreeFilesParams): Promise<SubtreeFile[]> {
	if (folderIds.length === 0) {
		return [];
	}

	const files = await db
		.select({
			id: filesTable.id,
			key: filesTable.key,
			name: filesTable.name,
			parent_id: filesTable.parent_id,
			size: filesTable.size,
		})
		.from(filesTable)
		.where(and(inArray(filesTable.parent_id, folderIds), eq(filesTable.user_id, user_id)));

	return files as SubtreeFile[];
}
