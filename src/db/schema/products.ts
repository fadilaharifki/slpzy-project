import { boolean, integer, jsonb, numeric, pgEnum, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const productCategoryEnum = pgEnum("product_category", [
  "Bedsheet",
  "Bedcover",
  "Pillow & Bolster",
  "Bundle",
]);

export const productTagEnum = pgEnum("product_tag", ["New", "Bestseller", "Limited"]);

/** Color swatch shape stored as JSON on the product. */
export interface ColorJSON {
  name: string;
  hex: string;
}

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  /** URL-safe identifier, also used for #anchors on the shop page */
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  name: varchar("name", { length: 200 }).notNull(),
  displayLead: varchar("display_lead", { length: 80 }),
  displayTail: varchar("display_tail", { length: 120 }).notNull(),
  category: productCategoryEnum("category").notNull(),
  subtitle: text("subtitle").notNull().default(""),
  description: text("description").notNull().default(""),
  heroSwatch: varchar("hero_swatch", { length: 40 }).notNull().default("bg-cream"),
  /** Primary product image (from Supabase Storage) — optional, falls back to CSS gradient */
  imageUrl: text("image_url"),
  tag: productTagEnum("tag"),
  colors: jsonb("colors").$type<ColorJSON[]>().notNull().default([]),
  inclusions: jsonb("inclusions").$type<string[]>().notNull().default([]),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const productVariants = pgTable("product_variants", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  label: varchar("label", { length: 120 }).notNull(),
  dimensions: varchar("dimensions", { length: 120 }),
  price: numeric("price", { precision: 12, scale: 2 }).notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type ProductRow = typeof products.$inferSelect;
export type ProductVariantRow = typeof productVariants.$inferSelect;
