import "server-only";

import { createNeonAuth, type NeonAuthLogLevel } from "@neondatabase/auth/next/server";
import { config } from "@/constants";
import logger from "@/lib/logger";

const getLogLevel = (): NeonAuthLogLevel => {
	const logLevel = logger.getLevel();

	const map = {
		0: "debug", // map trace to debug as there is no trace level in neon-auth
		1: "debug", // verbose proxy/upstream logging
		2: "info",
		3: "warn",
		4: "error",
		5: "silent", // disable Managed Better Auth logging
	} as const;

	return map[logLevel as keyof typeof map] || "silent";
};

export const auth = createNeonAuth({
	baseUrl: config.AUTH.BASE_URL,
	cookies: {
		secret: config.AUTH.COOKIE_SECRET,
		// sessionDataTtl: 300, // optional session_data cache TTL in seconds (default: 300)
	},
	logLevel: getLogLevel(),
});
