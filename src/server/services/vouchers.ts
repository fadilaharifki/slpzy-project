import "server-only";
import { asc } from "drizzle-orm";
import { db, isDbConfigured } from "@/db";
import { vouchers } from "@/db/schema";
import { DEFAULT_VOUCHERS, type Voucher } from "@/lib/voucher";

/** Active vouchers — DB-backed when configured, else the built-in defaults. */
export async function getActiveVouchers(): Promise<Voucher[]> {
  if (!isDbConfigured()) return DEFAULT_VOUCHERS;
  try {
    const rows = await db.select().from(vouchers).orderBy(asc(vouchers.createdAt));
    if (rows.length === 0) return DEFAULT_VOUCHERS;
    return rows
      .filter((r) => r.active)
      .map((r) => ({
        code: r.code,
        label: r.label,
        description: r.description,
        kind: r.kind,
        amount: Number(r.amount),
        auto: r.auto,
        active: r.active,
        minSubtotal: r.minSubtotal ? Number(r.minSubtotal) : undefined,
      }));
  } catch (err) {
    console.error("[vouchers] DB read failed, using defaults:", err);
    return DEFAULT_VOUCHERS;
  }
}

/**
 * Resolve a set of voucher codes against the active catalogue.
 * Auto vouchers are always included even if not in `codes`.
 */
export async function resolveVouchers(codes: string[]): Promise<Voucher[]> {
  const active = await getActiveVouchers();
  const wanted = new Set(codes.map((c) => c.trim().toUpperCase()));
  return active.filter((v) => v.auto || wanted.has(v.code.toUpperCase()));
}
