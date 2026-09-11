import { dbTx } from "@/db";
import type { NewFile } from "@/db/schema";
import type { Result } from "@/lib/api-errors";
import { mapDbError } from "@/lib/db-errors";
import { Err, Ok } from "@/lib/result";
import * as store from "@/services/files/store";
import { getUser } from "@/services/utils";

export type File_ForCreate = Omit<NewFile, "id" | "user_id" | "created_at" | "updated_at">;

export async function createFile(file: File_ForCreate): Promise<Result<string>> {
	const { data: user, error } = await getUser();
	if (error) {
		return Err(error);
	}

	return dbTx
		.transaction(async (tx) => {
			// If parent_id is present, update the timestamp. This also confirms that the parent belongs to the user and file
			// can be created under it.
			if (file.parent_id) {
				await store.updateUserFolder(tx, {
					id: file.parent_id,
					updated_at: new Date(),
					user_id: user.id,
				});
			}

			return store.createFile(tx, { ...file, user_id: user.id });
		})
		.then(Ok)
		.catch(mapDbError);
}
