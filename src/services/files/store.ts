import { and, eq } from "drizzle-orm";
import type { Transaction } from "@/db";
import { filesTable, foldersTable, type NewFile } from "@/db/schema";

export async function createFile(tx: Transaction, file: NewFile) {
	const [{ insertedId }] = await tx.insert(filesTable).values(file).returning({ insertedId: filesTable.id });
	return insertedId;
}

type UpdateUserFolderParams = {
	id: string;
	user_id: string;
	updated_at: Date;
};

export async function updateUserFolder(tx: Transaction, { id, user_id, updated_at }: UpdateUserFolderParams) {
	await tx
		.update(foldersTable)
		.set({ updated_at })
		.where(and(eq(foldersTable.id, id), eq(foldersTable.user_id, user_id)));
}
