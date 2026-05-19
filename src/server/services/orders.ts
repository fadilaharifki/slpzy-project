import "server-only";
import { desc, eq } from "drizzle-orm";
import { db, isDbConfigured } from "@/db";
import { orderItems, orders, type OrderStatus } from "@/db/schema";

export interface NewOrderItem {
  productName: string;
  variantLabel: string;
  dimensions?: string | null;
  colorName: string;
  colorHex: string;
  unitPrice: number;
  qty: number;
}

export interface NewOrderInput {
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    province: string;
    postalCode: string;
  };
  items: NewOrderItem[];
  shippingMethod: string;
  shippingCost: number;
  paymentMethod: string;
  subtotal: number;
  voucherCode: string;
  voucherDiscount: number;
  total: number;
  source: "web" | "manual";
  status?: OrderStatus;
  notes?: string;
}

/** SLPZY-YYYYMMDD-XXXX */
export function generateOrderCode(): string {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `SLPZY-${ymd}-${rand}`;
}

/** Insert an order + its items. Returns the persisted order code. */
export async function createOrderRecord(input: NewOrderInput): Promise<{ code: string; id: string }> {
  if (!isDbConfigured()) {
    // No DB yet — still return a code so the checkout flow & emails work.
    return { code: generateOrderCode(), id: "no-db" };
  }

  const code = generateOrderCode();
  const [order] = await db
    .insert(orders)
    .values({
      code,
      customerName: input.customer.name,
      customerEmail: input.customer.email,
      customerPhone: input.customer.phone,
      address: input.customer.address,
      city: input.customer.city,
      province: input.customer.province,
      postalCode: input.customer.postalCode,
      shippingMethod: input.shippingMethod,
      shippingCost: input.shippingCost.toString(),
      paymentMethod: input.paymentMethod,
      subtotal: input.subtotal.toString(),
      voucherCode: input.voucherCode,
      voucherDiscount: input.voucherDiscount.toString(),
      total: input.total.toString(),
      status: input.status ?? "pending",
      source: input.source,
      notes: input.notes ?? "",
    })
    .returning();

  if (input.items.length) {
    await db.insert(orderItems).values(
      input.items.map((it) => ({
        orderId: order.id,
        productName: it.productName,
        variantLabel: it.variantLabel,
        dimensions: it.dimensions ?? null,
        colorName: it.colorName,
        colorHex: it.colorHex,
        unitPrice: it.unitPrice.toString(),
        qty: it.qty,
        lineTotal: (it.unitPrice * it.qty).toString(),
      })),
    );
  }

  return { code, id: order.id };
}

export async function listOrders() {
  if (!isDbConfigured()) return [];
  return db.select().from(orders).orderBy(desc(orders.createdAt));
}

export async function getOrderWithItems(id: string) {
  if (!isDbConfigured()) return null;
  const [order] = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  if (!order) return null;
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, id));
  return { order, items };
}

/** All order items, for grouping into the CMS orders table. */
export async function getAllOrderItems() {
  if (!isDbConfigured()) return [];
  return db.select().from(orderItems);
}

export async function getOrderByCode(code: string) {
  if (!isDbConfigured()) return null;
  const [order] = await db.select().from(orders).where(eq(orders.code, code)).limit(1);
  if (!order) return null;
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
  return { order, items };
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  if (!isDbConfigured()) return;
  await db.update(orders).set({ status, updatedAt: new Date() }).where(eq(orders.id, id));
}

export async function deleteOrder(id: string) {
  if (!isDbConfigured()) return;
  await db.delete(orders).where(eq(orders.id, id));
}
