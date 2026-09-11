import { and, eq, sql } from "drizzle-orm";
import type { Transaction } from "@/db";
import { foldersTable, type NewFolder } from "@/db/schema";
import { ANCESTOR_CHAIN_CTE, ancestorChain } from "@/services/ancestor-chain";

export async function createFolder(tx: Transaction, folder: NewFolder) {
	const [{ insertedId }] = await tx.insert(foldersTable).values(folder).returning({ insertedId: foldersTable.id });
	return insertedId;
}

type DeleteFolderParams = {
	id: string;
	user_id: string;
};

/** Deletes the folder (cascading to its whole subtree). Returns its former parent_id, or undefined if no matching row was found. */
export async function deleteFolder(tx: Transaction, { id, user_id }: DeleteFolderParams) {
	const [deleted] = await tx
		.delete(foldersTable)
		.where(and(eq(foldersTable.id, id), eq(foldersTable.user_id, user_id)))
		.returning({ parent_id: foldersTable.parent_id });

	return deleted;
}

type TouchAncestorChainParams = {
	startFolderId: string;
	user_id: string;
	updated_at: Date;
};

/**
 * Bumps `updated_at` on the folder at `startFolderId` and every ancestor above it up to the root,
 * in one recursive query. Returns the number of folders touched - 0 means `startFolderId` doesn't
 * exist or doesn't belong to `user_id`, which callers use as the ownership check on a
 * client-supplied parent_id.
 */
export async function touchAncestorChain(
	tx: Transaction,
	{ startFolderId, user_id, updated_at }: TouchAncestorChainParams,
) {
	const result = await tx.execute(sql`
		${ancestorChain({ startFolderId, userId: user_id })}
		UPDATE folders
		SET updated_at = ${updated_at}
		WHERE id IN (SELECT id FROM ${sql.raw(ANCESTOR_CHAIN_CTE)})
	`);

	return result.rowCount ?? 0;
}
