import { readFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
	throw new Error("DATABASE_URL is not set");
}

const db = drizzle(neon(DATABASE_URL));

async function revert() {
	const [last] = await db
		.execute(sql`select * from drizzle.__drizzle_migrations order by created_at desc limit 1`)
		.then((r) => r.rows);
	if (!last) return console.log("No migrations to revert.");

	const hash = last.hash as string;
	const downPath = `./drizzle/down/${hash}.sql`; // your own convention
	const downSql = readFileSync(downPath, "utf-8");

	await db.execute(sql.raw(downSql));
	await db.execute(sql`delete from drizzle.__drizzle_migrations where hash = ${hash}`);
	console.log(`Reverted migration ${hash}`);
}

revert();
