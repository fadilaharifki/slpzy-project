"use client";
import Image from "next/image";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ProductCard } from "@/components/ProductCard";
import { FILTER_OPTIONS, type Product, type ProductCategory } from "@/lib/products";
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
    <div className="bg-paper text-ink">

      {/* ── Shop Hero Banner (short, ~50vh) ── */}
      <section className="relative h-[50vh] min-h-[280px] max-h-[420px] overflow-hidden">
        <Image
          src="/images/hero-bedroom.jpg"
          alt="SLPZY Collection"
          fill
          priority
          quality={85}
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/65 via-ink/20 to-ink/5" />

        {/* Text content */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-10 lg:px-12">
          <p className="text-[11px] font-medium uppercase tracking-widest text-paper/70">
            100% Certified TENCEL™ Lyocell
          </p>
          <h1 className="mt-1.5 text-3xl font-light tracking-tight text-paper sm:text-4xl lg:text-5xl">
            The <strong className="font-medium">Collection</strong>
          </h1>
          <p className="mt-1.5 text-sm font-light text-paper/70">
            {products.length} products · 5 colorways · 7 sizes
          </p>
        </div>
      </section>

      {/* ── Sticky Filter Bar ── */}
      <div className="sticky top-14 z-30 border-b border-line bg-paper/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4 px-6 py-3 lg:px-12">
          <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
            {FILTER_OPTIONS.map((opt) => {
              const active = filter === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setFilter(opt)}
                  className={cn(
                    "relative rounded-full px-3.5 py-1.5 text-[11px] font-medium tracking-wider transition-colors duration-200",
                    active
                      ? "text-paper"
                      : "text-soft hover:text-ink hover:bg-cream/50",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="activeFilterPill"
                      className="absolute inset-0 z-0 rounded-full bg-ink"
                      transition={{ type: "spring", stiffness: 450, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{opt}</span>
                </button>
              );
            })}
          </div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-soft">
            {filtered.length} {filtered.length === 1 ? "Product" : "Products"}
          </p>
        </div>
      </div>

      {/* ── Product Grid — 4 columns, smaller cards ── */}
      <section className="mx-auto max-w-[1440px] px-6 py-8 lg:px-12 lg:py-12">
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.p
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="py-20 text-center text-xl font-light text-soft"
            >
              Tidak ada produk dalam kategori ini.
            </motion.p>
          ) : (
            <motion.div
              key={filter}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6"
            >
              {filtered.map((product) => (
                <div key={product.id} id={product.id}>
                  <ProductCard product={product} linkToDetail />
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}
