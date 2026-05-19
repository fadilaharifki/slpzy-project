import "server-only";
import { desc, eq } from "drizzle-orm";
import { db, isDbConfigured } from "@/db";
import { newsletterSubscribers } from "@/db/schema";

export async function subscribe(email: string): Promise<{ ok: boolean; message: string }> {
  const clean = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
    return { ok: false, message: "Email tidak valid." };
  }
  if (!isDbConfigured()) {
    return { ok: true, message: "Terima kasih sudah subscribe." };
  }
  try {
    await db.insert(newsletterSubscribers).values({ email: clean }).onConflictDoNothing();
    return { ok: true, message: "Terima kasih — kamu sudah terdaftar." };
  } catch {
    return { ok: false, message: "Gagal mendaftar, coba lagi." };
  }
}

export async function listSubscribers() {
  if (!isDbConfigured()) return [];
  return db.select().from(newsletterSubscribers).orderBy(desc(newsletterSubscribers.createdAt));
}

export async function activeSubscriberEmails(): Promise<string[]> {
  const rows = await listSubscribers();
  return rows.filter((r) => r.isActive).map((r) => r.email);
}

export async function removeSubscriber(id: string) {
  if (!isDbConfigured()) return;
  await db.delete(newsletterSubscribers).where(eq(newsletterSubscribers.id, id));
}
