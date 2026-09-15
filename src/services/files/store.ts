import { and, eq } from "drizzle-orm";
import { db, type Transaction } from "@/db";
import { filesTable, type NewFile } from "@/db/schema";

export async function createFile(tx: Transaction, file: NewFile) {
	const [{ insertedId }] = await tx.insert(filesTable).values(file).returning({ insertedId: filesTable.id });
	return insertedId;
}

type DeleteFileParams = {
	id: string;
	user_id: string;
};

/** Deletes the file. Returns its former parent_id and storage key, or undefined if no matching row was found. */
export async function deleteFile(tx: Transaction, { id, user_id }: DeleteFileParams) {
	const [deleted] = await tx
		.delete(filesTable)
		.where(and(eq(filesTable.id, id), eq(filesTable.user_id, user_id)))
		.returning({ key: filesTable.key, parent_id: filesTable.parent_id });

	return deleted;
}

type RenameFileParams = {
	id: string;
	user_id: string;
	name: string;
};

/** Renames the file. Returns true if a row was updated, false if no matching row was found (wrong id, or not owned by user_id). */
export async function renameFile(tx: Transaction, { id, user_id, name }: RenameFileParams) {
	const result = await tx
		.update(filesTable)
		.set({ name, updated_at: new Date() })
		.where(and(eq(filesTable.id, id), eq(filesTable.user_id, user_id)));

	return (result.rowCount ?? 0) > 0;
}

type GetFileParams = {
	id: string;
	user_id: string;
};

export async function getFile({ id, user_id }: GetFileParams) {
	const [file] = await db
		.select({ key: filesTable.key, name: filesTable.name })
		.from(filesTable)
		.where(and(eq(filesTable.id, id), eq(filesTable.user_id, user_id)));

	return file;
}
