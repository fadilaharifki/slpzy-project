import { boolean, integer, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

/**
 * Uploaded images, grouped by `section` so the CMS can manage them in buckets.
 * Known sections (free-form, but the CMS surfaces these):
 *   "hero"            — main homepage banner(s)
 *   "marquee"         — strip imagery
 *   "lookbook"        — about / editorial shots
 *   "product:<slug>"  — gallery images for a specific product
 */
export const mediaAssets = pgTable("media_assets", {
  id: uuid("id").primaryKey().defaultRandom(),
  section: varchar("section", { length: 120 }).notNull().default("hero"),
  title: varchar("title", { length: 200 }).notNull().default(""),
  url: text("url").notNull(),
  /** Storage object path so the file can be deleted from the bucket */
  storagePath: text("storage_path").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/**
 * Editable text blocks — simple key/value store.
 * Keys used by the site: "hero.eyebrow", "hero.title", "hero.body",
 * "hero.ctaLabel", "marquee.items" (newline-separated), etc.
 */
export const siteContent = pgTable("site_content", {
  key: varchar("key", { length: 120 }).primaryKey(),
  label: varchar("label", { length: 200 }).notNull().default(""),
  value: text("value").notNull().default(""),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type MediaAssetRow = typeof mediaAssets.$inferSelect;
export type SiteContentRow = typeof siteContent.$inferSelect;
