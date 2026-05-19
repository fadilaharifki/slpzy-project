import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env.local" });
config({ path: ".env" });

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL tidak ditemukan. Isi .env.local terlebih dulu.");
}

export default defineConfig({
  schema: "./src/db/schema/*.ts",
  out: "./drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL },
  verbose: true,
  strict: true,
});
