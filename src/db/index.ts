import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

/** Whether a database connection string is present. Services degrade gracefully when false. */
export function isDbConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

let pool: Pool | null = null;
let instance: NodePgDatabase<typeof schema> | null = null;

function getDb(): NodePgDatabase<typeof schema> {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set — database is not configured.");
  }
  if (!instance) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 5,
    });
    instance = drizzle(pool, { schema });
  }
  return instance;
}

/**
 * Lazy Drizzle client. The Pool/instance are created on first query, so simply
 * importing `db` never throws — services guard with `isDbConfigured()` first.
 * The Proxy binds methods to the real instance so `this` stays correct.
 */
export const db = new Proxy({} as NodePgDatabase<typeof schema>, {
  get(_t, prop, receiver) {
    const real = getDb();
    const value = Reflect.get(real as object, prop, receiver);
    return typeof value === "function" ? value.bind(real) : value;
  },
});

export { schema };
