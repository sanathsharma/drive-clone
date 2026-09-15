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
	S3: {
		ACCESS_KEY_ID: "string",
		ENDPOINT_URL: "string.url",
		REGION: "string",
		SECRET_ACCESS_KEY: "string",
	},
});

function validate() {
	const result = schema({
		AUTH: {
			BASE_URL: process.env.NEON_AUTH_BASE_URL,
			COOKIE_SECRET: process.env.NEON_AUTH_COOKIE_SECRET,
		},
		DATABASE_URL: process.env.DATABASE_URL,
		DATABASE_URL_POOLED: process.env.DATABASE_URL_POOLED,
		S3: {
			ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
			ENDPOINT_URL: process.env.AWS_ENDPOINT_URL_S3,
			REGION: process.env.AWS_REGION,
			SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
		},
	});

	if (result instanceof type.errors) {
		throw new Error(`Invalid config: ${result.summary}`);
	}

	return result;
}

export const config = validate();
