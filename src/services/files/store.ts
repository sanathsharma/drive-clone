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
