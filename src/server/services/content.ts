import "server-only";
import { asc, eq } from "drizzle-orm";
import { db, isDbConfigured } from "@/db";
import { mediaAssets, siteContent } from "@/db/schema";
import { deleteImage } from "@/lib/supabase";

/** Sections the CMS surfaces as managed image groups. */
export const MEDIA_SECTIONS = [
  { key: "hero", label: "Homepage Banner" },
  { key: "lookbook", label: "Lookbook / Editorial" },
  { key: "marquee", label: "Marquee Strip" },
  { key: "product", label: "Product Gallery" },
] as const;

// ── Media assets ───────────────────────────────────────────────────────────
export async function getMediaBySection(section: string) {
  if (!isDbConfigured()) return [];
  return db
    .select()
    .from(mediaAssets)
    .where(eq(mediaAssets.section, section))
    .orderBy(asc(mediaAssets.sortOrder), asc(mediaAssets.createdAt));
}

export async function getAllMedia() {
  if (!isDbConfigured()) return [];
  return db.select().from(mediaAssets).orderBy(asc(mediaAssets.section), asc(mediaAssets.sortOrder));
}

/** Active hero banner images for the storefront. */
export async function getHeroImages(): Promise<string[]> {
  const rows = await getMediaBySection("hero");
  return rows.filter((r) => r.isActive).map((r) => r.url);
}

export async function addMedia(input: { section: string; title: string; url: string; storagePath: string }) {
  if (!isDbConfigured()) throw new Error("Database belum dikonfigurasi.");
  const existing = await getMediaBySection(input.section);
  await db.insert(mediaAssets).values({
    section: input.section,
    title: input.title,
    url: input.url,
    storagePath: input.storagePath,
    sortOrder: existing.length,
  });
}

export async function deleteMedia(id: string) {
  if (!isDbConfigured()) return;
  const [row] = await db.select().from(mediaAssets).where(eq(mediaAssets.id, id)).limit(1);
  if (row?.storagePath) await deleteImage(row.storagePath);
  await db.delete(mediaAssets).where(eq(mediaAssets.id, id));
}

export async function toggleMedia(id: string, isActive: boolean) {
  if (!isDbConfigured()) return;
  await db.update(mediaAssets).set({ isActive }).where(eq(mediaAssets.id, id));
}

// ── Site content (text blocks) ─────────────────────────────────────────────
export async function getContentMap(): Promise<Record<string, string>> {
  if (!isDbConfigured()) return {};
  const rows = await db.select().from(siteContent);
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}

export async function getContentRows() {
  if (!isDbConfigured()) return [];
  return db.select().from(siteContent).orderBy(asc(siteContent.key));
}

export async function setContent(key: string, value: string) {
  if (!isDbConfigured()) return;
  await db
    .update(siteContent)
    .set({ value, updatedAt: new Date() })
    .where(eq(siteContent.key, key));
}
