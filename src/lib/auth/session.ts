import { NEON_AUTH_SESSION_COOKIE_NAME, NEON_AUTH_SESSION_DATA_COOKIE_NAME } from "@neondatabase/auth/server";
import * as jose from "jose";
import type { NextRequest } from "next/server";
import { config } from "@/constants";
import logger from "../logger";
import { auth } from "./server";

// createRemoteJWKSet caches the JWKS in memory and only refetches
// occasionally (on cache miss / rotation), so this is NOT a per-request network call
const JWKS = jose.createRemoteJWKSet(new URL(`${config.AUTH.BASE_URL}.well-known/jwks.json`));

export const getAccessToken = async (request: NextRequest) => {
	const token = request.cookies.get(NEON_AUTH_SESSION_DATA_COOKIE_NAME)?.value;
	if (token) {
		return token;
	}

	const sessionToken = request.cookies.get(NEON_AUTH_SESSION_COOKIE_NAME)?.value;
	if (!sessionToken) {
		return null;
	}

	// NOTE: Following implementation is not clean or ideal. Ideally I want to be simply verify the session without
	// having a delay introduced by network calls or neon-auth calls as it causes more delay due to far regions of neno
	// db that offers db, auth and storage services.
	//
	// This is not a too big of a problem because of the auth is handled in this project.
	// This shall only be required in the auth pages and this code never executes due to absence of session token cookie.
	//
	// Auth in rest of the project shall be handled through data-access-layer. The layer shall make sure the user is
	// authenticated and has right to access the data. Neon db calls made by the drizzle needs the access token, as
	// drizzle is a convenience wrapper around neon-db's http and websocket calls.
	const { data, error } = await auth.token();
	if (error) {
		return null;
	}
	return data.token;
};

export async function verifyAccessToken(accessToken: string | undefined) {
	if (!accessToken) return null;
	try {
		const { payload } = await jose.jwtVerify(accessToken, JWKS, {
			issuer: new URL(config.AUTH.BASE_URL).origin,
		});
		return payload; // has `sub` etc. — enough to know "logged in"
	} catch (error) {
		logger.debug(`[verifyAccessToken] error: invalid token`, error);
		return null; // missing, expired, or invalid
	}
}
