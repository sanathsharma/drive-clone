### Github component profiling with storybook

See https://github.github.com/storybook-addon-performance-panel/

### Sample translations for form errors

```json
{
	"errors": {
		"after": "must be after {expected} (was {actual})",

		"alias": "must be a valid {expected}",
		"before": "must be before {expected} (was {actual})",

		"default": "{expected} (was {actual})",
		"divisor": "must be divisible by {divisor} (was {actual})",
		"domain": "must be {expected}",
		"exactLength": "must be exactly {exactLength} characters long (was {actual})",
		"index": "[{key}] must be {expected}",
		"intersection": "must be {expected}",
		"max": "must be at most {max} (was {actual})",
		"maxLength": "must be at most {maxLength} characters long (was {actual})",
		"min": "must be at least {min} (was {actual})",
		"minLength": "must be at least {minLength} characters long (was {actual})",
		"morph": "must be valid input for {expected}",
		"optional": "must be {expected}",

		"pattern": "must match {expected} (was {actual})",
		"predicate": "must satisfy {expected}",
		"proto": "must be an instance of {expected}",

		"required": "must be {expected}",
		"sequence": "must be a tuple of {expected}",

		"structure": "must be an object satisfying {expected}",
		"union": "must be {expected}",
		"unit": "must be {expected}"
	},
}
```
## Production readiness

Beyond the feature set, a few things here matter for running this as a real product rather than a demo.

- **Internationalization.** Routes live under `src/app/[locale]`, and `next-intl` pulls copy from `translations/en.json` (`src/i18n/routing.ts`). Adding a locale means adding a translation file and a routing entry, not touching page logic.
- **Authentication.** Neon Auth (a Better Auth adapter, `src/lib/auth/server.ts`) handles sign-up, sign-in, session cookies, and password reset. Middleware (`src/proxy.tsx`) verifies the session token on every request, and the file download route re-checks ownership before issuing a presigned URL (see ADR-0001) instead of trusting the client.
- **Server actions with real validation.** Mutations under `src/actions/**` run as Next.js server actions, validate their input with `arktype`, and call `revalidatePath` on success, so there's no separate REST layer to keep in sync with the UI.
- **Direct-to-storage transfers.** Uploads go straight from the browser to object storage via a presigned `PUT`, and single-file downloads redirect to a presigned `GET` (ADR-0001). File bytes never stream through the app server on that path, so transfer size and bandwidth don't compete with the server's own capacity.
- **Security headers.** `next.config.ts` sets `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, and a restrictive `Content-Security-Policy` on the service worker route, and turns off the `X-Powered-By` header.
- **Typed data layer.** Drizzle ORM against Postgres (Neon) generates migrations and query types from one schema, and `arktype` validates config and action input at runtime.
- **CI-shaped quality gates.** `biome`, `eslint`, `stylelint`, and `tsc --noEmit` all run through the `just`/`bun` scripts, and the test suite (`vitest`, Storybook interaction tests, Playwright) runs the same way locally and in Docker (`test:docker`).
- **Responsive UI.** The content table, breadcrumbs, actions panel, and search collapse into a mobile layout instead of assuming desktop only.

## Known performance limits

Two tradeoffs in the current setup are deliberate scope cuts, not oversights.

**Neon's database runs as a single-region (US) deployment.** US regions are the only ones where Neon offers auth, database, and object storage together; a region closer to India, like Singapore, doesn't carry the full set. Picking US keeps all three services on one provider instead of splitting object storage or auth off to a different vendor. Users outside the US pay extra round-trip latency on every request; there's no read replica or multi-region setup to absorb it.

**Folder and multi-select zip downloads run synchronously on the single Next.js server, with no separate worker process** (see ADR-0002). The server fetches each file from object storage and re-streams it as the zip response, paying the storage-to-server bandwidth cost that single-file downloads avoid by redirecting straight to a presigned URL. Several large zip downloads running at once compete for that same server's bandwidth and CPU (zip compression), and there's no queue or worker fleet to spread that load across. The 500-file / 2GB cap on zip downloads is a stopgap against that, not a fix for it.
