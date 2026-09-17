import { and, eq, inArray, type SQL, sql } from "drizzle-orm";
import { foldersTable } from "@/db/schema";

type DescendantChainParams = {
	rootFolderIds: string[];
	userId: string;
};

/** Name of the CTE `descendantChain()` defines - reference this, not a hand-typed literal, when composing a query around it. */
export const DESCENDANT_CHAIN_CTE = "descendant_chain";

/**
 * Recursive CTE named `DESCENDANT_CHAIN_CTE`, walking from every id in `rootFolderIds` down to each
 * folder in its subtree, scoped to `userId`. Rows carry (id, parent_id), and include the roots
 * themselves. A root id that doesn't exist or isn't owned by `userId` simply contributes no rows.
 *
 * A bare CTE isn't a runnable statement on its own - embed this as the head of a larger query, e.g.
 * `SELECT id FROM ${sql.raw(DESCENDANT_CHAIN_CTE)}` to read every folder in the subtrees.
 */
export function descendantChain({ rootFolderIds, userId }: DescendantChainParams): SQL {
	return sql`
		WITH RECURSIVE ${sql.raw(DESCENDANT_CHAIN_CTE)} AS (
			SELECT id, parent_id, name
			FROM folders
			WHERE ${and(inArray(foldersTable.id, rootFolderIds), eq(foldersTable.user_id, userId))}

			UNION ALL

			SELECT f.id, f.parent_id, f.name
			FROM folders f
			INNER JOIN ${sql.raw(DESCENDANT_CHAIN_CTE)} dc ON f.parent_id = dc.id
			WHERE f.user_id = ${userId}
		)
	`;
}
