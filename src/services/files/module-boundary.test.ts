import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// `files/index.ts` transitively imports "server-only" (via @/lib/api-errors, @/lib/db-errors),
// which isn't resolvable in this test environment - see the ancestor-chain-seam ticket notes.
// Reading the source is a stand-in for a runtime import test until that's fixed.
const source = readFileSync(path.join(import.meta.dirname, "index.ts"), "utf-8");

describe("files/index.ts module boundary", () => {
	it("does not reach into folders' internal store", () => {
		expect(source).not.toContain("@/services/folders/store");
	});

	it("calls the ancestor-touch through folders' public interface instead", () => {
		expect(source).toMatch(/import\s*\{[^}]*touchAncestorChain[^}]*\}\s*from\s*"@\/services\/folders"/);
	});
});
