// Local ESLint rule enforcing module privacy inside `src/services/`.
//
// A services module's internals (its store, helpers, anything besides its
// `index.ts`) are private to that module. Other code - sibling modules or
// anything outside `src/services/` - may only import from the module's
// public entry point: `@/services/<module>`, whether reached via the `@/*`
// alias or a relative path.
//
// See `src/services/README.md` for the convention this rule enforces.

import path from "node:path";

const SERVICES_PATH = /\/src\/services\/([^/]+)(?:\/(.+))?$/;

function toPosix(filePath) {
	return filePath.replaceAll("\\", "/");
}

function ownModuleOf(filename) {
	return toPosix(filename).match(SERVICES_PATH)?.[1];
}

// Resolves an import specifier - alias or relative - to the services module
// and internal path it points at, if any.
function resolveServicesTarget(filename, specifier) {
	let resolvedPath;
	if (specifier.startsWith("@/services/")) {
		resolvedPath = `/src/${specifier.slice("@/".length)}`;
	} else if (specifier.startsWith(".")) {
		const dir = path.posix.dirname(toPosix(filename));
		resolvedPath = path.posix.normalize(path.posix.join(dir, specifier));
	} else {
		return null;
	}

	const match = resolvedPath.match(SERVICES_PATH);
	if (!match) return null;

	const [, targetModule, rest] = match;
	return { rest, targetModule };
}

function isEntryPoint(rest) {
	return !rest || rest === "index" || rest.startsWith("index.");
}

/** @param {import("eslint").Rule.RuleContext} context */
function checkSource(context, node) {
	if (!node || typeof node.value !== "string") return;

	const filename = context.filename ?? context.getFilename();
	const target = resolveServicesTarget(filename, node.value);
	if (!target || isEntryPoint(target.rest)) return;

	if (target.targetModule === ownModuleOf(filename)) return;

	context.report({
		data: target,
		messageId: "noInternalReach",
		node,
	});
}

/** @type {import("eslint").Rule.RuleModule} */
const noCrossModuleInternals = {
	create(context) {
		return {
			ExportAllDeclaration(node) {
				checkSource(context, node.source);
			},
			ExportNamedDeclaration(node) {
				checkSource(context, node.source);
			},
			ImportDeclaration(node) {
				checkSource(context, node.source);
			},
			ImportExpression(node) {
				checkSource(context, node.source);
			},
		};
	},
	meta: {
		docs: {
			description:
				"Disallow reaching into another services module's internals; import through its public entry point instead.",
		},
		messages: {
			noInternalReach:
				'Import from "@/services/{{targetModule}}" (its public entry point) instead of reaching into "@/services/{{targetModule}}/{{rest}}".',
		},
		schema: [],
		type: "problem",
	},
};

const servicesBoundary = {
	rules: {
		"no-cross-module-internals": noCrossModuleInternals,
	},
};

export default servicesBoundary;
