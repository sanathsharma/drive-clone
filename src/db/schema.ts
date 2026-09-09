import { sql } from "drizzle-orm";
import * as p from "drizzle-orm/pg-core";

export const categoriesTable = p.pgTable("categories", {
	created_at: p.timestamp({ withTimezone: true }).notNull().defaultNow(),
	description: p.varchar(),
	id: p.uuid().primaryKey().default(sql`uuidv7()`),
	name: p.varchar().notNull(),
	updated_at: p.timestamp({ withTimezone: true }).notNull().defaultNow(),
});

export const productsTable = p.pgTable("products", {
	barcode: p.varchar(),
	category_id: p.uuid().references(() => categoriesTable.id),
	created_at: p.timestamp({ withTimezone: true }).notNull().defaultNow(),
	description: p.varchar(),
	id: p.uuid().primaryKey().default(sql`uuidv7()`),
	image_url: p.varchar(),
	name: p.varchar().notNull(),
	price: p.numeric().notNull(),
	stock: p.integer().notNull(),
	updated_at: p.timestamp({ withTimezone: true }).notNull().defaultNow(),
});

export const salesTable = p.pgTable("sales", {
	created_at: p.timestamp({ withTimezone: true }).notNull().defaultNow(),
	customer_name: p.varchar().notNull(),
	date: p.timestamp({ withTimezone: true }).notNull(),
	id: p.uuid().primaryKey().default(sql`uuidv7()`),
	total: p.numeric().notNull(),
	updated_at: p.timestamp({ withTimezone: true }).notNull().defaultNow(),
});

export const saleItemsTable = p.pgTable("sale_items", {
	created_at: p.timestamp({ withTimezone: true }).notNull().defaultNow(),
	id: p.uuid().primaryKey().default(sql`uuidv7()`),
	price: p.numeric().notNull(),
	product_id: p.uuid().references(() => productsTable.id),
	quantity: p.integer().notNull(),
	sale_id: p.uuid().references(() => salesTable.id),
	updated_at: p.timestamp({ withTimezone: true }).notNull().defaultNow(),
});
