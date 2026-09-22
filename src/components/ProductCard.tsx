"use client";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { formatIDR, priceFrom, type Product } from "@/lib/products";
import { useCart } from "@/store/cartStore";
import { cn } from "@/lib/cn";

interface Props {
  product: Product;
  size?: "default" | "feature";
  /** When true, card links to /shop/[id] detail page instead of scroll anchor */
  linkToDetail?: boolean;
}

export function ProductCard({ product, linkToDetail = false }: Props) {
  const add = useCart((s) => s.add);
  const [selectedColor, setSelectedColor] = useState(0);
  const minPrice = priceFrom(product);
  const color = product.colors[selectedColor] || product.colors[0];

  return (
    <article className="group flex flex-col" aria-label={`${product.name} — ${color?.name}`}>
      {/* Product Image Frame */}
      <Link href={linkToDetail ? `/shop/${product.id}` : `/shop#${product.id}`} className="block">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-cream/80 transition-colors">
        {/* Fabric tone representation */}
        {product.imageUrl ? (
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            style={{ backgroundImage: `url(${product.imageUrl})` }}
          />
        ) : (
          <div
            className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            style={{
              background: `radial-gradient(circle at 50% 40%, ${shade(color.hex, 1.06)} 0%, ${color.hex} 60%, ${shade(color.hex, 0.88)} 100%)`,
            }}
          >
            {/* Very subtle organic fabric sheen */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/10 mix-blend-overlay" />
          </div>
        )}

        {/* Subtle Badge (Top-Left) */}
        {product.tag && (
          <span className="absolute left-3.5 top-3.5 rounded-full bg-paper/90 px-2.5 py-1 text-[9px] font-medium uppercase tracking-widest text-ink shadow-sm backdrop-blur-sm">
            {product.tag}
          </span>
        )}

        {/* Quick Add Button — hidden when linking to detail page */}
        {!linkToDetail && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              add(product, product.variants[0], color);
            }}
            title={`Add ${product.name} to cart`}
            className="absolute bottom-3.5 right-3.5 flex h-9 w-9 items-center justify-center rounded-full bg-paper/95 text-ink shadow-sm backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-ink hover:text-paper"
          >
            <Plus className="h-4 w-4" strokeWidth={1.8} />
          </button>
        )}
      </div>
      </Link>

      {/* Product Info (Clean editorial typography) */}
      <div className="mt-4 flex flex-col space-y-2">
        <div className="flex items-baseline justify-between gap-3">
          <Link
            href={linkToDetail ? `/shop/${product.id}` : `/shop#${product.id}`}
            className="hover:opacity-75 transition-opacity"
          >
            <h3 className="text-base font-normal tracking-tight text-ink">
              {product.name}
            </h3>
          </Link>
          <p className="shrink-0 text-sm font-medium tabular-nums text-ink/80">
            {formatIDR(minPrice)}
          </p>
        </div>

        <p className="text-xs font-light text-soft line-clamp-1">
          {product.subtitle}
        </p>

        {/* Minimal Color Swatches & Active Color Name */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5">
            {product.colors.map((c, idx) => (
              <button
                key={c.name}
                type="button"
                onClick={() => setSelectedColor(idx)}
                aria-label={c.name}
                title={c.name}
                className={cn(
                  "h-3.5 w-3.5 rounded-full transition-all",
                  selectedColor === idx
                    ? "ring-1 ring-ink ring-offset-2 ring-offset-paper scale-110"
                    : "ring-1 ring-line hover:ring-soft",
                )}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
          <span className="text-[11px] font-light text-soft">
            {color.name}
          </span>
        </div>
      </div>
    </article>
  );
}

/** Utility to compute tonal variations of hex color */
function shade(hex: string, factor: number): string {
  const h = hex.replace("#", "").slice(0, 6);
  const r = Math.min(255, Math.round(parseInt(h.slice(0, 2), 16) * factor));
  const g = Math.min(255, Math.round(parseInt(h.slice(2, 4), 16) * factor));
  const b = Math.min(255, Math.round(parseInt(h.slice(4, 6), 16) * factor));
  return `rgb(${r},${g},${b})`;
}
