"use server";
import { z } from "zod";
import { computeTotals } from "@/lib/voucher";
import { createOrderRecord } from "@/server/services/orders";
import { resolveVouchers } from "@/server/services/vouchers";
import { sendOrderEmails } from "@/server/email/send";

const itemSchema = z.object({
  productName: z.string().min(1),
  variantLabel: z.string().default(""),
  dimensions: z.string().optional(),
  colorName: z.string().default(""),
  colorHex: z.string().default("#9DAD8E"),
  unitPrice: z.number().nonnegative(),
  qty: z.number().int().positive(),
});

const checkoutSchema = z.object({
  customer: z.object({
    name: z.string().min(1, "Nama wajib diisi"),
    email: z.string().email("Email tidak valid"),
    phone: z.string().min(1, "Nomor telepon wajib diisi"),
    address: z.string().min(1, "Alamat wajib diisi"),
    city: z.string().min(1),
    province: z.string().min(1),
    postalCode: z.string().min(1),
  }),
  items: z.array(itemSchema).min(1, "Keranjang kosong"),
  shippingMethod: z.enum(["regular", "express"]),
  shippingCost: z.number().nonnegative(),
  paymentMethod: z.enum(["bank", "qris"]),
  voucherCodes: z.array(z.string()).default([]),
});

export type CheckoutInput = z.input<typeof checkoutSchema>;

export interface CheckoutResult {
  ok: boolean;
  code?: string;
  error?: string;
}

/**
 * Create an order from the storefront checkout:
 *  1. validate input
 *  2. recompute totals server-side (never trust the client)
 *  3. persist the order + items
 *  4. email the admin + the customer their invoice
 */
export async function createOrder(raw: CheckoutInput): Promise<CheckoutResult> {
  const parsed = checkoutSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Data tidak valid" };
  }
  const input = parsed.data;

  // Authoritative subtotal from line items
  const subtotal = input.items.reduce((sum, i) => sum + i.unitPrice * i.qty, 0);

  // Resolve vouchers (auto + redeemed) and recompute totals
  const vouchers = await resolveVouchers(input.voucherCodes);
  const totals = computeTotals(subtotal, input.shippingCost, vouchers);
  const voucherDiscount = totals.shippingDiscount + totals.subtotalDiscount;
  const voucherCode = totals.appliedVouchers.map((v) => v.code).join(", ");

  try {
    const { code } = await createOrderRecord({
      customer: input.customer,
      items: input.items.map((i) => ({
        productName: i.productName,
        variantLabel: i.variantLabel,
        dimensions: i.dimensions,
        colorName: i.colorName,
        colorHex: i.colorHex,
        unitPrice: i.unitPrice,
        qty: i.qty,
      })),
      shippingMethod: input.shippingMethod,
      shippingCost: input.shippingCost,
      paymentMethod: input.paymentMethod,
      subtotal,
      voucherCode,
      voucherDiscount,
      total: totals.total,
      source: "web",
      status: "pending",
    });

    // Fire emails — non-blocking failure (order is already saved)
    await sendOrderEmails({
      code,
      createdAt: new Date(),
      customerName: input.customer.name,
      customerEmail: input.customer.email,
      customerPhone: input.customer.phone,
      address: input.customer.address,
      city: input.customer.city,
      province: input.customer.province,
      postalCode: input.customer.postalCode,
      shippingMethod: input.shippingMethod,
      shippingCost: input.shippingCost,
      paymentMethod: input.paymentMethod,
      subtotal,
      voucherCode,
      voucherDiscount,
      total: totals.total,
      items: input.items.map((i) => ({
        productName: i.productName,
        variantLabel: i.variantLabel,
        dimensions: i.dimensions,
        colorName: i.colorName,
        qty: i.qty,
        unitPrice: i.unitPrice,
        lineTotal: i.unitPrice * i.qty,
      })),
    });

    return { ok: true, code };
  } catch (err) {
    console.error("[createOrder] failed:", err);
    return { ok: false, error: "Gagal menyimpan order. Silakan coba lagi." };
  }
}
