import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { paths } from "@/constants/paths";
import { routing } from "./i18n/routing";
import { getAccessToken, verifyAccessToken } from "./lib/auth/session";

const localProxy = createMiddleware(routing);

const checkAuthenticationStatus = async (request: NextRequest) => {
	const token = await getAccessToken(request);
	if (!token) {
		return false;
	}
	const claims = await verifyAccessToken(token);
	return !!claims?.sub;
};

async function keepLoggedInUsersOut(request: NextRequest) {
	const isLoggedIn = await checkAuthenticationStatus(request);
	if (isLoggedIn) {
		return NextResponse.redirect(new URL(paths.dashboard(), request.url));
	}
	return localProxy(request);
}

export function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;

	if (pathname.startsWith("/auth")) {
		return keepLoggedInUsersOut(request);
	}

	return localProxy(request);
}

export const config = {
	// Match all pathnames except for
	// - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
	// - … the ones containing a dot (e.g. `favicon.ico`)
	matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
