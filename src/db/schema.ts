import { relations, sql } from "drizzle-orm";
import * as p from "drizzle-orm/pg-core";

export const filesTable = p.pgTable(
	"files",
	{
		created_at: p.timestamp({ withTimezone: true }).notNull().defaultNow(),
		file_name: p.varchar().notNull(),
		id: p.uuid().primaryKey().default(sql`uuidv7()`),
		mime_type: p.varchar(),
		parent_id: p.uuid().references(() => foldersTable.id),
		size: p.integer().notNull(),
		updated_at: p.timestamp({ withTimezone: true }).notNull().defaultNow(),
		url: p.text().notNull(),
		user_id: p.uuid().notNull(),
	},
	(table) => [p.index("files_parent_id_idx").on(table.parent_id)],
);

export const foldersTable = p.pgTable("folders", {
	created_at: p.timestamp({ withTimezone: true }).notNull().defaultNow(),
	id: p.uuid().primaryKey().default(sql`uuidv7()`),
	name: p.varchar().notNull(),
	parent_id: p.uuid().references((): p.AnyPgColumn => foldersTable.id),
	updated_at: p.timestamp({ withTimezone: true }).notNull().defaultNow(),
	user_id: p.uuid().notNull(),
});

export const folderRelations = relations(foldersTable, (r) => ({
	parent: r.one(foldersTable, {
		fields: [foldersTable.parent_id],
		references: [foldersTable.id],
	}),
}));
