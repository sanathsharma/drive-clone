import { relations, sql } from "drizzle-orm";
import * as p from "drizzle-orm/pg-core";

export const filesTable = p.pgTable(
	"files",
	{
		created_at: p.timestamp({ withTimezone: true }).notNull().defaultNow(),
		id: p.uuid().primaryKey().default(sql`uuidv7()`),
		mime_type: p.varchar(),
		name: p.varchar().notNull(),
		parent_id: p.uuid().references(() => foldersTable.id, { onDelete: "cascade" }),
		size: p.integer().notNull(),
		updated_at: p.timestamp({ withTimezone: true }).notNull().defaultNow(),
		url: p.text().notNull(),
		user_id: p.uuid().notNull(),
	},
	(table) => [p.index("files_parent_id_idx").on(table.parent_id), p.index("files_user_id_idx").on(table.user_id)],
);

export const foldersTable = p.pgTable(
	"folders",
	{
		created_at: p.timestamp({ withTimezone: true }).notNull().defaultNow(),
		id: p.uuid().primaryKey().default(sql`uuidv7()`),
		name: p.varchar().notNull(),
		parent_id: p.uuid().references((): p.AnyPgColumn => foldersTable.id, { onDelete: "cascade" }),
		updated_at: p.timestamp({ withTimezone: true }).notNull().defaultNow(),
		user_id: p.uuid().notNull(),
	},
	(table) => [p.index("folders_parent_id_idx").on(table.parent_id), p.index("folders_user_id_idx").on(table.user_id)],
);

export const folderRelations = relations(foldersTable, (r) => ({
	parent: r.one(foldersTable, {
		fields: [foldersTable.parent_id],
		references: [foldersTable.id],
	}),
}));

export type File = typeof filesTable.$inferSelect;
export type NewFile = typeof filesTable.$inferInsert;

export type Folder = typeof foldersTable.$inferSelect;
export type NewFolder = typeof foldersTable.$inferInsert;
