import { NextResponse } from "next/server";
import { db, isDbConfigured } from "@/db";
import { sql } from "drizzle-orm";

export const runtime = "nodejs";

/**
 * GET /api/cron/keep-alive
 * Periodic cron job called by Vercel to keep Supabase database active (prevent auto-pause).
 */
export async function GET(request: Request) {
  // If CRON_SECRET is set in environment (recommended in Vercel), verify bearer token
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
  }

  if (!isDbConfigured()) {
    return NextResponse.json(
      { ok: false, message: "Database is not configured." },
      { status: 503 }
    );
  }

  try {
    const startedAt = Date.now();
    await db.execute(sql`SELECT 1`);
    const durationMs = Date.now() - startedAt;

    return NextResponse.json({
      ok: true,
      message: "Supabase DB keep-alive ping successful",
      durationMs,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[cron/keep-alive] Failed to ping DB:", error);
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
