"use client";
import { ChevronDown, ImagePlus, Plus, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { deleteVariant, saveVariant, updateProduct } from "@/app/actions/cms";
import { formatIDR } from "@/lib/products";
import { cn } from "@/lib/cn";
import { cmsInput, CmsLabel } from "../_ui";

const CATEGORIES = ["Bedsheet", "Bedcover", "Pillow & Bolster", "Bundle"] as const;
const TAGS = ["", "New", "Bestseller", "Limited"] as const;

interface Color {
  name: string;
  hex: string;
}
interface CmsProduct {
  id: string;
  slug: string;
  name: string;
  displayLead: string;
  displayTail: string;
  category: string;
  subtitle: string;
  description: string;
  heroSwatch: string;
  imageUrl: string;
  images: string[];
  tag: string;
  colors: Color[];
  inclusions: string[];
  isActive: boolean;
}
interface CmsVariant {
  id: string;
  productId: string;
  label: string;
  dimensions: string;
  price: number;
  sortOrder: number;
}

export function ProductsClient({ products, variants }: { products: CmsProduct[]; variants: CmsVariant[] }) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      {products.map((p) => {
        const expanded = open === p.id;
        return (
          <div key={p.id} className="overflow-hidden rounded-2xl border border-line bg-paper">
            <button
              onClick={() => setOpen(expanded ? null : p.id)}
              className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-cream/40"
            >
              <div className="flex items-center gap-3">
                <span
                  className="h-9 w-9 rounded-lg bg-cover bg-center"
                  style={{
                    backgroundColor: p.colors[0]?.hex ?? "#9DAD8E",
                    backgroundImage: p.images[0] ? `url(${p.images[0]})` : p.imageUrl ? `url(${p.imageUrl})` : undefined,
                  }}
                />
                <div>
                  <p className="text-sm font-semibold">{p.name}</p>
                  <p className="text-[11px] text-ink/45">
                    {p.category} · {variants.filter((v) => v.productId === p.id).length} variants ·{" "}
                    {p.images.length} foto
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {!p.isActive && (
                  <span className="rounded bg-rose-100 px-2 py-0.5 text-[9px] font-semibold uppercase text-rose-600">
                    Hidden
                  </span>
                )}
                <ChevronDown className={cn("h-4 w-4 text-ink/40 transition-transform", expanded && "rotate-180")} />
              </div>
            </button>
            {expanded && (
              <ProductEditor product={p} variants={variants.filter((v) => v.productId === p.id)} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function ProductEditor({ product, variants }: { product: CmsProduct; variants: CmsVariant[] }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState(product);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  function set<K extends keyof CmsProduct>(key: K, val: CmsProduct[K]) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function onSave() {
    setSaving(true);
    setMsg(null);
    const res = await updateProduct(product.id, {
      name: form.name,
      displayLead: form.displayLead,
      displayTail: form.displayTail,
      category: form.category as (typeof CATEGORIES)[number],
      subtitle: form.subtitle,
      description: form.description,
      tag: form.tag as "" | "New" | "Bestseller" | "Limited",
      heroSwatch: form.heroSwatch,
      imageUrl: form.imageUrl,
      images: form.images,
      isActive: form.isActive,
      colors: form.colors,
      inclusions: form.inclusions,
    });
    setSaving(false);
    setMsg(res.ok ? "Tersimpan." : res.error ?? "Gagal");
    if (res.ok) router.refresh();
  }

  async function onUploadImage(file: File) {
    setUploading(true);
    setMsg(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("section", `product:${product.slug}`);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.ok) {
        set("images", [...form.images, data.url]);
        setMsg(null);
      } else {
        setMsg(data.error ?? "Upload gagal");
      }
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Upload gagal (network error)");
    } finally {
      setUploading(false);
      // reset file input so same file can be re-uploaded
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function removeImage(idx: number) {
    set("images", form.images.filter((_, i) => i !== idx));
  }

  return (
    <div className="space-y-5 border-t border-line bg-cream/30 px-5 py-6">
      {/* Basics */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <CmsLabel>Name</CmsLabel>
          <input value={form.name} onChange={(e) => set("name", e.target.value)} className={cmsInput()} />
        </div>
        <div>
          <CmsLabel>Category</CmsLabel>
          <select value={form.category} onChange={(e) => set("category", e.target.value)} className={cmsInput()}>
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <CmsLabel>Display lead (bold word)</CmsLabel>
          <input value={form.displayLead} onChange={(e) => set("displayLead", e.target.value)} className={cmsInput()} />
        </div>
        <div>
          <CmsLabel>Display tail (light word)</CmsLabel>
          <input value={form.displayTail} onChange={(e) => set("displayTail", e.target.value)} className={cmsInput()} />
        </div>
      </div>

      <div>
        <CmsLabel>Subtitle</CmsLabel>
        <input value={form.subtitle} onChange={(e) => set("subtitle", e.target.value)} className={cmsInput()} />
      </div>
      <div>
        <CmsLabel>Description</CmsLabel>
        <textarea
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          rows={3}
          className={cmsInput()}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <CmsLabel>Tag</CmsLabel>
          <select value={form.tag} onChange={(e) => set("tag", e.target.value)} className={cmsInput()}>
            {TAGS.map((t) => (
              <option key={t} value={t}>
                {t || "— none —"}
              </option>
            ))}
          </select>
        </div>
        <div>
          <CmsLabel>Hero swatch (tailwind bg)</CmsLabel>
          <input value={form.heroSwatch} onChange={(e) => set("heroSwatch", e.target.value)} className={cmsInput()} />
        </div>
        <div className="flex items-end">
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => set("isActive", e.target.checked)}
              className="h-4 w-4 accent-sage-deep"
            />
            Active (tampil di toko)
          </label>
        </div>
      </div>

      {/* ── Product Images (multi) ──────────────────────────── */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <CmsLabel>
            Product images{" "}
            <span className="ml-1 font-normal text-ink/40">({form.images.length} foto · gambar pertama = cover)</span>
          </CmsLabel>
          <div className="flex items-center gap-2">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => e.target.files?.[0] && onUploadImage(e.target.files[0])}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-paper px-3 py-1.5 text-xs font-medium hover:border-sage disabled:opacity-50"
            >
              <ImagePlus className="h-3.5 w-3.5" />
              {uploading ? "Uploading..." : "Upload foto"}
            </button>
          </div>
        </div>

        {form.images.length === 0 ? (
          <div
            onClick={() => fileRef.current?.click()}
            className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-line py-10 text-ink/35 transition hover:border-sage hover:text-sage-deep"
          >
            <ImagePlus className="h-7 w-7" />
            <p className="text-xs">Klik untuk upload foto produk</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {form.images.map((url, idx) => (
              <div key={idx} className="group relative overflow-hidden rounded-lg border border-line">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={`Product image ${idx + 1}`} className="aspect-square w-full object-cover" />
                {idx === 0 && (
                  <span className="absolute left-1 top-1 rounded bg-sage-deep px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-paper">
                    Cover
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute right-1 top-1 rounded-full bg-ink/70 p-0.5 text-paper opacity-0 transition-opacity hover:bg-rose-600 group-hover:opacity-100"
                  title="Hapus foto"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            {/* Upload more tile */}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-line text-ink/30 transition hover:border-sage hover:text-sage-deep disabled:opacity-40"
            >
              <ImagePlus className="h-5 w-5" />
              <span className="text-[10px]">{uploading ? "..." : "Tambah"}</span>
            </button>
          </div>
        )}
      </div>

      {/* Colors */}
      <ListEditor
        label="Colors"
        items={form.colors}
        render={(c, i) => (
          <div className="flex gap-2">
            <input
              value={c.name}
              onChange={(e) => set("colors", form.colors.map((x, xi) => (xi === i ? { ...x, name: e.target.value } : x)))}
              placeholder="Color name"
              className={cmsInput("flex-1")}
            />
            <input
              type="color"
              value={c.hex}
              onChange={(e) => set("colors", form.colors.map((x, xi) => (xi === i ? { ...x, hex: e.target.value } : x)))}
              className="h-[42px] w-12 rounded-lg border border-line"
            />
          </div>
        )}
        onAdd={() => set("colors", [...form.colors, { name: "New color", hex: "#9DAD8E" }])}
        onRemove={(i) => set("colors", form.colors.filter((_, xi) => xi !== i))}
      />

      {/* Inclusions */}
      <ListEditor
        label="Inclusions (untuk bundle)"
        items={form.inclusions}
        render={(inc, i) => (
          <input
            value={inc}
            onChange={(e) => set("inclusions", form.inclusions.map((x, xi) => (xi === i ? e.target.value : x)))}
            className={cmsInput()}
          />
        )}
        onAdd={() => set("inclusions", [...form.inclusions, ""])}
        onRemove={(i) => set("inclusions", form.inclusions.filter((_, xi) => xi !== i))}
      />

      <div className="flex items-center gap-3">
        <button
          onClick={onSave}
          disabled={saving}
          className="rounded-lg bg-ink px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-paper hover:bg-sage-deep disabled:opacity-40"
        >
          {saving ? "Saving..." : "Save product"}
        </button>
        {msg && <span className="text-xs text-ink/55">{msg}</span>}
      </div>

      {/* Variants */}
      <VariantsEditor productId={product.id} variants={variants} />
    </div>
  );
}

function ListEditor<T>({
  label,
  items,
  render,
  onAdd,
  onRemove,
}: {
  label: string;
  items: T[];
  render: (item: T, i: number) => React.ReactNode;
  onAdd: () => void;
  onRemove: (i: number) => void;
}) {
  return (
    <div>
      <CmsLabel>{label}</CmsLabel>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="flex-1">{render(item, i)}</div>
            <button type="button" onClick={() => onRemove(i)} className="text-ink/40 hover:text-rose-600">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
      <button type="button" onClick={onAdd} className="mt-2 text-xs font-medium text-sage-deep hover:underline">
        + Tambah
      </button>
    </div>
  );
}

function VariantsEditor({ productId, variants }: { productId: string; variants: CmsVariant[] }) {
  const router = useRouter();
  const [rows, setRows] = useState<CmsVariant[]>(variants);
  const [busy, setBusy] = useState(false);

  function patch(i: number, p: Partial<CmsVariant>) {
    setRows((r) => r.map((x, xi) => (xi === i ? { ...x, ...p } : x)));
  }
  async function save(v: CmsVariant) {
    setBusy(true);
    await saveVariant({
      id: v.id || undefined,
      productId,
      label: v.label,
      dimensions: v.dimensions,
      price: v.price,
      sortOrder: v.sortOrder,
    });
    setBusy(false);
    router.refresh();
  }
  async function remove(v: CmsVariant) {
    if (v.id && !confirm("Hapus varian ini?")) return;
    if (v.id) {
      setBusy(true);
      await deleteVariant(v.id);
      setBusy(false);
      router.refresh();
    } else {
      setRows((r) => r.filter((x) => x !== v));
    }
  }

  return (
    <div className="rounded-xl border border-line bg-paper p-4">
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-ink/50">
        Variants &amp; pricing
      </p>
      <div className="space-y-2">
        {rows.map((v, i) => (
          <div key={v.id || `new-${i}`} className="grid grid-cols-12 gap-2">
            <input
              value={v.label}
              onChange={(e) => patch(i, { label: e.target.value })}
              placeholder="Label (e.g. King)"
              className={cmsInput("col-span-3")}
            />
            <input
              value={v.dimensions}
              onChange={(e) => patch(i, { dimensions: e.target.value })}
              placeholder="Dimensions"
              className={cmsInput("col-span-3")}
            />
            <input
              type="number"
              value={v.price}
              onChange={(e) => patch(i, { price: Number(e.target.value) })}
              placeholder="Price"
              className={cmsInput("col-span-2")}
            />
            <span className="col-span-2 flex items-center text-xs text-ink/45">{formatIDR(v.price)}</span>
            <button
              onClick={() => save(v)}
              disabled={busy}
              className="col-span-1 rounded-lg bg-sage-deep text-xs font-semibold text-paper disabled:opacity-40"
            >
              Save
            </button>
            <button
              onClick={() => remove(v)}
              className="col-span-1 flex items-center justify-center text-ink/40 hover:text-rose-600"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() =>
          setRows((r) => [...r, { id: "", productId, label: "", dimensions: "", price: 0, sortOrder: r.length }])
        }
        className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-sage-deep hover:underline"
      >
        <Plus className="h-3.5 w-3.5" /> Tambah varian
      </button>
    </div>
  );
}
