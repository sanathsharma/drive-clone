import { dbTx } from "@/db";
import type { NewFolder } from "@/db/schema";
import { NotFound, type Result } from "@/lib/api-errors";
import { mapTxError } from "@/lib/db-errors";
import { Err, Ok } from "@/lib/result";
import * as store from "@/services/folders/store";
import { getUser } from "@/services/utils";

export type Folder_ForCreate = Omit<NewFolder, "id" | "user_id" | "created_at" | "updated_at">;

/**
 * Bumps `updated_at` on the folder at `startFolderId` and every ancestor above it up to the root.
 * Exposed so other modules (e.g. `files`) can cascade a touch within their own transaction instead
 * of reaching into folders' internal store.
 */
export const touchAncestorChain = store.touchAncestorChain;

export async function createFolder(folder: Folder_ForCreate): Promise<Result<string>> {
	const { data: user, error } = await getUser();
	if (error) {
		return Err(error);
	}

	return dbTx
		.transaction(async (tx) => {
			// If parent_id is present, touch it and everything above it. Also confirms the parent belongs
			// to the user and the folder can be created under it.
			if (folder.parent_id) {
				const touched = await store.touchAncestorChain(tx, {
					startFolderId: folder.parent_id,
					updated_at: new Date(),
					user_id: user.id,
				});
				if (touched === 0) {
					throw new NotFound().setDebugCtx({ parent_id: folder.parent_id });
				}
			}

			return store.createFolder(tx, { ...folder, user_id: user.id });
		})
		.then(Ok)
		.catch(mapTxError);
}

export async function deleteFolder(id: string): Promise<Result<void>> {
	const { data: user, error } = await getUser();
	if (error) {
		return Err(error);
	}

	return dbTx
		.transaction(async (tx) => {
			const deleted = await store.deleteFolder(tx, { id, user_id: user.id });
			if (!deleted) {
				throw new NotFound().setDebugCtx({ id });
			}

			if (deleted.parent_id) {
				await store.touchAncestorChain(tx, {
					startFolderId: deleted.parent_id,
					updated_at: new Date(),
					user_id: user.id,
				});
			}
		})
		.then(() => Ok(undefined))
		.catch(mapTxError);
}
