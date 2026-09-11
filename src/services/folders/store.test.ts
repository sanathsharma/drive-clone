import { PgDialect } from "drizzle-orm/pg-core";
import { describe, expect, it, vi } from "vitest";
import type { Transaction } from "@/db";
import { touchAncestorChain } from "./store";

const dialect = new PgDialect();

function fakeTx(rowCount: number | null) {
	return { execute: vi.fn().mockResolvedValue({ rowCount }) } as unknown as Transaction & {
		execute: ReturnType<typeof vi.fn>;
	};
}

describe("touchAncestorChain", () => {
	it("builds a bulk update over the shared ancestor-chain CTE, scoped to the user", async () => {
		const tx = fakeTx(3);
		const updatedAt = new Date("2026-01-01T00:00:00.000Z");

		await touchAncestorChain(tx, { startFolderId: "folder-1", updated_at: updatedAt, user_id: "user-1" });

		expect(tx.execute).toHaveBeenCalledTimes(1);
		const { sql, params } = dialect.sqlToQuery(tx.execute.mock.calls[0]?.[0]);

		expect(sql).toContain("WITH RECURSIVE ancestor_chain AS (");
		expect(sql).toContain("UPDATE folders");
		expect(sql).toContain("WHERE id IN (SELECT id FROM ancestor_chain)");
		expect(params).toEqual(["folder-1", "user-1", "user-1", updatedAt]);
	});

	it("doesn't reorder the chain - the direction only matters for reads, not this bulk update", async () => {
		const tx = fakeTx(1);

		await touchAncestorChain(tx, { startFolderId: "folder-1", updated_at: new Date(), user_id: "user-1" });

		const { sql } = dialect.sqlToQuery(tx.execute.mock.calls[0]?.[0]);
		expect(sql).not.toContain("ORDER BY");
	});

	it("returns the number of folders touched, from the driver's rowCount", async () => {
		const tx = fakeTx(2);

		const touched = await touchAncestorChain(tx, {
			startFolderId: "folder-1",
			updated_at: new Date(),
			user_id: "user-1",
		});

		expect(touched).toBe(2);
	});

	it("returns 0 when nothing matched, e.g. a start folder that doesn't belong to the user", async () => {
		const tx = fakeTx(null);

		const touched = await touchAncestorChain(tx, {
			startFolderId: "someone-elses-folder",
			updated_at: new Date(),
			user_id: "user-1",
		});

		expect(touched).toBe(0);
	});
});
