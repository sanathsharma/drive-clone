import type { File, Folder } from "@/db/schema";

export type Row = ({ type: "folder" } & Folder) | ({ type: "file" } & File);

export type SortKey = "name" | "updated_at" | "created_at";
export type SortDirection = "asc" | "desc";

export type SortState = {
	key: SortKey;
	direction: SortDirection;
};
