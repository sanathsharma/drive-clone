import "server-only";

import { type ApiError, Conflict, InternalServerError, NotFound } from "@/lib/api-errors";
import { Err, type Result } from "@/lib/result";

// See https://www.postgresql.org/docs/current/errcodes-appendix.html
const PG_ERROR_CODE = {
	CHECK_VIOLATION: "23514",
	FOREIGN_KEY_VIOLATION: "23503",
	NOT_NULL_VIOLATION: "23502",
	UNIQUE_VIOLATION: "23505",
} as const;

type PgError = Error & {
	code?: string;
	constraint?: string;
	table?: string;
	column?: string;
};

function isPgError(err: unknown): err is PgError {
	return err instanceof Error && typeof (err as PgError).code === "string";
}

/** Translates a thrown db driver error into an `Err<ApiError>`. Meant to be used as `.catch(mapDbError)`. */
export function mapDbError(err: unknown): Result<never, ApiError> {
	if (!isPgError(err)) {
		return Err(new InternalServerError().setDebugCtx({ error: err }));
	}

	switch (err.code) {
		case PG_ERROR_CODE.UNIQUE_VIOLATION:
			return Err(new Conflict().setDebugCtx({ error: err }));
		// FIXME: Only correct for insert/update, where the referenced row is missing. The same code fires on
		// delete (row still referenced elsewhere), which is a Conflict, not a NotFound - revisit if/when
		// this is used for delete paths.
		case PG_ERROR_CODE.FOREIGN_KEY_VIOLATION:
			return Err(new NotFound().setDebugCtx({ error: err }));
		default:
			return Err(new InternalServerError().setDebugCtx({ error: err }));
	}
}
