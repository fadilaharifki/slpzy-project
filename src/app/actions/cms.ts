"use server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { db, isDbConfigured } from "@/db";
import { productVariants, products, type OrderStatus } from "@/db/schema";
import { CMS_COOKIE, expectedToken, verifyCode } from "@/lib/cms-auth";
import { isCmsAuthed } from "@/lib/cms-session";
import {
  addMedia,
  deleteMedia,
  setContent,
  toggleMedia,
} from "@/server/services/content";
import {
  createOrderRecord,
  deleteOrder,
  updateOrderStatus,
  type NewOrderItem,
} from "@/server/services/orders";
import { activeSubscriberEmails, removeSubscriber } from "@/server/services/newsletter";
import { sendNewsletterBroadcast } from "@/server/email/send";

type Result = { ok: boolean; error?: string };

async function guard(): Promise<void> {
  if (!(await isCmsAuthed())) throw new Error("Unauthorized");
}

// ── Auth ───────────────────────────────────────────────────────────────────
export async function cmsLogin(code: string): Promise<Result> {
  if (!verifyCode(code)) return { ok: false, error: "Kode akses salah." };
  const jar = await cookies();
  jar.set(CMS_COOKIE, await expectedToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return { ok: true };
}

export async function cmsLogout(): Promise<void> {
  const jar = await cookies();
  jar.delete(CMS_COOKIE);
}

// ── Products ───────────────────────────────────────────────────────────────
export async function updateProduct(
  id: string,
  fields: {
    name: string;
    displayLead: string;
    displayTail: string;
    category: "Bedsheet" | "Bedcover" | "Pillow & Bolster" | "Bundle";
    subtitle: string;
    description: string;
    tag: "" | "New" | "Bestseller" | "Limited";
    heroSwatch: string;
    imageUrl: string;
    isActive: boolean;
    colors: { name: string; hex: string }[];
    inclusions: string[];
  },
): Promise<Result> {
  try {
    await guard();
    if (!isDbConfigured()) return { ok: false, error: "Database belum dikonfigurasi." };
    await db
      .update(products)
      .set({
        name: fields.name,
        displayLead: fields.displayLead || null,
        displayTail: fields.displayTail,
        category: fields.category,
        subtitle: fields.subtitle,
        description: fields.description,
        tag: fields.tag || null,
        heroSwatch: fields.heroSwatch,
        imageUrl: fields.imageUrl || null,
        isActive: fields.isActive,
        colors: fields.colors,
        inclusions: fields.inclusions,
        updatedAt: new Date(),
      })
      .where(eq(products.id, id));
    revalidatePath("/cms-panel/products");
    revalidatePath("/shop");
    revalidatePath("/");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Gagal menyimpan." };
  }
}

export async function saveVariant(
  variant: { id?: string; productId: string; label: string; dimensions: string; price: number; sortOrder: number },
): Promise<Result> {
  try {
    await guard();
    if (!isDbConfigured()) return { ok: false, error: "Database belum dikonfigurasi." };
    if (variant.id) {
      await db
        .update(productVariants)
        .set({
          label: variant.label,
          dimensions: variant.dimensions || null,
          price: variant.price.toString(),
          sortOrder: variant.sortOrder,
        })
        .where(eq(productVariants.id, variant.id));
    } else {
      await db.insert(productVariants).values({
        productId: variant.productId,
        label: variant.label,
        dimensions: variant.dimensions || null,
        price: variant.price.toString(),
        sortOrder: variant.sortOrder,
      });
    }
    revalidatePath("/cms-panel/products");
    revalidatePath("/shop");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Gagal menyimpan varian." };
  }
}

export async function deleteVariant(id: string): Promise<Result> {
  try {
    await guard();
    if (!isDbConfigured()) return { ok: false, error: "Database belum dikonfigurasi." };
    await db.delete(productVariants).where(eq(productVariants.id, id));
    revalidatePath("/cms-panel/products");
    revalidatePath("/shop");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Gagal menghapus varian." };
  }
}

// ── Media / banners ────────────────────────────────────────────────────────
export async function addMediaAsset(input: {
  section: string;
  title: string;
  url: string;
  storagePath: string;
}): Promise<Result> {
  try {
    await guard();
    await addMedia(input);
    revalidatePath("/cms-panel/content");
    revalidatePath("/");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Gagal menambah gambar." };
  }
}

export async function deleteMediaAsset(id: string): Promise<Result> {
  try {
    await guard();
    await deleteMedia(id);
    revalidatePath("/cms-panel/content");
    revalidatePath("/");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Gagal menghapus gambar." };
  }
}

export async function toggleMediaAsset(id: string, isActive: boolean): Promise<Result> {
  try {
    await guard();
    await toggleMedia(id, isActive);
    revalidatePath("/cms-panel/content");
    revalidatePath("/");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Gagal mengubah status." };
  }
}

export async function updateContentBlock(key: string, value: string): Promise<Result> {
  try {
    await guard();
    await setContent(key, value);
    revalidatePath("/cms-panel/content");
    revalidatePath("/");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Gagal menyimpan teks." };
  }
}

// ── Orders ─────────────────────────────────────────────────────────────────
export async function setOrderStatus(id: string, status: OrderStatus): Promise<Result> {
  try {
    await guard();
    await updateOrderStatus(id, status);
    revalidatePath("/cms-panel/orders");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Gagal mengubah status." };
  }
}

export async function removeOrder(id: string): Promise<Result> {
  try {
    await guard();
    await deleteOrder(id);
    revalidatePath("/cms-panel/orders");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Gagal menghapus order." };
  }
}

export async function createManualOrder(input: {
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
  voucherCode: string;
  voucherDiscount: number;
  status: OrderStatus;
  notes: string;
}): Promise<Result & { code?: string }> {
  try {
    await guard();
    if (!isDbConfigured()) return { ok: false, error: "Database belum dikonfigurasi." };
    if (input.items.length === 0) return { ok: false, error: "Minimal 1 item." };

    const subtotal = input.items.reduce((s, i) => s + i.unitPrice * i.qty, 0);
    const total = Math.max(0, subtotal + input.shippingCost - input.voucherDiscount);

    const { code } = await createOrderRecord({
      customer: input.customer,
      items: input.items,
      shippingMethod: input.shippingMethod,
      shippingCost: input.shippingCost,
      paymentMethod: input.paymentMethod,
      subtotal,
      voucherCode: input.voucherCode,
      voucherDiscount: input.voucherDiscount,
      total,
      source: "manual",
      status: input.status,
      notes: input.notes,
    });
    revalidatePath("/cms-panel/orders");
    return { ok: true, code };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Gagal membuat order." };
  }
}

// ── Newsletter ─────────────────────────────────────────────────────────────
export async function removeSubscriberAction(id: string): Promise<Result> {
  try {
    await guard();
    await removeSubscriber(id);
    revalidatePath("/cms-panel/newsletter");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Gagal menghapus." };
  }
}

export async function broadcastNewsletter(input: {
  heading: string;
  bodyHtml: string;
  ctaLabel: string;
  ctaUrl: string;
}): Promise<Result & { sent?: number; failed?: number }> {
  try {
    await guard();
    if (!input.heading.trim() || !input.bodyHtml.trim()) {
      return { ok: false, error: "Judul & isi wajib diisi." };
    }
    const recipients = await activeSubscriberEmails();
    if (recipients.length === 0) return { ok: false, error: "Belum ada subscriber aktif." };

    const { sent, failed } = await sendNewsletterBroadcast(recipients, {
      heading: input.heading,
      bodyHtml: input.bodyHtml,
      ctaLabel: input.ctaLabel || undefined,
      ctaUrl: input.ctaUrl || undefined,
    });
    return { ok: true, sent, failed };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Gagal mengirim broadcast." };
  }
}
