import { PgDialect } from "drizzle-orm/pg-core";
import { describe, expect, it, vi } from "vitest";

const { execute } = vi.hoisted(() => ({ execute: vi.fn() }));

vi.mock("@/db", () => ({
	db: { execute },
}));

import { getBreadcrumbs } from "./store";

const dialect = new PgDialect();

describe("getBreadcrumbs", () => {
	it("builds the read on the shared ancestor-chain CTE, scoped to the user", async () => {
		execute.mockResolvedValue({ rows: [] });

		await getBreadcrumbs("folder-1", "user-1");

		expect(execute).toHaveBeenCalledTimes(1);
		const { sql, params } = dialect.sqlToQuery(execute.mock.calls[0]?.[0]);

		expect(sql).toContain("WITH RECURSIVE ancestor_chain AS (");
		expect(params).toEqual(["folder-1", "user-1", "user-1"]);
	});

	it("orders the result root-to-target, opposite of the walk's own target-to-root direction", async () => {
		execute.mockResolvedValue({ rows: [] });

		await getBreadcrumbs("folder-1", "user-1");

		const { sql } = dialect.sqlToQuery(execute.mock.calls[0]?.[0]);
		expect(sql).toContain("SELECT id, name, parent_id FROM ancestor_chain");
		expect(sql).toContain("ORDER BY distance DESC");
	});

	it("returns the driver's rows unchanged", async () => {
		const rows = [
			{ id: "root", name: "Root", parent_id: null },
			{ id: "folder-1", name: "Sub", parent_id: "root" },
		];
		execute.mockResolvedValue({ rows });

		const result = await getBreadcrumbs("folder-1", "user-1");

		expect(result).toBe(rows);
	});
});
