import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Product, ProductCategory } from "@/lib/products";

interface CategoryConfig {
  category: ProductCategory;
  label: string;
  description: string;
  href: string;
  fallbackImage: string;
}

const CATEGORIES_CONFIG: CategoryConfig[] = [
  {
    category: "Bedsheet",
    label: "Bedsheet",
    description: "Alas tidur sejuk & silky smooth",
    href: "/shop?c=Bedsheet",
    fallbackImage: "/images/cat-bedsheet.jpg",
  },
  {
    category: "Bedcover",
    label: "Bedcover",
    description: "Kehangatan lembut serat TENCEL™",
    href: "/shop?c=Bedcover",
    fallbackImage: "/images/cat-bedcover.jpg",
  },
  {
    category: "Pillow & Bolster",
    label: "Pillows & Bolster",
    description: "Sandaran kepala yang sempurna",
    href: "/shop?c=Pillow+%26+Bolster",
    fallbackImage: "/images/cat-pillow.jpg",
  },
  {
    category: "Bundle",
    label: "Bundle Sets",
    description: "Hemat hingga 20% satu set lengkap",
    href: "/shop?c=Bundle",
    fallbackImage: "/images/cat-bundle.jpg",
  },
];

interface Props {
  products?: Product[];
}

export function CategoryGrid({ products = [] }: Props) {
  const items = CATEGORIES_CONFIG.map((cat) => {
    // Find matching products in this category that have an uploaded image
    const matching = products.filter((p) => p.category === cat.category);
    const withImage = matching.find((p) => p.imageUrl || (p.images && p.images.length > 0));
    const activeImage = withImage?.imageUrl || withImage?.images?.[0] || null;

    return {
      ...cat,
      image: activeImage,
      hasImage: !!activeImage,
      count: matching.length,
    };
  }).filter((cat) => (products.length === 0 ? true : cat.count > 0));

  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        {/* Header */}
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-widest text-soft">
              Our Collections
            </p>
            <h2 className="mt-2 text-2xl font-light tracking-tight text-ink sm:text-3xl">
              Everything for your best sleep.
            </h2>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-xs font-medium tracking-wider text-ink transition-colors hover:text-sage-deep"
          >
            View all products <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {items.map((cat) => (
            <Link
              key={cat.label}
              href={cat.href}
              className="group relative overflow-hidden rounded-2xl bg-cream"
            >
              {/* Image / Branded Placeholder */}
              <div className="relative aspect-square w-full overflow-hidden">
                {cat.image ? (
                  <>
                    <Image
                      src={cat.image}
                      alt={cat.label}
                      fill
                      sizes="(max-width: 640px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                    {/* Subtle gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/15 to-transparent" />
                  </>
                ) : (
                  <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#8C8276] via-[#756C60] to-[#5A5247] p-6 transition-transform duration-500 ease-out group-hover:scale-[1.02]">
                    {/* Ambient radial highlight */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(255,255,255,0.16),transparent_65%)]" />

                    {/* Centered SLPZY Brand Mark */}
                    <div className="relative z-10 flex flex-col items-center justify-center text-center">
                      <img
                        src="/slpzy-logo.png"
                        alt="SLPZY"
                        className="h-10 w-auto opacity-85 brightness-0 invert drop-shadow-sm transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
                      />
                      <span className="mt-2 text-[9px] font-light uppercase tracking-[0.28em] text-paper/70">
                        100% Tencel™
                      </span>
                    </div>

                    {/* Bottom gradient for legible text */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                  </div>
                )}
              </div>

              {/* Label overlaid at bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-sm font-medium text-paper">{cat.label}</p>
                    <p className="mt-0.5 text-[11px] font-light text-paper/85 leading-snug">
                      {cat.description}
                    </p>
                  </div>
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-paper/20 backdrop-blur-sm transition-all group-hover:bg-paper/40">
                    <ArrowRight className="h-3.5 w-3.5 text-paper" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
