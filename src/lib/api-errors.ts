import "server-only";

import { NextResponse } from "next/server";
import { HTTP_STATUS, type HttpStatus } from "@/lib/http-status";
import type { Result as TResult } from "@/lib/result";
import logger from "./logger";

export type Result<T> = TResult<T, ApiError>;

export class ApiError<D extends Record<string, unknown> = Record<string, unknown>> extends Error {
	/**
	 * Details that can't be sent to the client.
	 * Shall be logged on server for debugging purposes
	 */
	private _debugCtx?: Record<string, unknown>;

	constructor(
		public readonly code: string,
		public readonly status: HttpStatus,
		/** Details that can be sent to the client */
		private details = {} as D,
	) {
		super(code);
	}

	setDebugCtx(details: Record<string, unknown>): this {
		this._debugCtx = details;
		return this;
	}

	get debugCtx(): Record<string, unknown> | undefined {
		return this._debugCtx;
	}

	/** Serializes the error to be sent to the client */
	toJSON() {
		return {
			error: {
				code: this.code,
				...(this.details && { details: this.details }),
			},
		};
	}

	toNextResponse() {
		logger.debug({ client_error: this.toJSON(), server_details: this.debugCtx, status: this.status });
		return NextResponse.json(this.toJSON(), { status: this.status });
	}
}

export function createError<D extends Record<string, unknown>>(code: string, status: HttpStatus) {
	return class extends ApiError<D> {
		constructor(details = {} as D) {
			super(code, status, details);
		}
	};
}

export const Unauthenticated = createError("UNAUTHORIZED", HTTP_STATUS.UNAUTHORIZED);
export const Unauthorized = createError("FORBIDDEN", HTTP_STATUS.FORBIDDEN);
export const NotFound = createError("NOT_FOUND", HTTP_STATUS.NOT_FOUND);
export const Conflict = createError("CONFLICT", HTTP_STATUS.CONFLICT);
export const InternalServerError = createError("INTERNAL_SERVER_ERROR", HTTP_STATUS.INTERNAL_SERVER_ERROR);
