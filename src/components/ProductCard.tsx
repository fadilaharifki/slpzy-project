"use client";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { formatIDR, priceFrom, type Product } from "@/lib/products";
import { useCart } from "@/store/cartStore";
import { cn } from "@/lib/cn";

interface Props {
  product: Product;
  /** "feature" makes the card taller (used in asymmetric grids) */
  size?: "default" | "feature";
}

export function ProductCard({ product, size = "default" }: Props) {
  const add = useCart((s) => s.add);
  const [selectedColor, setSelectedColor] = useState(0);
  const minPrice = priceFrom(product);
  const color = product.colors[selectedColor];

  const aspect = size === "feature" ? "aspect-square" : "aspect-square";

  return (
    <article className="group flex flex-col" aria-label={`${product.name} — ${color.name}`}>
      {/* Image */}
      <div className={cn("relative overflow-hidden rounded-3xl bg-cream", aspect)}>
        {/* Fabric tone background — gradient mimic */}
        <div
          className="absolute inset-0 transition-transform duration-[1100ms] ease-smooth group-hover:scale-[1.04]"
          style={{
            background: `linear-gradient(135deg, ${shade(color.hex, 1.1)} 0%, ${color.hex} 50%, ${shade(color.hex, 0.78)} 100%)`,
          }}
        />

        {/* Decorative folds — soft curves */}
        <svg className="absolute inset-0 h-full w-full opacity-25" viewBox="0 0 400 500" preserveAspectRatio="none" aria-hidden>
          <path d="M-20 320 Q 100 280 200 340 T 420 360 L 420 520 L -20 520 Z" fill="rgba(255,255,255,0.18)" />
          <path d="M-20 380 Q 120 340 240 400 T 420 410 L 420 520 L -20 520 Z" fill="rgba(0,0,0,0.06)" />
        </svg>

        {/* Watermark */}
        <span className="slpzy-mark absolute inset-0 flex items-center justify-center text-[clamp(4rem,12vw,9rem)] text-paper/15">slpzy</span>

        {/* Tag */}
        {product.tag && (
          <span className="absolute left-5 top-5 rounded-full bg-paper/95 px-3 py-1 text-[10px] font-semibold tracking-wide text-ink backdrop-blur-sm">
            {product.tag.toUpperCase()}
          </span>
        )}

        {/* TENCEL ribbon top-right */}
        <span className="absolute right-5 top-5 rounded-full bg-paper/85 px-3 py-1 text-[9px] font-semibold tracking-wider text-sage-deep backdrop-blur-sm">
          TENCEL™
        </span>

        {/* Quick add bar */}
        <button
          type="button"
          onClick={() => add(product, product.variants[0], color)}
          className="absolute inset-x-5 bottom-5 flex translate-y-[120%] items-center justify-center gap-2 rounded-full bg-ink py-3.5 text-xs font-medium text-paper transition-transform duration-500 ease-smooth group-hover:translate-y-0"
        >
          Add to Bag · {formatIDR(product.variants[0].price)}
          <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.6} />
        </button>
      </div>

      {/* Meta */}
      <div className="mt-6 space-y-3 px-1">
        <div className="flex items-start justify-between gap-4">
          <Link href={`/shop#${product.id}`} className="block">
            <p className="text-[10px] uppercase tracking-widest text-soft">{product.category}</p>
            <h3 className="mt-2 text-2xl leading-tight text-ink">
              {product.displayLead && <span className="font-semibold">{product.displayLead} </span>}
              <span className="font-light">{product.displayTail}</span>
            </h3>
          </Link>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest text-soft">From</p>
            <p className="mt-1 text-sm font-semibold text-ink tabular-nums">{formatIDR(minPrice)}</p>
          </div>
        </div>

        {/* Color chips */}
        <div className="flex items-center gap-2 pt-1">
          {product.colors.map((c, idx) => (
            <button
              key={c.name}
              type="button"
              onClick={() => setSelectedColor(idx)}
              aria-label={c.name}
              className={cn(
                "h-5 w-5 rounded-full ring-offset-2 ring-offset-paper transition-all",
                selectedColor === idx ? "ring-1 ring-ink" : "ring-1 ring-line hover:ring-soft",
              )}
              style={{ backgroundColor: c.hex }}
            />
          ))}
          <span className="ml-auto text-[10px] tracking-wider text-soft">{color.name}</span>
        </div>
      </div>
    </article>
  );
}

/** Lighten or darken a hex by factor (1 = no change). Quick utility for gradient stops. */
function shade(hex: string, factor: number): string {
  const h = hex.replace("#", "");
  const r = Math.min(255, Math.round(parseInt(h.slice(0, 2), 16) * factor));
  const g = Math.min(255, Math.round(parseInt(h.slice(2, 4), 16) * factor));
  const b = Math.min(255, Math.round(parseInt(h.slice(4, 6), 16) * factor));
  return `rgb(${r},${g},${b})`;
}
