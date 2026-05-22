"use client";
import { Search, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { formatIDR, PRODUCTS, priceFrom } from "@/lib/products";

/**
 * Lightweight product search overlay — opens from the navbar search icon.
 * Filters the catalogue by name / category and links into the shop.
 */
export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PRODUCTS;
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q),
    );
  }, [query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-x-0 top-0 bg-paper">
        <div className="mx-auto max-w-[1100px] px-6 py-6 lg:px-10">
          <div className="flex items-center gap-4 border-b border-line pb-4">
            <Search className="h-5 w-5 shrink-0 text-soft" strokeWidth={1.6} />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari bedsheet, bedcover, bundle…"
              className="w-full bg-transparent text-lg font-light outline-none placeholder:text-ink/35"
            />
            <button onClick={onClose} aria-label="Close search" className="shrink-0 text-soft hover:text-ink">
              <X className="h-5 w-5" strokeWidth={1.6} />
            </button>
          </div>

          <div className="max-h-[60vh] overflow-y-auto py-5">
            <p className="mb-4 text-[10px] uppercase tracking-widest text-soft">
              {query.trim() ? `${results.length} hasil` : "Semua produk"}
            </p>
            <div className="grid gap-2">
              {results.map((p) => (
                <Link
                  key={p.id}
                  href={`/shop#${p.id}`}
                  onClick={onClose}
                  className="group flex items-center justify-between gap-4 rounded-lg px-3 py-3 transition-colors hover:bg-cream"
                >
                  <div className="flex items-center gap-4">
                    <span
                      className="h-11 w-11 shrink-0 rounded-md"
                      style={{ backgroundColor: p.colors[0]?.hex ?? "#9DAD8E" }}
                    />
                    <div>
                      <p className="text-sm font-medium text-ink">{p.name}</p>
                      <p className="text-[10px] uppercase tracking-widest text-soft">{p.category}</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold tabular-nums text-sage-deep">
                    {formatIDR(priceFrom(p))}
                  </span>
                </Link>
              ))}
              {results.length === 0 && (
                <p className="py-10 text-center text-sm font-light italic text-ink/40">
                  Tidak ada produk yang cocok.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
