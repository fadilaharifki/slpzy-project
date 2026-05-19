import { boolean, numeric, pgEnum, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const voucherKindEnum = pgEnum("voucher_kind", ["shipping", "subtotal"]);

export const vouchers = pgTable("vouchers", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: varchar("code", { length: 60 }).notNull().unique(),
  label: varchar("label", { length: 160 }).notNull().default(""),
  description: text("description").notNull().default(""),
  kind: voucherKindEnum("kind").notNull().default("shipping"),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull().default("0"),
  /** Auto-applied for every checkout */
  auto: boolean("auto").notNull().default(false),
  active: boolean("active").notNull().default(true),
  minSubtotal: numeric("min_subtotal", { precision: 12, scale: 2 }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 200 }).notNull().unique(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type VoucherRow = typeof vouchers.$inferSelect;
export type SubscriberRow = typeof newsletterSubscribers.$inferSelect;
