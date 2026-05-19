"use client";
import { ChevronDown, Plus, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Fragment, useState } from "react";
import { createManualOrder, removeOrder, setOrderStatus } from "@/app/actions/cms";
import { formatIDR } from "@/lib/products";
import { cn } from "@/lib/cn";
import { cmsInput, CmsLabel, StatusPill } from "../_ui";

const STATUSES = ["pending", "paid", "processing", "shipped", "completed", "cancelled"] as const;
type Status = (typeof STATUSES)[number];

interface OrderItem {
  productName: string;
  variantLabel: string;
  dimensions: string | null;
  colorName: string;
  qty: number;
  unitPrice: number;
  lineTotal: number;
}
export interface CmsOrder {
  id: string;
  code: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  shippingMethod: string;
  shippingCost: number;
  paymentMethod: string;
  subtotal: number;
  voucherCode: string;
  voucherDiscount: number;
  total: number;
  status: string;
  source: string;
  notes: string;
  createdAt: string;
}

export function OrdersClient({
  initialOrders,
  itemsByOrder,
}: {
  initialOrders: CmsOrder[];
  itemsByOrder: Record<string, OrderItem[]>;
}) {
  const router = useRouter();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  async function changeStatus(id: string, status: Status) {
    await setOrderStatus(id, status);
    router.refresh();
  }
  async function onDelete(id: string) {
    if (!confirm("Hapus order ini? Tidak bisa dibatalkan.")) return;
    await removeOrder(id);
    router.refresh();
  }

  return (
    <>
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-ink px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-paper hover:bg-sage-deep"
        >
          <Plus className="h-4 w-4" /> Manual Order
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-line bg-paper">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line bg-cream/50 text-left text-[10px] uppercase tracking-widest text-ink/45">
              <th className="px-4 py-3 font-semibold">Order</th>
              <th className="px-4 py-3 font-semibold">Customer</th>
              <th className="px-4 py-3 font-semibold">Date</th>
              <th className="px-4 py-3 font-semibold">Total</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="w-8" />
            </tr>
          </thead>
          <tbody>
            {initialOrders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-ink/40">
                  Belum ada order.
                </td>
              </tr>
            )}
            {initialOrders.map((o) => {
              const open = expanded === o.id;
              const items = itemsByOrder[o.id] ?? [];
              return (
                <Fragment key={o.id}>
                  <tr
                    className="cursor-pointer border-b border-line/50 hover:bg-cream/40"
                    onClick={() => setExpanded(open ? null : o.id)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono-soft text-xs font-semibold">{o.code}</span>
                        {o.source === "manual" && (
                          <span className="rounded bg-violet-100 px-1.5 py-0.5 text-[9px] font-semibold uppercase text-violet-700">
                            Manual
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{o.customerName}</p>
                      <p className="text-[11px] text-ink/45">{o.customerEmail}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-ink/55">
                      {new Date(o.createdAt).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-4 py-3 font-semibold tabular-nums">{formatIDR(o.total)}</td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={o.status}
                        onChange={(e) => changeStatus(o.id, e.target.value as Status)}
                        className="rounded-md border border-line bg-cream/50 px-2 py-1 text-xs capitalize outline-none focus:border-sage"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <ChevronDown className={cn("h-4 w-4 text-ink/40 transition-transform", open && "rotate-180")} />
                    </td>
                  </tr>
                  {open && (
                    <tr className="border-b border-line/50 bg-cream/30">
                      <td colSpan={6} className="px-6 py-5">
                        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
                          {/* Items */}
                          <div>
                            <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-ink/45">Items</p>
                            <div className="space-y-1.5">
                              {items.map((it, i) => (
                                <div key={i} className="flex items-center justify-between text-xs">
                                  <span>
                                    {it.productName}{" "}
                                    <span className="text-ink/45">
                                      · {it.variantLabel} · {it.colorName} · x{it.qty}
                                    </span>
                                  </span>
                                  <span className="font-semibold tabular-nums">{formatIDR(it.lineTotal)}</span>
                                </div>
                              ))}
                              {items.length === 0 && <p className="text-xs text-ink/40">Tidak ada item tercatat.</p>}
                            </div>
                            <div className="mt-3 space-y-1 border-t border-line pt-3 text-xs">
                              <Row k="Subtotal" v={formatIDR(o.subtotal)} />
                              <Row k={`Shipping · ${o.shippingMethod}`} v={formatIDR(o.shippingCost)} />
                              {o.voucherDiscount > 0 && (
                                <Row k={`Voucher · ${o.voucherCode}`} v={`− ${formatIDR(o.voucherDiscount)}`} />
                              )}
                              <Row k="Total" v={formatIDR(o.total)} strong />
                            </div>
                          </div>
                          {/* Customer + actions */}
                          <div className="space-y-3 text-xs">
                            <div>
                              <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-ink/45">
                                Shipping to
                              </p>
                              <p>{o.customerPhone}</p>
                              <p className="text-ink/65">{o.address}</p>
                              <p className="text-ink/65">
                                {o.city}, {o.province} {o.postalCode}
                              </p>
                              <p className="mt-1 text-ink/45">Payment: {o.paymentMethod}</p>
                            </div>
                            {o.notes && (
                              <p className="rounded-lg bg-paper p-2.5 text-ink/65">Note: {o.notes}</p>
                            )}
                            <button
                              onClick={() => onDelete(o.id)}
                              className="inline-flex items-center gap-1.5 text-rose-600 hover:underline"
                            >
                              <Trash2 className="h-3.5 w-3.5" /> Delete order
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {modalOpen && <ManualOrderModal onClose={() => setModalOpen(false)} />}
    </>
  );
}

function Row({ k, v, strong }: { k: string; v: string; strong?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className={strong ? "font-semibold" : "text-ink/55"}>{k}</span>
      <span className={cn("tabular-nums", strong && "font-bold text-sage-deep")}>{v}</span>
    </div>
  );
}

// ── Manual order modal ───────────────────────────────────────────────────
interface DraftItem {
  productName: string;
  variantLabel: string;
  colorName: string;
  unitPrice: string;
  qty: string;
}

function ManualOrderModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<DraftItem[]>([
    { productName: "", variantLabel: "", colorName: "", unitPrice: "", qty: "1" },
  ]);

  function updateItem(idx: number, patch: Partial<DraftItem>) {
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const draftItems = items
      .filter((it) => it.productName.trim())
      .map((it) => ({
        productName: it.productName.trim(),
        variantLabel: it.variantLabel.trim(),
        dimensions: null,
        colorName: it.colorName.trim(),
        colorHex: "#9DAD8E",
        unitPrice: Number(it.unitPrice) || 0,
        qty: Number(it.qty) || 1,
      }));
    if (draftItems.length === 0) {
      setError("Minimal 1 item dengan nama produk.");
      return;
    }
    setSaving(true);
    const res = await createManualOrder({
      customer: {
        name: String(fd.get("name") || ""),
        email: String(fd.get("email") || ""),
        phone: String(fd.get("phone") || ""),
        address: String(fd.get("address") || ""),
        city: String(fd.get("city") || ""),
        province: String(fd.get("province") || ""),
        postalCode: String(fd.get("postal") || ""),
      },
      items: draftItems,
      shippingMethod: String(fd.get("shippingMethod") || "regular"),
      shippingCost: Number(fd.get("shippingCost")) || 0,
      paymentMethod: String(fd.get("paymentMethod") || "bank"),
      voucherCode: String(fd.get("voucherCode") || ""),
      voucherDiscount: Number(fd.get("voucherDiscount")) || 0,
      status: (String(fd.get("status") || "pending")) as Status,
      notes: String(fd.get("notes") || ""),
    });
    setSaving(false);
    if (!res.ok) {
      setError(res.error ?? "Gagal menyimpan");
      return;
    }
    onClose();
    router.refresh();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/40 p-6 backdrop-blur-sm">
      <form
        onSubmit={onSubmit}
        className="my-8 w-full max-w-2xl rounded-2xl border border-line bg-paper p-7"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Manual Order</h2>
          <button type="button" onClick={onClose} aria-label="Close">
            <X className="h-5 w-5 text-ink/50" />
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field name="name" label="Customer name" required />
          <Field name="phone" label="Phone" required />
          <Field name="email" label="Email" type="email" required />
          <Field name="postal" label="Postal code" />
          <div className="sm:col-span-2">
            <Field name="address" label="Address" />
          </div>
          <Field name="city" label="City" />
          <Field name="province" label="Province" />
        </div>

        {/* Items */}
        <p className="mb-2 mt-6 text-[10px] font-semibold uppercase tracking-widest text-ink/50">Items</p>
        <div className="space-y-2">
          {items.map((it, idx) => (
            <div key={idx} className="grid grid-cols-12 gap-2">
              <input
                placeholder="Product"
                value={it.productName}
                onChange={(e) => updateItem(idx, { productName: e.target.value })}
                className={cmsInput("col-span-4")}
              />
              <input
                placeholder="Variant"
                value={it.variantLabel}
                onChange={(e) => updateItem(idx, { variantLabel: e.target.value })}
                className={cmsInput("col-span-2")}
              />
              <input
                placeholder="Color"
                value={it.colorName}
                onChange={(e) => updateItem(idx, { colorName: e.target.value })}
                className={cmsInput("col-span-2")}
              />
              <input
                placeholder="Price"
                type="number"
                value={it.unitPrice}
                onChange={(e) => updateItem(idx, { unitPrice: e.target.value })}
                className={cmsInput("col-span-2")}
              />
              <input
                placeholder="Qty"
                type="number"
                value={it.qty}
                onChange={(e) => updateItem(idx, { qty: e.target.value })}
                className={cmsInput("col-span-1")}
              />
              <button
                type="button"
                onClick={() => setItems((prev) => prev.filter((_, i) => i !== idx))}
                className="col-span-1 flex items-center justify-center text-ink/40 hover:text-rose-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setItems((prev) => [...prev, { productName: "", variantLabel: "", colorName: "", unitPrice: "", qty: "1" }])}
          className="mt-2 text-xs font-medium text-sage-deep hover:underline"
        >
          + Tambah item
        </button>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div>
            <CmsLabel>Shipping method</CmsLabel>
            <select name="shippingMethod" className={cmsInput()} defaultValue="regular">
              <option value="regular">Regular</option>
              <option value="express">Express</option>
            </select>
          </div>
          <Field name="shippingCost" label="Shipping cost" type="number" />
          <div>
            <CmsLabel>Payment</CmsLabel>
            <select name="paymentMethod" className={cmsInput()} defaultValue="bank">
              <option value="bank">Bank Transfer</option>
              <option value="qris">QRIS</option>
            </select>
          </div>
          <Field name="voucherCode" label="Voucher code" />
          <Field name="voucherDiscount" label="Voucher discount" type="number" />
          <div>
            <CmsLabel>Status</CmsLabel>
            <select name="status" className={cmsInput()} defaultValue="pending">
              {STATUSES.map((s) => (
                <option key={s} value={s} className="capitalize">
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-3">
          <CmsLabel>Notes</CmsLabel>
          <textarea name="notes" rows={2} className={cmsInput()} />
        </div>

        {error && <p className="mt-3 text-xs text-rose-600">{error}</p>}

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-line px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-ink/60"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-ink px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-paper hover:bg-sage-deep disabled:opacity-40"
          >
            {saving ? "Saving..." : "Create order"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ name, label, type = "text", required }: { name: string; label: string; type?: string; required?: boolean }) {
  return (
    <div>
      <CmsLabel>
        {label}
        {required && <span className="text-rose-500"> *</span>}
      </CmsLabel>
      <input name={name} type={type} required={required} className={cmsInput()} />
    </div>
  );
}
