"use client";
import { ArrowRight } from "lucide-react";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { RevealGroup, ScrollStage } from "@/components/ScrollStage";
import { FILTER_OPTIONS, formatIDR, type Product, type ProductCategory } from "@/lib/products";
import { useCart } from "@/store/cartStore";
import { cn } from "@/lib/cn";

export function ShopClient({
  products,
  initialCategory = "All",
}: {
  products: Product[];
  initialCategory?: "All" | ProductCategory;
}) {
  const [filter, setFilter] = useState<"All" | ProductCategory>(initialCategory);

  const filtered = useMemo(
    () => (filter === "All" ? products : products.filter((p) => p.category === filter)),
    [filter, products],
  );

  return (
    <>
      <ScrollStage variant="lift">
        <section className="pt-14 lg:pt-20">
          <div className="mx-auto max-w-[1480px] px-6 lg:px-12">
            <RevealGroup>
              <p className="text-xs uppercase tracking-widest text-soft" data-reveal>
                <span className="mr-3 inline-block h-px w-8 align-middle bg-ink/40" />
                All editions · TENCEL™ Lyocell
              </p>
              <h1 className="mt-8 text-[clamp(3rem,6vw,5.5rem)] font-light leading-[0.95]" data-reveal data-reveal-delay="120">
                The <strong className="font-semibold text-sage-deep">Shop</strong>.
              </h1>
              <p className="mt-6 max-w-xl text-base font-light leading-[1.85] text-ink/75" data-reveal data-reveal-delay="220">
                Sleep essentials dalam lima colorways dan beragam ukuran. Semua dijahit dengan TENCEL™ Lyocell
                asli — silky-soft, breathable, dan baik untuk planet.
              </p>
            </RevealGroup>
          </div>
        </section>
      </ScrollStage>

      {/* Filter bar */}
      <div className="sticky top-[72px] z-30 mt-16 border-y border-line bg-paper/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1480px] flex-wrap items-center justify-between gap-4 px-6 py-5 lg:px-12">
          <div className="flex flex-wrap items-center gap-1.5">
            {FILTER_OPTIONS.map((opt) => {
              const active = filter === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setFilter(opt)}
                  className={cn(
                    "relative rounded-full px-4 py-2 text-xs font-medium tracking-wider transition-colors duration-500 ease-smooth",
                    active ? "text-paper" : "text-soft hover:text-ink",
                  )}
                >
                  <span
                    className={cn(
                      "absolute inset-0 -z-0 rounded-full bg-ink transition-transform duration-500 ease-smooth",
                      active ? "scale-100" : "scale-0",
                    )}
                  />
                  <span className="relative">{opt}</span>
                </button>
              );
            })}
          </div>
          <p className="text-[10px] uppercase tracking-widest tabular-nums text-soft">
            [{filtered.length.toString().padStart(2, "0")}] items
          </p>
        </div>
      </div>

      {/* Grid */}
      <ScrollStage variant="lift">
        <section className="mx-auto max-w-[1480px] px-6 py-16 lg:px-12 lg:py-20">
          {filtered.length === 0 ? (
            <p className="py-20 text-center text-3xl font-light italic text-ink/40">no items in this category</p>
          ) : (
            <RevealGroup>
              <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
                {filtered.map((product, idx) => (
                  <div key={product.id} id={product.id} data-reveal data-reveal-delay={`${(idx % 3) * 100}`}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </RevealGroup>
          )}
        </section>
      </ScrollStage>

      {/* Size & variant explorer */}
      <ScrollStage variant="scale">
        <section className="bg-cream py-24 lg:py-32">
          <div className="mx-auto max-w-[1480px] px-6 lg:px-12">
            <RevealGroup>
              <div className="mb-12 max-w-2xl" data-reveal>
                <p className="text-xs uppercase tracking-widest text-soft">Sizes & pricing</p>
                <h2 className="mt-4 text-[clamp(2rem,4vw,3.25rem)] font-light leading-[1.05]">
                  Find your <strong className="font-semibold">perfect size</strong>.
                </h2>
              </div>

              <div className="space-y-12" data-reveal data-reveal-delay="150">
                {products.map((p) => (
                  <SizeBlock key={p.id} product={p} />
                ))}
              </div>
            </RevealGroup>
          </div>
        </section>
      </ScrollStage>
    </>
  );
}

function SizeBlock({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  const [variantIdx, setVariantIdx] = useState(0);
  const [colorIdx, setColorIdx] = useState(0);

  // Guard against products with no variants / colors yet
  if (product.variants.length === 0 || product.colors.length === 0) return null;

  const variant = product.variants[Math.min(variantIdx, product.variants.length - 1)];
  const color = product.colors[Math.min(colorIdx, product.colors.length - 1)];

  return (
    <div id={`size-${product.id}`} className="grid items-center gap-8 rounded-3xl bg-paper p-6 shadow-card md:grid-cols-[1fr_1.5fr] md:p-8">
      <div
        className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-cover bg-center"
        style={product.imageUrl ? { backgroundImage: `url(${product.imageUrl})` } : { backgroundColor: color.hex }}
      >
        {!product.imageUrl && (
          <span className="slpzy-mark absolute inset-0 flex items-center justify-center text-[clamp(3rem,8vw,6rem)] !text-paper/25">slpzy</span>
        )}
        <div className="absolute left-4 top-4 rounded-full bg-paper/90 px-3 py-1 text-[10px] font-semibold tracking-wider text-sage-deep">TENCEL™</div>
      </div>

      <div className="space-y-6">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-soft">{product.category}</p>
          <h3 className="mt-2 text-3xl">
            {product.displayLead && <strong className="font-semibold">{product.displayLead} </strong>}
            <span className="font-light">{product.displayTail}</span>
          </h3>
          <p className="mt-3 max-w-md text-sm font-light leading-relaxed text-ink/75">{product.description}</p>
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-widest text-soft">Color · {color.name}</p>
          <div className="mt-3 flex items-center gap-2">
            {product.colors.map((c, idx) => (
              <button
                key={c.name}
                type="button"
                aria-label={c.name}
                onClick={() => setColorIdx(idx)}
                className={cn(
                  "h-6 w-6 rounded-full ring-offset-2 ring-offset-paper transition-all",
                  colorIdx === idx ? "ring-1 ring-ink" : "ring-1 ring-line hover:ring-soft",
                )}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-widest text-soft">Size</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {product.variants.map((v, idx) => {
              const active = idx === variantIdx;
              return (
                <button
                  key={`${v.label}-${v.dimensions ?? idx}`}
                  type="button"
                  onClick={() => setVariantIdx(idx)}
                  className={cn(
                    "flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-all duration-300",
                    active ? "border-ink bg-ink/[0.02]" : "border-line hover:border-soft",
                  )}
                >
                  <div>
                    <p className="text-sm font-medium">{v.label}</p>
                    {v.dimensions && <p className="text-[10px] uppercase tracking-wider text-soft">{v.dimensions}</p>}
                  </div>
                  <p className="text-xs font-semibold tabular-nums">{formatIDR(v.price)}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-4">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-soft">Selected</p>
            <p className="mt-1 text-xl font-semibold tabular-nums">{formatIDR(variant.price)}</p>
          </div>
          <button
            type="button"
            onClick={() => add(product, variant, color)}
            className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-xs font-medium tracking-wider text-paper transition-colors hover:bg-sage-deep"
          >
            Add to Bag
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-500 ease-smooth group-hover:translate-x-1" strokeWidth={1.6} />
          </button>
        </div>
      </div>
    </div>
  );
}
