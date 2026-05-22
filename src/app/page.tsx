import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { MarqueeTicker } from "@/components/MarqueeTicker";
import { ProductCard } from "@/components/ProductCard";
import { RevealGroup, ScrollStage } from "@/components/ScrollStage";
import { COLOR_PALETTE, formatIDR } from "@/lib/products";
import { getCatalog } from "@/server/services/catalog";

const TICKER = [
  "100% Certified TENCEL™ Lyocell",
  "Free shipping above IDR 800K",
  "5 colorways · 7 sizes",
  "Hypoallergenic & gentle for sensitive skin",
  "Eco-friendly closed-loop process",
  "Maximize your rest experience",
];

// Always reflect the latest CMS catalogue edits
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await getCatalog();
  const featured = products.slice(0, 3);
  const bundles = products.filter((p) => p.category === "Bundle").slice(0, 2);

  return (
    <>
      {/* ============================= HERO ============================= */}
      <ScrollStage variant="lift">
        <section className="relative">
          <div className="mx-auto max-w-[1480px] px-6 pb-8 pt-1 lg:px-12 lg:pb-14 lg:pt-2">
            <RevealGroup>
              <div className="grid items-end gap-6 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
                <div className="space-y-6">

                  <h1 className="heading-mixed text-[clamp(2.75rem,6vw,5.5rem)]" data-reveal data-reveal-delay="180">
                    A state of pure <strong>comfort</strong>,<br />found in genuine{" "}
                    <strong className="text-sage-deep">TENCEL™</strong> fabric.
                  </h1>

                  <p className="max-w-md text-sm font-light leading-[1.85] text-ink/75" data-reveal data-reveal-delay="280">
                    slpz·y /slēp ˈēzē/ · sleepeazy — the art of upgrading your life through the luxury of
                    deep, restorative rest. Premium bedding, dijahit dengan TENCEL™ Lyocell asli.
                  </p>

                  <div className="flex flex-wrap items-center gap-8" data-reveal data-reveal-delay="380">
                    <Link
                      href="/shop"
                      className="group inline-flex items-center gap-3 rounded-full bg-ink px-7 py-4 text-xs font-medium tracking-wider text-paper transition-colors hover:bg-sage-deep"
                    >
                      Shop the Catalogue
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-500 ease-smooth group-hover:translate-x-1" strokeWidth={1.6} />
                    </Link>
                    <Link href="/about" className="inline-flex items-center gap-2 border-b border-ink pb-1 text-xs font-medium tracking-wider">
                      Our story <ArrowUpRight className="h-3 w-3" strokeWidth={1.6} />
                    </Link>
                  </div>

                  <div className="grid grid-cols-3 gap-6 border-t border-line pt-6" data-reveal data-reveal-delay="500">
                    {[
                      ["I", "Exceptional Softness"],
                      ["II", "Breathable & Cool"],
                      ["III", "Sustainable Choice"],
                    ].map(([n, label]) => (
                      <div key={n}>
                        <p className="text-xs font-semibold text-sage-deep tabular-nums">{n}.</p>
                        <p className="mt-1.5 text-[10px] uppercase tracking-widest text-soft">{label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="relative" data-reveal data-reveal-delay="240">
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[2.5rem] bg-cream lg:aspect-[4/5]">
                    <ComforterStack />

                    <div className="absolute right-6 top-6 flex items-center gap-3 rounded-full bg-paper/90 px-4 py-2.5 backdrop-blur-md">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-sage-deep" />
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-ink">SLPZY lyocell made</p>
                    </div>

                    <div className="absolute bottom-6 left-6 max-w-[260px] rounded-2xl border border-line/80 bg-paper/90 p-5 backdrop-blur-md">
                      <p className="mt-2 text-xl text-ink">
                        <span className="font-semibold">Double Sided</span>{" "}
                        <span className="font-light">Tencel Bedcover</span>
                      </p>
                      <div className="my-3 h-px bg-line" />
                    </div>

                    <div className="absolute right-6 bottom-6 flex flex-col gap-1.5 rounded-full bg-paper/85 p-2 backdrop-blur-md">
                      {Object.values(COLOR_PALETTE).map((c) => (
                        <span key={c.name} aria-label={c.name} title={c.name} className="h-4 w-4 rounded-full ring-1 ring-line" style={{ backgroundColor: c.hex }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </RevealGroup>
          </div>

          <div className="border-y border-line">
            <div className="mx-auto flex max-w-[1480px] items-center justify-between px-6 py-4 lg:px-12">
              <p className="text-[10px] uppercase tracking-widest text-soft">EDITION 01 · 2026</p>
              <p className="hidden text-[10px] uppercase tracking-widest text-soft md:block">slpz·y /slēp ˈēzē/ · sleepeazy</p>
              <p className="text-[10px] uppercase tracking-widest text-soft">↓ Scroll</p>
            </div>
          </div>
        </section>
      </ScrollStage>

      <MarqueeTicker items={TICKER} variant="dark" />

      {/* ============================= FEATURED PRODUCTS ============================= */}
      <ScrollStage variant="blanket">
        <section className="bg-paper py-14 lg:py-20">
          <div className="mx-auto max-w-[1480px] px-6 lg:px-12">
            <RevealGroup>
              <div className="mb-10 flex items-end justify-between gap-6 border-b border-line pb-6" data-reveal>
                <div>
                  <p className="text-xs uppercase tracking-widest text-soft">SLPZY · Catalogue</p>
                  <h2 className="mt-3 text-[clamp(1.75rem,4vw,3rem)] font-light leading-[1.05]">
                    The <strong className="font-semibold">essentials</strong> of restful sleep.
                  </h2>
                </div>
                <Link href="/shop" className="hidden items-center gap-2 border-b border-ink pb-1 text-xs font-medium tracking-wider md:inline-flex">
                  View all <ArrowRight className="h-3 w-3" strokeWidth={1.6} />
                </Link>
              </div>

              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-10" data-reveal data-reveal-delay="150">
                {featured.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </RevealGroup>
          </div>
        </section>
      </ScrollStage>

      {/* ============================= BUNDLES ============================= */}
      <ScrollStage variant="blanket">
        <section className="relative overflow-hidden bg-sage text-paper py-14 lg:py-20">
          <Logo className="absolute -left-8 bottom-8 h-48 opacity-[0.08]" tone="text-paper" />

          <div className="relative mx-auto max-w-[1480px] px-6 lg:px-12">
            <RevealGroup>
              <div className="mb-8 flex flex-wrap items-end justify-between gap-6" data-reveal>
                <div className="max-w-xl">
                  <p className="text-xs uppercase tracking-widest text-paper/70">Save with sets</p>
                  <h2 className="mt-3 text-[clamp(1.75rem,4vw,3rem)] font-light leading-[1.05]">
                    Recharge with <strong className="font-semibold">Bundle</strong> savings.
                  </h2>
                  <p className="mt-3 max-w-md text-sm font-light leading-[1.85] text-paper/80">
                    One complete set, ready to dress your bed. Choose Super for a single mattress or Ultra
                    for rotating spares.
                  </p>
                </div>
                <Link href="/shop" className="inline-flex items-center gap-2 rounded-full bg-paper px-6 py-3 text-xs font-medium tracking-wider text-ink transition-colors hover:bg-cream">
                  Compare bundles <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.6} />
                </Link>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {bundles.map((p, idx) => (
                  <div key={p.id} className="group relative overflow-hidden rounded-3xl bg-paper text-ink p-8 lg:p-10" data-reveal data-reveal-delay={`${120 + idx * 120}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-soft">{p.category}</p>
                        <h3 className="mt-2 text-3xl">
                          <strong className="font-semibold">{p.displayLead}</strong>{" "}
                          <span className="font-light">{p.displayTail}</span>
                        </h3>
                      </div>
                      {p.tag && (
                        <span className="rounded-full bg-sage px-3 py-1 text-[10px] font-semibold tracking-wider text-paper">{p.tag.toUpperCase()}</span>
                      )}
                    </div>

                    <p className="mt-4 text-sm font-light leading-relaxed text-ink/75">{p.subtitle}</p>

                    <ul className="mt-8 space-y-2.5 border-t border-line pt-6">
                      {p.inclusions?.map((inc) => (
                        <li key={inc} className="flex items-start gap-2.5 text-sm font-light">
                          <Check className="mt-1 h-3.5 w-3.5 shrink-0 text-sage-deep" strokeWidth={2} />
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-8 flex items-baseline justify-between">
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-soft">From</p>
                        <p className="mt-1 text-2xl font-semibold tabular-nums text-ink">{formatIDR(p.variants[p.variants.length - 1].price)}</p>
                      </div>
                      <Link href={`/shop#${p.id}`} className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-[11px] font-medium tracking-wider text-paper transition-colors hover:bg-sage-deep">
                        See sizes <ArrowRight className="h-3 w-3" strokeWidth={1.6} />
                      </Link>
                    </div>

                    <svg className="pointer-events-none absolute -bottom-8 -right-12 h-40 w-40 text-sage/15" viewBox="0 0 100 100" fill="currentColor" aria-hidden>
                      <path d="M0 80 Q 30 50 60 70 T 110 80 L 110 110 L 0 110 Z" />
                    </svg>
                  </div>
                ))}
              </div>
            </RevealGroup>
          </div>
        </section>
      </ScrollStage>

      {/* ============================= COMPARISON ============================= */}
      <ScrollStage variant="blanket">
        <section className="bg-cream py-14 lg:py-20">
          <div className="mx-auto max-w-[1480px] px-6 lg:px-12">
            <RevealGroup>
              <div className="mb-8 max-w-2xl" data-reveal>
                <p className="text-xs uppercase tracking-widest text-soft">Know the difference</p>
                <h2 className="mt-3 text-[clamp(1.75rem,4vw,3rem)] font-light leading-[1.05]">
                  <strong className="font-semibold">SLPZY PureTencel™</strong> vs.{" "}
                  <span className="font-light text-ink/60">"Micro Tencel" lookalikes</span>
                </h2>
              </div>

              <div className="grid gap-px overflow-hidden rounded-2xl bg-line lg:grid-cols-2" data-reveal data-reveal-delay="150">
                <CompareCard
                  title="SLPZY PureTencel™ Sheets"
                  positive
                  items={[
                    "100% Certified TENCEL™ Lyocell · Genuine Lenzing certified",
                    "Eco-friendly & biodegradable with low environmental impact",
                    "Silky-soft, breathable, naturally cooling",
                    "Excellent sweat-wicking & quick-drying",
                    "Hypoallergenic & gentle for sensitive skin",
                    "Long-lasting softness even after washes",
                  ]}
                />
                <CompareCard
                  title='"Micro Tencel" / Microtex Sheets'
                  items={[
                    "Synthetic polyester-based blend (not real TENCEL™)",
                    "No genuine certification — mass-market lookalike",
                    "Smooth but can feel plasticky & trap heat",
                    "Poor moisture control, may feel damp",
                    "Petroleum-based, non-biodegradable",
                    "May cause irritation, pill or fade quickly",
                  ]}
                />
              </div>
            </RevealGroup>
          </div>
        </section>
      </ScrollStage>


      {/* ============================= CLOSING ============================= */}
      <ScrollStage variant="blanket">
        <section className="bg-cream py-14 text-center lg:py-20">
          <div className="mx-auto max-w-[1480px] px-6 lg:px-12">
            <RevealGroup>
              <p className="text-xs uppercase tracking-widest text-soft" data-reveal>End of catalogue</p>
              <h2 className="mt-4 text-[clamp(2rem,5vw,4rem)] font-light leading-[1.05]" data-reveal data-reveal-delay="120">
                Start tomorrow with{" "}
                <strong className="font-semibold text-sage-deep">deeper rest</strong>.
              </h2>
              <Link
                href="/shop"
                className="mt-12 inline-flex items-center gap-3 rounded-full bg-ink px-8 py-4 text-xs font-medium tracking-wider text-paper transition-colors hover:bg-sage-deep"
                data-reveal
                data-reveal-delay="240"
              >
                Explore the catalogue <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.6} />
              </Link>
            </RevealGroup>
          </div>
        </section>
      </ScrollStage>
    </>
  );
}

function ComforterStack() {
  return (
    <div className="absolute inset-0">
      <div
        className="absolute left-[8%] right-[8%] top-[12%] h-[34%] rounded-[28px] shadow-card"
        style={{ background: "linear-gradient(160deg, #C5D0B6 0%, #9DAD8E 55%, #7C8E6C 100%)" }}
      >
        <div className="absolute inset-x-6 top-3 h-px bg-paper/30" />
        <div className="absolute inset-x-6 top-6 h-px bg-paper/20" />
      </div>
      <div
        className="absolute left-[4%] right-[4%] top-[46%] h-[18%] rounded-[24px]"
        style={{ background: "linear-gradient(160deg, #D4BD96 0%, #C9A876 100%)" }}
      />
      <div
        className="absolute left-[6%] right-[6%] bottom-[6%] h-[26%] rounded-[28px]"
        style={{ background: "linear-gradient(180deg, #A89679 0%, #8B7A60 100%)" }}
      />
      <span className="slpzy-mark absolute inset-0 flex items-center justify-center text-[clamp(6rem,18vw,14rem)] !text-ink/[0.05]">slpzy</span>
    </div>
  );
}

function CompareCard({ title, items, positive }: { title: string; items: string[]; positive?: boolean }) {
  return (
    <div className={`p-8 lg:p-12 ${positive ? "bg-paper" : "bg-cream"}`}>
      <p className={`text-[10px] uppercase tracking-widest ${positive ? "text-sage-deep" : "text-soft"}`}>
        {positive ? "What you get" : "Watch out for"}
      </p>
      <h3 className="mt-3 text-2xl font-medium">{title}</h3>
      <ul className="mt-8 space-y-4">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3 text-sm font-light leading-relaxed">
            <span className={`mt-1.5 inline-block h-2 w-2 shrink-0 rounded-full ${positive ? "bg-sage-deep" : "bg-ink/30"}`} />
            <span className={positive ? "text-ink/80" : "text-ink/55"}>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
