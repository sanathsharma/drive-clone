import { neon, Pool } from "@neondatabase/serverless";
import type { ExtractTablesWithRelations } from "drizzle-orm";
import { drizzle as drizzleHttp } from "drizzle-orm/neon-http";
import { drizzle as drizzleWs, type NeonQueryResultHKT } from "drizzle-orm/neon-serverless";
import type { PgTransaction } from "drizzle-orm/pg-core";
import { config } from "@/constants";
import * as schema from "./schema";

// Default: fast, stateless, use for 90% of queries
const sql = neon(config.DATABASE_URL_POOLED);
export const db = drizzleHttp(sql, { schema });

// Only for transactions: pooled, websocket-based
const pool = new Pool({ connectionString: config.DATABASE_URL_POOLED });
export const dbTx = drizzleWs(pool, { schema });

export type Transaction = PgTransaction<NeonQueryResultHKT, typeof schema, ExtractTablesWithRelations<typeof schema>>;
