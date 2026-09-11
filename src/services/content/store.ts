import { and, asc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { filesTable, foldersTable } from "@/db/schema";
import { ANCESTOR_CHAIN_CTE, ancestorChain } from "@/services/ancestor-chain";

export const getFiles = (folderId: string, userId: string) => {
	return db
		.select()
		.from(filesTable)
		.where(and(eq(filesTable.user_id, userId), eq(filesTable.parent_id, folderId)))
		.orderBy(asc(filesTable.name));
};

export const getFolders = (parentId: string, userId: string) => {
	return db
		.select()
		.from(foldersTable)
		.where(and(eq(foldersTable.user_id, userId), eq(foldersTable.parent_id, parentId)))
		.orderBy(asc(foldersTable.name));
};

export type Crumb = {
	id: string;
	name: string;
	parent_id: string;
	distance: number;
};

export const getBreadcrumbs = async (currentFolderId: string, userId: string) => {
	const query = sql`
		${ancestorChain({ startFolderId: currentFolderId, userId })}
		SELECT id, name, parent_id FROM ${sql.raw(ANCESTOR_CHAIN_CTE)}
		ORDER BY distance DESC;
	`;

	const { rows } = await db.execute(query);
	return rows as Crumb[];
};
