import { type SQL, sql } from "drizzle-orm";

type AncestorChainParams = {
	startFolderId: string;
	userId: string;
};

/** Name of the CTE `ancestorChain()` defines - reference this, not a hand-typed literal, when composing a query around it. */
export const ANCESTOR_CHAIN_CTE = "ancestor_chain";

/**
 * Recursive CTE named `ANCESTOR_CHAIN_CTE`, walking from `startFolderId` up to the root folder,
 * scoped to `userId`. Rows carry (id, name, parent_id, distance), with distance 0 at the start
 * folder and increasing toward the root.
 *
 * A bare CTE isn't a runnable statement on its own - embed this as the head of a larger query,
 * e.g. `SELECT ... FROM ${sql.raw(ANCESTOR_CHAIN_CTE)}` for an ordered read, or
 * `UPDATE folders ... WHERE id IN (SELECT id FROM ${sql.raw(ANCESTOR_CHAIN_CTE)})` for a bulk write.
 */
export function ancestorChain({ startFolderId, userId }: AncestorChainParams): SQL {
	return sql`
		WITH RECURSIVE ${sql.raw(ANCESTOR_CHAIN_CTE)} AS (
			SELECT id, name, parent_id, 0 AS distance
			FROM folders
			WHERE id = ${startFolderId} AND user_id = ${userId}

			UNION ALL

			SELECT f.id, f.name, f.parent_id, ac.distance + 1
			FROM folders f
			INNER JOIN ${sql.raw(ANCESTOR_CHAIN_CTE)} ac ON f.id = ac.parent_id
			WHERE f.user_id = ${userId}
		)
	`;
}
