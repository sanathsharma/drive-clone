import { RuleTester } from "eslint";
import { describe, it } from "vitest";
import plugin from "./services-boundary.mjs";

// ESLint's RuleTester defaults to Mocha's global describe/it, which vitest doesn't
// provide as globals. Point it at vitest's instead.
RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester({
	languageOptions: {
		ecmaVersion: 2022,
		sourceType: "module",
	},
});

ruleTester.run("no-cross-module-internals", plugin.rules["no-cross-module-internals"], {
	invalid: [
		{
			// Sibling module's internals reached from another services module.
			code: `import { touchAncestorChain } from "@/services/folders/store";`,
			errors: [{ messageId: "noInternalReach" }],
			filename: "/repo/src/services/files/index.ts",
		},
		{
			// Same violation, but from outside the services layer entirely.
			code: `import { getFolders } from "@/services/content/store";`,
			errors: [{ messageId: "noInternalReach" }],
			filename: "/repo/src/app/api/route.ts",
		},
		{
			// Re-exports count too.
			code: `export { helper } from "@/services/folders/internal/helper";`,
			errors: [{ messageId: "noInternalReach" }],
			filename: "/repo/src/services/files/index.ts",
		},
		{
			// Dynamic imports count too.
			code: `const store = await import("@/services/folders/store");`,
			errors: [{ messageId: "noInternalReach" }],
			filename: "/repo/src/services/files/index.ts",
		},
		{
			// Relative paths are just as much a reach into internals as the alias form.
			code: `import { touchAncestorChain } from "../folders/store";`,
			errors: [{ messageId: "noInternalReach" }],
			filename: "/repo/src/services/files/index.ts",
		},
		{
			// Same violation, escaping the services layer via relative segments.
			code: `import { getFolders } from "../../services/content/store";`,
			errors: [{ messageId: "noInternalReach" }],
			filename: "/repo/src/app/api/route.ts",
		},
	],
	valid: [
		{
			// Cross-module import through the target module's public entry point.
			code: `import { touchAncestorChain } from "@/services/folders";`,
			filename: "/repo/src/services/files/index.ts",
		},
		{
			// A module reaching into its own internals is fine.
			code: `import * as store from "@/services/files/store";`,
			filename: "/repo/src/services/files/index.ts",
		},
		{
			// A module reaching into its own internals via a relative path is fine.
			code: `import { getBreadcrumbs } from "./store";`,
			filename: "/repo/src/services/content/index.ts",
		},
		{
			// Explicit entry-point file is equivalent to the bare module import.
			code: `import { ancestorChain } from "@/services/ancestor-chain/index";`,
			filename: "/repo/src/services/folders/store.ts",
		},
		{
			// Same, with an explicit extension.
			code: `import { ancestorChain } from "@/services/ancestor-chain/index.ts";`,
			filename: "/repo/src/services/folders/store.ts",
		},
		{
			// A relative path reaching another module's entry point (not its internals) is fine.
			code: `import { touchAncestorChain } from "../folders";`,
			filename: "/repo/src/services/files/index.ts",
		},
		{
			// Non-services imports are untouched.
			code: `import { NotFound } from "@/lib/api-errors";`,
			filename: "/repo/src/services/files/index.ts",
		},
	],
});
