import { and, eq } from "drizzle-orm";
import type { Transaction } from "@/db";
import { filesTable, type NewFile } from "@/db/schema";

export async function createFile(tx: Transaction, file: NewFile) {
	const [{ insertedId }] = await tx.insert(filesTable).values(file).returning({ insertedId: filesTable.id });
	return insertedId;
}

type DeleteFileParams = {
	id: string;
	user_id: string;
};

/** Deletes the file. Returns its former parent_id, or undefined if no matching row was found. */
export async function deleteFile(tx: Transaction, { id, user_id }: DeleteFileParams) {
	const [deleted] = await tx
		.delete(filesTable)
		.where(and(eq(filesTable.id, id), eq(filesTable.user_id, user_id)))
		.returning({ parent_id: filesTable.parent_id });

	return deleted;
}
