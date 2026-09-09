import { type } from "arktype";

const schema = type({
	AUTH: {
		BASE_URL: "string.url",
		COOKIE_SECRET: "string",
	},
	// Direct connection url for migrations
	DATABASE_URL: "string.url",
	// Connection url for pooled connections (for http and websocket queries)
	DATABASE_URL_POOLED: "string.url",
});

function validate() {
	const result = schema({
		AUTH: {
			BASE_URL: process.env.NEON_AUTH_BASE_URL,
			COOKIE_SECRET: process.env.NEON_AUTH_COOKIE_SECRET,
		},
		DATABASE_URL: process.env.DATABASE_URL,
		DATABASE_URL_POOLED: process.env.DATABASE_URL_POOLED,
	});

	if (result instanceof type.errors) {
		throw new Error(`Invalid config: ${result.summary}`);
	}

	return result;
}

export const config = validate();
