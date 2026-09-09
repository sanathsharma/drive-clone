import { defineConfig } from "drizzle-kit";
import { config } from "@/constants";

export default defineConfig({
	dbCredentials: {
		url: config.DATABASE_URL,
	},
	dialect: "postgresql",
	out: "./drizzle",
	schema: "./src/db/schema.ts",
});
