import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const CATEGORIES = [
  {
    label: "Bedsheet",
    description: "Alas tidur sejuk & silky smooth",
    href: "/shop?c=Bedsheet",
    image: "/images/cat-bedsheet.jpg",
  },
  {
    label: "Bedcover",
    description: "Kehangatan lembut serat TENCEL™",
    href: "/shop?c=Bedcover",
    image: "/images/cat-bedcover.jpg",
  },
  {
    label: "Pillows & Bolster",
    description: "Sandaran kepala yang sempurna",
    href: "/shop?c=Pillow+%26+Bolster",
    image: "/images/cat-pillow.jpg",
  },
  {
    label: "Bundle Sets",
    description: "Hemat hingga 20% satu set lengkap",
    href: "/shop?c=Bundle",
    image: "/images/cat-bundle.jpg",
  },
];

export function CategoryGrid() {
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
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.label}
              href={cat.href}
              className="group relative overflow-hidden rounded-2xl bg-cream"
            >
              {/* Image */}
              <div className="relative aspect-square w-full overflow-hidden">
                <Image
                  src={cat.image}
                  alt={cat.label}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent" />
              </div>

              {/* Label overlaid at bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-sm font-medium text-paper">{cat.label}</p>
                    <p className="mt-0.5 text-[11px] font-light text-paper/80 leading-snug">
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
