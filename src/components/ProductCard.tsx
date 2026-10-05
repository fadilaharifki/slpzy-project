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
  const coverImage = product.imageUrl || (product.images && product.images.length > 0 ? product.images[0] : null);

  return (
    <article className="group flex flex-col" aria-label={`${product.name} — ${color?.name}`}>
      {/* Product Image Frame */}
      <Link href={linkToDetail ? `/shop/${product.id}` : `/shop#${product.id}`} className="block">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-cream/80 transition-colors">
        {/* Fabric tone representation / uploaded product image */}
        {coverImage ? (
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            style={{ backgroundImage: `url(${coverImage})` }}
          />
        ) : (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center p-4 sm:p-6 text-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            style={{
              background: `radial-gradient(circle at 50% 35%, #8C8276 0%, #72685D 55%, #564D43 100%)`,
            }}
          >
            {/* Ambient luxury radial glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.18),transparent_65%)]" />
            <img
              src="/slpzy-logo.png"
              alt="SLPZY"
              className="relative z-10 h-8 sm:h-9 w-auto opacity-80 brightness-0 invert drop-shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:opacity-100"
            />
            <span className="relative z-10 mt-2 text-[8px] sm:text-[9px] font-light uppercase tracking-[0.25em] text-paper/70">
              100% Tencel™
            </span>
          </div>
        )}

        {/* Subtle Badge (Top-Left) */}
        {product.tag && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-paper/90 px-2 py-0.5 text-[8px] sm:left-3.5 sm:top-3.5 sm:px-2.5 sm:py-1 sm:text-[9px] font-medium uppercase tracking-widest text-ink shadow-sm backdrop-blur-sm">
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
            className="absolute bottom-2.5 right-2.5 flex h-7 w-7 sm:bottom-3.5 sm:right-3.5 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-paper/95 text-ink shadow-sm backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-ink hover:text-paper"
          >
            <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={1.8} />
          </button>
        )}
      </div>
      </Link>

      {/* Product Info (Clean editorial typography) */}
      <div className="mt-2.5 sm:mt-4 flex flex-col space-y-1 sm:space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-0.5 sm:gap-3">
          <Link
            href={linkToDetail ? `/shop/${product.id}` : `/shop#${product.id}`}
            className="hover:opacity-75 transition-opacity"
          >
            <h3 className="text-xs sm:text-base font-normal tracking-tight text-ink line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <p className="shrink-0 text-xs sm:text-sm font-medium tabular-nums text-ink/85">
            {formatIDR(minPrice)}
          </p>
        </div>

        <p className="text-[10px] sm:text-xs font-light text-soft line-clamp-1">
          {product.subtitle}
        </p>

        {/* Minimal Color Swatches & Active Color Name */}
        <div className="flex items-center justify-between pt-0.5 sm:pt-1">
          <div className="flex items-center gap-1 sm:gap-1.5">
            {product.colors.map((c, idx) => (
              <button
                key={c.name}
                type="button"
                onClick={() => setSelectedColor(idx)}
                aria-label={c.name}
                title={c.name}
                className={cn(
                  "h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 rounded-full transition-all",
                  selectedColor === idx
                    ? "ring-1 ring-ink ring-offset-1 sm:ring-offset-2 ring-offset-paper scale-110"
                    : "ring-1 ring-line hover:ring-soft",
                )}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
          <span className="text-[10px] sm:text-[11px] font-light text-soft truncate pl-1">
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
