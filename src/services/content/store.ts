import { and, asc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { filesTable, foldersTable } from "@/db/schema";

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
	depth: number;
};

export const getBreadcrumbs = async (currentFolderId: string, userId: string) => {
	const query = sql`
		WITH RECURSIVE folder_tree AS (
				SELECT id, name, parent_id, 1 AS depth
				FROM folders
				WHERE id = ${currentFolderId}
					AND user_id = ${userId}

				UNION ALL

				SELECT f.id, f.name, f.parent_id, ft.depth + 1
				FROM folders f
				INNER JOIN folder_tree ft ON f.parent_id = ft.id
				WHERE f.user_id = ${userId}
		)
		SELECT * FROM folder_tree
		ORDER BY depth;
	`;

	const { rows } = await db.execute(query);
	return rows as Crumb[];
};
