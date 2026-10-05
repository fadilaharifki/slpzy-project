"use client";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Check, Minus, Plus, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { formatIDR, type Product } from "@/lib/products";
import { useCart } from "@/store/cartStore";

// Fallback lifestyle images if a product has no uploaded media
const FALLBACK_THUMBNAILS = [
  "/images/cat-bedsheet.jpg",
  "/images/cat-bedcover.jpg",
  "/images/cat-pillow.jpg",
  "/images/cat-bundle.jpg",
];

export function ProductDetailClient({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  const openCart = useCart((s) => s.open);
  const [colorIdx, setColorIdx] = useState(0);
  const [variantIdx, setVariantIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeThumb, setActiveThumb] = useState(0);

  const color = product.colors[colorIdx] ?? product.colors[0];
  const variant = product.variants[variantIdx] ?? product.variants[0];

  function handleAddToBag() {
    for (let i = 0; i < qty; i++) add(product, variant, color);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  // Priority for images:
  // 1. product.images (multiple photos uploaded in CMS)
  // 2. product.imageUrl (single cover photo)
  // 3. Fallback to category lifestyle photo
  const gallery = useMemo(() => {
    if (product.images && product.images.length > 0) {
      return product.images;
    }
    if (product.imageUrl) {
      return [product.imageUrl];
    }
    const catFallback =
      product.category === "Bedcover"
        ? "/images/cat-bedcover.jpg"
        : product.category === "Pillow & Bolster"
        ? "/images/cat-pillow.jpg"
        : product.category === "Bundle"
        ? "/images/cat-bundle.jpg"
        : "/images/cat-bedsheet.jpg";
    return [catFallback, ...FALLBACK_THUMBNAILS.filter((t) => t !== catFallback)];
  }, [product]);

  const hasRealImage = Boolean(product.imageUrl || (product.images && product.images.length > 0));
  const activeImage = gallery[activeThumb] ?? gallery[0];

  return (
    <div className="bg-paper text-ink">
      {/* Back nav */}
      <div className="mx-auto max-w-[1440px] px-6 py-3 lg:px-12">
        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 text-xs font-medium tracking-wider text-soft transition-colors hover:text-ink"
        >
          <ArrowLeft className="h-3 w-3" strokeWidth={2} />
          Back to Collection
        </Link>
      </div>

      {/* Main 2-col layout */}
      <section className="mx-auto max-w-[1440px] px-6 pb-16 lg:px-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_480px] lg:gap-14 lg:items-start">

          {/* ── Left: Sticky Image + Thumbnails ── */}
          <div className="lg:sticky lg:top-[72px] lg:self-start">
            <div className="flex gap-3">
              {/* Thumbnail strip — vertical on desktop (only if real images exist) */}
              {hasRealImage && gallery.length > 1 && (
                <div className="hidden lg:flex lg:flex-col gap-2 w-16 shrink-0">
                  {gallery.map((src, idx) => (
                    <button
                      key={src + idx}
                      type="button"
                      onClick={() => setActiveThumb(idx)}
                      className={cn(
                        "relative aspect-square w-full overflow-hidden rounded-lg border-2 transition-all",
                        activeThumb === idx ? "border-ink shadow-sm" : "border-transparent opacity-60 hover:opacity-100",
                      )}
                    >
                      <Image src={src} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" sizes="64px" />
                    </button>
                  ))}
                </div>
              )}

              {/* Main image / Branded placeholder */}
              <div className="relative flex-1 overflow-hidden rounded-2xl bg-cream">
                {hasRealImage ? (
                  <div className="relative aspect-square w-full">
                    <Image
                      key={activeImage}
                      src={activeImage}
                      alt={`${product.name} — view ${activeThumb + 1}`}
                      fill
                      className="object-cover transition-opacity duration-300"
                      sizes="(max-width: 1024px) 100vw, 55vw"
                      priority
                    />
                  </div>
                ) : (
                  <div
                    className="relative aspect-square w-full flex flex-col items-center justify-center p-8 text-center transition-colors duration-500"
                    style={{
                      background: `radial-gradient(circle at 50% 40%, #8C8276 0%, #6E655A 60%, #524A40 100%)`,
                    }}
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.18),transparent_70%)]" />
                    <img
                      src="/slpzy-logo.png"
                      alt="SLPZY"
                      className="relative z-10 h-16 w-auto opacity-85 brightness-0 invert drop-shadow-md"
                    />
                    <span className="relative z-10 mt-3 text-xs font-light uppercase tracking-[0.3em] text-paper/80">
                      100% Certified Tencel™
                    </span>
                    <div className="relative z-10 mt-5 flex items-center gap-2 rounded-full border border-paper/20 bg-paper/10 px-3.5 py-1.5 backdrop-blur-sm text-[11px] text-paper/90">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color.hex }} />
                      <span>{color.name}</span>
                    </div>
                  </div>
                )}

                {/* Badges */}
                {product.tag && (
                  <span className="absolute left-3 top-3 rounded-full bg-paper/90 px-2.5 py-1 text-[9px] font-medium uppercase tracking-widest text-ink backdrop-blur-sm">
                    {product.tag}
                  </span>
                )}
                <div className="absolute right-3 top-3 rounded-full bg-ink/70 px-2.5 py-1 text-[9px] font-medium tracking-widest text-paper/90 backdrop-blur-sm">
                  TENCEL™
                </div>
              </div>
            </div>

            {/* Mobile thumbnails — horizontal strip (only if real images exist) */}
            {hasRealImage && gallery.length > 1 && (
              <div className="mt-3 flex gap-2 lg:hidden overflow-x-auto no-scrollbar py-1">
                {gallery.map((src, idx) => (
                  <button
                    key={src + idx}
                    type="button"
                    onClick={() => setActiveThumb(idx)}
                    className={cn(
                      "relative aspect-square w-14 shrink-0 overflow-hidden rounded-lg border-2 transition-all",
                      activeThumb === idx ? "border-ink shadow-sm" : "border-transparent opacity-50 hover:opacity-100",
                    )}
                  >
                    <Image src={src} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" sizes="56px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Right: Scrollable Product Info ── */}
          <div className="flex flex-col gap-5">
            {/* Header */}
            <div>
              <p className="text-[10px] font-medium uppercase tracking-widest text-soft">
                {product.category}
              </p>
              <h1 className="mt-1 text-2xl font-light tracking-tight text-ink sm:text-[1.75rem]">
                {product.displayLead && <span className="font-semibold">{product.displayLead} </span>}
                {product.displayTail}
              </h1>
              <p className="mt-1 text-xs font-light text-ink/55">{product.subtitle}</p>
            </div>

            {/* Price */}
            <p className="text-lg font-medium tabular-nums text-ink">
              {formatIDR(variant.price)}
              {variant.dimensions && (
                <span className="ml-2 text-xs font-light text-soft">— {variant.label} {variant.dimensions}</span>
              )}
            </p>

            <div className="h-px bg-line" />

            {/* Color */}
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-soft">
                Color: <span className="font-normal normal-case text-ink">{color.name}</span>
              </p>
              <div className="flex items-center gap-2">
                {product.colors.map((c, idx) => (
                  <button
                    key={c.name}
                    type="button"
                    aria-label={c.name}
                    onClick={() => setColorIdx(idx)}
                    className={cn(
                      "h-7 w-7 rounded-full border-2 transition-all",
                      colorIdx === idx ? "border-ink scale-110 shadow-sm" : "border-transparent hover:border-soft",
                    )}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </div>

            {/* Size — dropdown style on mobile, grid on desktop */}
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-soft">Size</p>
              <div className="grid gap-2 grid-cols-1 sm:grid-cols-2">
                {product.variants.map((v, idx) => (
                  <button
                    key={`${v.label}-${v.dimensions ?? idx}`}
                    type="button"
                    onClick={() => setVariantIdx(idx)}
                    className={cn(
                      "flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-all",
                      variantIdx === idx ? "border-ink bg-ink text-paper" : "border-line hover:border-soft",
                    )}
                  >
                    <div>
                      <p className={cn("text-xs font-medium", variantIdx === idx ? "text-paper" : "text-ink")}>
                        {v.label}
                      </p>
                      {v.dimensions && (
                        <p className={cn("text-[10px]", variantIdx === idx ? "text-paper/60" : "text-soft")}>
                          {v.dimensions}
                        </p>
                      )}
                    </div>
                    <p className={cn("text-xs font-semibold tabular-nums", variantIdx === idx ? "text-paper" : "text-ink")}>
                      {formatIDR(v.price)}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Qty */}
            <div className="flex items-center gap-4">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-soft">Qty</p>
              <div className="flex items-center gap-2 rounded-full border border-line px-2.5 py-1.5">
                <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="flex h-5 w-5 items-center justify-center text-soft hover:text-ink transition-colors">
                  <Minus className="h-3 w-3" strokeWidth={2} />
                </button>
                <span className="w-5 text-center text-sm font-medium tabular-nums">{qty}</span>
                <button type="button" onClick={() => setQty((q) => q + 1)}
                  className="flex h-5 w-5 items-center justify-center text-soft hover:text-ink transition-colors">
                  <Plus className="h-3 w-3" strokeWidth={2} />
                </button>
              </div>
            </div>

            {/* CTA */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleAddToBag}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 rounded-full border py-3.5 text-xs font-medium tracking-wider transition-all duration-300",
                  added ? "border-sage-deep bg-sage-deep/10 text-sage-deep" : "border-ink text-ink hover:bg-ink hover:text-paper",
                )}
              >
                {added ? <><Check className="h-3.5 w-3.5" strokeWidth={2.5} /> Added!</> : "Add to Bag"}
              </button>
              <button
                type="button"
                onClick={() => { handleAddToBag(); openCart(); }}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-ink py-3.5 text-xs font-medium tracking-wider text-paper transition-colors hover:bg-sage-deep"
              >
                Buy Now <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.8} />
              </button>
            </div>

            {/* Trust */}
            <p className="text-[11px] text-soft">
              Free shipping above IDR 800K &nbsp;·&nbsp; 7-day returns
            </p>

            <div className="h-px bg-line" />

            {/* Description accordion-style */}
            <details className="group">
              <summary className="flex cursor-pointer items-center justify-between py-1 text-[11px] font-semibold uppercase tracking-widest text-ink list-none">
                Product Details
                <span className="text-soft transition-transform group-open:rotate-180">↓</span>
              </summary>
              <p className="mt-3 text-xs font-light leading-relaxed text-ink/70">{product.description}</p>
            </details>

            {product.inclusions && product.inclusions.length > 0 && (
              <details className="group" open>
                <summary className="flex cursor-pointer items-center justify-between py-1 text-[11px] font-semibold uppercase tracking-widest text-ink list-none">
                  What&apos;s Included
                  <span className="text-soft transition-transform group-open:rotate-180">↓</span>
                </summary>
                <ul className="mt-3 space-y-1.5">
                  {product.inclusions.map((inc) => (
                    <li key={inc} className="flex items-start gap-2 text-xs font-light text-ink/80">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sage-deep" strokeWidth={2} />
                      {inc}
                    </li>
                  ))}
                </ul>
              </details>
            )}

            <details className="group">
              <summary className="flex cursor-pointer items-center justify-between py-1 text-[11px] font-semibold uppercase tracking-widest text-ink list-none">
                Shipping &amp; Returns
                <span className="text-soft transition-transform group-open:rotate-180">↓</span>
              </summary>
              <div className="mt-3 space-y-2">
                {["Free shipping for orders above IDR 800K", "7-day easy return policy", "100% TENCEL™ Lyocell certified by Lenzing"].map((t) => (
                  <div key={t} className="flex items-center gap-2">
                    <ShieldCheck className="h-3 w-3 shrink-0 text-sage-deep" strokeWidth={1.6} />
                    <span className="text-xs text-soft">{t}</span>
                  </div>
                ))}
              </div>
            </details>
          </div>
        </div>
      </section>
    </div>
  );
}
