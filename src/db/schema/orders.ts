import { integer, numeric, pgEnum, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const orderStatusEnum = pgEnum("order_status", [
  "pending", // awaiting payment
  "paid", // payment confirmed
  "processing", // packed / being prepared
  "shipped", // handed to courier
  "completed", // delivered & done
  "cancelled",
]);

export const orderSourceEnum = pgEnum("order_source", ["web", "manual"]);

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  /** Human-readable order code, e.g. SLPZY-20260517-4821 */
  code: varchar("code", { length: 40 }).notNull().unique(),

  customerName: varchar("customer_name", { length: 200 }).notNull(),
  customerEmail: varchar("customer_email", { length: 200 }).notNull(),
  customerPhone: varchar("customer_phone", { length: 60 }).notNull().default(""),

  address: text("address").notNull().default(""),
  city: varchar("city", { length: 120 }).notNull().default(""),
  province: varchar("province", { length: 120 }).notNull().default(""),
  postalCode: varchar("postal_code", { length: 20 }).notNull().default(""),

  shippingMethod: varchar("shipping_method", { length: 40 }).notNull().default("regular"),
  shippingCost: numeric("shipping_cost", { precision: 12, scale: 2 }).notNull().default("0"),
  paymentMethod: varchar("payment_method", { length: 40 }).notNull().default("bank"),

  subtotal: numeric("subtotal", { precision: 12, scale: 2 }).notNull().default("0"),
  voucherCode: varchar("voucher_code", { length: 120 }).notNull().default(""),
  voucherDiscount: numeric("voucher_discount", { precision: 12, scale: 2 }).notNull().default("0"),
  total: numeric("total", { precision: 12, scale: 2 }).notNull().default("0"),

  status: orderStatusEnum("status").notNull().default("pending"),
  source: orderSourceEnum("source").notNull().default("web"),
  notes: text("notes").notNull().default(""),

  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productName: varchar("product_name", { length: 200 }).notNull(),
  variantLabel: varchar("variant_label", { length: 120 }).notNull().default(""),
  dimensions: varchar("dimensions", { length: 120 }),
  colorName: varchar("color_name", { length: 80 }).notNull().default(""),
  colorHex: varchar("color_hex", { length: 16 }).notNull().default("#9DAD8E"),
  unitPrice: numeric("unit_price", { precision: 12, scale: 2 }).notNull().default("0"),
  qty: integer("qty").notNull().default(1),
  lineTotal: numeric("line_total", { precision: 12, scale: 2 }).notNull().default("0"),
});

export type OrderRow = typeof orders.$inferSelect;
export type OrderItemRow = typeof orderItems.$inferSelect;
export type OrderStatus = (typeof orderStatusEnum.enumValues)[number];
