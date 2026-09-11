import { PgDialect } from "drizzle-orm/pg-core";
import { describe, expect, it } from "vitest";
import { ancestorChain } from ".";

const dialect = new PgDialect();

describe("ancestorChain", () => {
	it("scopes both the anchor and the recursive arm to the given user", () => {
		const { sql, params } = dialect.sqlToQuery(ancestorChain({ startFolderId: "folder-1", userId: "user-1" }));

		expect(sql).toContain("WHERE id = $1 AND user_id = $2");
		expect(sql).toContain("WHERE f.user_id = $3");
		expect(params).toEqual(["folder-1", "user-1", "user-1"]);
	});

	it("walks from the start folder toward the root via parent_id, not the reverse", () => {
		const { sql } = dialect.sqlToQuery(ancestorChain({ startFolderId: "folder-1", userId: "user-1" }));

		expect(sql).toContain("INNER JOIN ancestor_chain ac ON f.id = ac.parent_id");
	});

	it("is a bare CTE, not a runnable statement on its own", () => {
		const { sql } = dialect.sqlToQuery(ancestorChain({ startFolderId: "folder-1", userId: "user-1" }));

		expect(sql.trim().startsWith("WITH RECURSIVE ancestor_chain AS (")).toBe(true);
		expect(sql.trim().endsWith(")")).toBe(true);
	});
});
