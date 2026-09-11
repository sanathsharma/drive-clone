# Services

Each directory under `src/services/` is a module with one public entry point: its `index.ts`. Everything else in the module - `store.ts`, other helper files - is private to that module.

## The rule

- Import a module only as `@/services/<module>` (its `index.ts`). Never `@/services/<module>/store` or any other path into its internals.
- Reaching into your *own* module's internals is fine, e.g. `files/index.ts` importing `./store` or `@/services/files/store`.
- This applies everywhere: other service modules, API routes, anything outside `src/services/`.

```ts
// Good - through the public entry point
import { touchAncestorChain } from "@/services/folders";

// Bad - reaches past the entry point into folders' internals
import { touchAncestorChain } from "@/services/folders/store";
```

If a module needs something another module doesn't expose yet, export it from that module's `index.ts` rather than reaching around it.

## Return and param shapes at the seam

Public functions pass Drizzle's row types through as-is - `File`, `Folder`, `NewFile`, `NewFolder` (and the `Omit<...>` variants used for create params) go straight from `db/schema` to the service boundary, snake_case columns included. There's no domain-shaped normalization layer.

This is deliberate, not a placeholder: the schema already defines the domain vocabulary (`parent_id`, `user_id`, `created_at`, ...), so there's no separate "domain shape" to translate into - a mapping layer would just re-type the same fields under a case convention no caller needs. `content`'s hand-written `Crumb` type (a projection off a raw SQL query, not a Drizzle-inferred type) keeps the same snake_case fields, for consistency with this decision.

If a real caller ever needs a different shape (e.g. a JSON API that wants camelCase), add the mapping at *that* seam rather than reopening this one.

## Enforcement

The `services-boundary/no-cross-module-internals` ESLint rule (`eslint-rules/services-boundary.mjs`) fails any import that reaches past a module's `index.ts` into its internals. It runs as part of `npm run lint`, so a violation fails CI.

## Adding a new module

Give it its own directory with an `index.ts` as the public entry point. The boundary rule applies automatically - no per-module configuration needed.
