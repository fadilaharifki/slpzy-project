import Image from "next/image";
import { ArrowRight, Check, Droplets, Feather, RefreshCw, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { MarqueeTicker } from "@/components/MarqueeTicker";
import { RevealGroup, ScrollStage } from "@/components/ScrollStage";
import { CategoryGrid } from "@/components/CategoryGrid";
import { formatIDR } from "@/lib/products";
import { getCatalog } from "@/server/services/catalog";
import { getActiveMediaBySection, getContentMap, getHeroImages } from "@/server/services/content";
import { cn } from "@/lib/cn";

const TICKER = [
  "100% Certified TENCEL™ Lyocell",
  "Free shipping on orders above IDR 800K",
  "5 muted colorways · 7 sizes",
  "Naturally cooling & moisture-wicking",
  "Gentle on sensitive skin",
  "Eco-friendly closed-loop production",
];

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [products, heroImages, featuredMedia, marqueeMedia, productMedia, contentMap] = await Promise.all([
    getCatalog(),
    getHeroImages(),
    getActiveMediaBySection("featured"),
    getActiveMediaBySection("marquee"),
    getActiveMediaBySection("product"),
    getContentMap(),
  ]);

  const bundles = products.filter((p) => p.category === "Bundle").slice(0, 2);

  const heroImage = heroImages[0] || "/images/hero-bedroom.jpg";
  const heroEyebrow = contentMap["hero.eyebrow"] || "SLPZY · 100% Certified TENCEL™ Lyocell";
  const heroTitle = contentMap["hero.title"] || "Experience the perfect balance of comfort & quality.";
  const heroBody = contentMap["hero.body"] || "Seprai dan bedcover mewah dari serat TENCEL™ Lyocell asli bersertifikat Lenzing — sejuk alami, silky-smooth, dan nyaman untuk iklim tropis.";
  const heroCta = contentMap["hero.ctaLabel"] || "Explore Products";

  const marqueeItems = contentMap["marquee.items"]
    ? contentMap["marquee.items"]
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean)
    : TICKER;
  const marqueeImages = marqueeMedia.map((m) => m.url);

  // Priority for "Ultra Premium Fabric" image:
  // 1. Specific image uploaded in CMS Content -> "Featured Banner (Ultra Premium Fabric)"
  // 2. Image uploaded in CMS Content -> "Product Gallery"
  // 3. Bedcover product image from catalog (or any real uploaded product image, e.g. Bedsheet)
  // 4. Fallback static photo
  const bedcoverProduct = products.find((p) => p.category === "Bedcover");
  const anyProductWithImage = products.find((p) => p.imageUrl || (p.images && p.images.length > 0));
  const featuredProductImage =
    featuredMedia[0]?.url ||
    productMedia[0]?.url ||
    bedcoverProduct?.imageUrl ||
    bedcoverProduct?.images?.[0] ||
    anyProductWithImage?.imageUrl ||
    anyProductWithImage?.images?.[0] ||
    null;

  const featuredEyebrow = contentMap["featured.eyebrow"] || "Ultra Premium Fabric";
  const featuredTitle = contentMap["featured.title"] || "Engineered for healthier sleep.";
  const featuredBody =
    contentMap["featured.body"] ||
    "Bukan bahan microtex atau imitasi polyester. TENCEL™ Lyocell diekstrak dari serat kayu alami melalui proses ramah lingkungan — kelembutan yang bertahan bertahun-tahun.";

  return (
    <div className="bg-paper text-ink">

      {/* ============================= HERO ============================= */}
      <section className="relative min-h-[88vh] lg:min-h-[90vh] flex items-end overflow-hidden">
        {/* Background foto kamar */}
        <Image
          src={heroImage}
          alt="SLPZY Premium TENCEL™ Bedding"
          fill
          priority
          quality={90}
          sizes="100vw"
          className="object-cover object-center"
        />

        {/* Gradient overlay — gelap di bawah untuk teks, transparan di atas */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/25 to-ink/5" />

        {/* Content */}
        <div className="relative z-10 w-full">
          <div className="mx-auto max-w-[1440px] px-6 pb-16 lg:px-12 lg:pb-20">
            <RevealGroup>
              {/* Label */}
              <div
                className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-widest text-paper/70 mb-5"
                data-reveal
              >
                <span className="h-1.5 w-1.5 rounded-full bg-paper/60" />
                {heroEyebrow}
              </div>

              {/* Headline */}
              <h1
                className="text-[clamp(2.2rem,5.5vw,4.5rem)] font-light leading-[1.08] tracking-tight text-paper max-w-3xl"
                data-reveal
                data-reveal-delay="100"
              >
                {heroTitle}
              </h1>

              <p
                className="mt-4 max-w-lg text-base font-light leading-relaxed text-paper/75"
                data-reveal
                data-reveal-delay="180"
              >
                {heroBody}
              </p>

              {/* CTAs */}
              <div
                className="mt-8 flex flex-wrap items-center gap-4"
                data-reveal
                data-reveal-delay="260"
              >
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2.5 rounded-full bg-paper px-7 py-3.5 text-xs font-medium tracking-wider text-ink transition-all hover:bg-cream"
                >
                  {heroCta}
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.8} />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2.5 rounded-full border border-paper/50 px-7 py-3.5 text-xs font-medium tracking-wider text-paper transition-all hover:border-paper hover:bg-paper/10"
                >
                  About SLPZY
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.8} />
                </Link>
              </div>

              {/* 3 trust points */}
              <div
                className="mt-10 flex flex-wrap gap-6"
                data-reveal
                data-reveal-delay="340"
              >
                {[
                  "Premium TENCEL™ Quality",
                  "Hypoallergenic & Skin-safe",
                  "Eco-Certified Process",
                ].map((text) => (
                  <div key={text} className="flex items-center gap-2">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full border border-paper/40">
                      <Check className="h-2.5 w-2.5 text-paper/80" strokeWidth={2.5} />
                    </div>
                    <span className="text-[11px] font-medium tracking-wide text-paper/80">
                      {text}
                    </span>
                  </div>
                ))}
              </div>
            </RevealGroup>
          </div>
        </div>
      </section>

      {/* ============================= TICKER ============================= */}
      <MarqueeTicker items={marqueeItems} images={marqueeImages} variant="light" />

      {/* ============================= CATEGORY GRID ============================= */}
      <ScrollStage>
        <CategoryGrid products={products} />
      </ScrollStage>

      {/* ============================= FEATURED PRODUCT BANNER (TENCEL) ============================= */}
      <ScrollStage>
        <section className="bg-ink py-16 lg:py-20">
          <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
            <RevealGroup>
              <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                {/* Left: Text */}
                <div data-reveal>
                  <p className="text-[11px] font-medium uppercase tracking-widest text-sage-deep">
                    {featuredEyebrow}
                  </p>
                  <h2 className="mt-4 text-[clamp(1.8rem,3.5vw,3rem)] font-light leading-tight tracking-tight text-paper">
                    {featuredTitle}
                  </h2>
                  <p className="mt-4 text-sm font-light leading-relaxed text-paper/65">
                    {featuredBody}
                  </p>

                  {/* 3 feature badges */}
                  <div className="mt-8 space-y-4">
                    {[
                      { icon: Feather, label: "Silky Soft", desc: "Serat mikro yang terasa lembut di kulit" },
                      { icon: Droplets, label: "Naturally Cooling", desc: "Moisture-wicking 50% lebih baik dari katun" },
                      { icon: RefreshCw, label: "Breathable Fabric", desc: "Closed-loop produksi, ramah lingkungan" },
                    ].map(({ icon: Icon, label, desc }) => (
                      <div key={label} className="flex items-start gap-4">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-paper/10">
                          <Icon className="h-4 w-4 text-sage-deep" strokeWidth={1.6} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-paper">{label}</p>
                          <p className="mt-0.5 text-xs font-light text-paper/60">{desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Link
                    href="/about"
                    className="mt-8 inline-flex items-center gap-2 rounded-full border border-paper/30 px-6 py-3 text-xs font-medium tracking-wider text-paper transition-colors hover:border-paper/60 hover:bg-paper/10"
                  >
                    Discover More <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.8} />
                  </Link>
                </div>

                {/* Right: Product image / Branded placeholder */}
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-[#8C8276] via-[#756C60] to-[#5A5247]" data-reveal data-reveal-delay="120">
                  {featuredProductImage ? (
                    <Image
                      src={featuredProductImage}
                      alt="TENCEL Lyocell Premium Bedcover"
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.16),transparent_65%)]" />
                      <img
                        src="/slpzy-logo.png"
                        alt="SLPZY"
                        className="relative z-10 h-12 w-auto opacity-85 brightness-0 invert drop-shadow-sm"
                      />
                      <span className="relative z-10 mt-2 text-[10px] font-light uppercase tracking-[0.28em] text-paper/75">
                        100% Certified Tencel™
                      </span>
                    </div>
                  )}
                  {/* Corner badge */}
                  <div className="absolute top-4 right-4 z-20 rounded-full bg-ink/70 px-3.5 py-1.5 text-[10px] font-medium tracking-widest text-paper/90 backdrop-blur-sm">
                    TENCEL™ CERTIFIED
                  </div>
                </div>
              </div>
            </RevealGroup>
          </div>
        </section>
      </ScrollStage>

      {/* ============================= THOUGHTFUL BUNDLES ============================= */}
      <ScrollStage>
        <section className="border-y border-line bg-cream/50 py-16 lg:py-24">
          <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
            <RevealGroup>
              <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end" data-reveal>
                <div className="max-w-lg">
                  <p className="text-[11px] font-medium uppercase tracking-widest text-soft">Curated Sets</p>
                  <h2 className="mt-2 text-2xl font-light tracking-tight text-ink sm:text-3xl">
                    Save with complete bundles.
                  </h2>
                  <p className="mt-2 text-sm font-light leading-relaxed text-ink/70">
                    Satu set lengkap seprai, bedcover, dan sarung bantal guling dengan harga hemat hingga 20%.
                  </p>
                </div>
                <Link
                  href="/shop?c=Bundle"
                  className="inline-flex items-center gap-2 rounded-full border border-ink/30 px-5 py-2.5 text-xs font-medium tracking-wider text-ink transition-colors hover:bg-ink hover:text-paper"
                >
                  Explore Bundles <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="grid gap-6 md:grid-cols-2" data-reveal data-reveal-delay="120">
                {bundles.map((bundle) => {
                  const startingPrice = bundle.variants[bundle.variants.length - 1]?.price ?? bundle.variants[0]?.price;
                  return (
                    <div
                      key={bundle.id}
                      className="flex flex-col justify-between rounded-3xl border border-line bg-paper p-8 lg:p-10 transition-shadow hover:shadow-sm"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-[10px] font-medium uppercase tracking-widest text-soft">
                            {bundle.category}
                          </span>
                          {bundle.tag && (
                            <span className="rounded-full bg-cream px-2.5 py-0.5 text-[9px] font-medium uppercase tracking-wider text-ink">
                              {bundle.tag}
                            </span>
                          )}
                        </div>

                        <h3 className="mt-3 text-2xl font-normal text-ink">{bundle.name}</h3>
                        <p className="mt-2 text-xs font-light text-ink/70">{bundle.subtitle}</p>

                        <div className="my-6 h-px bg-line/70" />

                        <ul className="space-y-2.5">
                          {bundle.inclusions?.map((inc) => (
                            <li key={inc} className="flex items-start gap-2.5 text-xs font-light text-ink/80">
                              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sage-deep" strokeWidth={2} />
                              <span>{inc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-8 flex items-baseline justify-between border-t border-line/70 pt-6">
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-soft">Starts from</p>
                          <p className="mt-1 text-xl font-medium tabular-nums text-ink">
                            {formatIDR(startingPrice)}
                          </p>
                        </div>
                        <Link
                          href={`/shop#${bundle.id}`}
                          className="inline-flex items-center gap-1.5 rounded-full bg-ink px-5 py-2.5 text-xs font-medium tracking-wider text-paper transition-colors hover:bg-sage-deep"
                        >
                          Select Size <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </RevealGroup>
          </div>
        </section>
      </ScrollStage>

      {/* ============================= PRODUCT GALLERY (FROM CMS) ============================= */}
      {productMedia.length > 0 && (
        <ScrollStage>
          <section className="border-t border-line py-16 lg:py-24 bg-cream/30">
            <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
              <RevealGroup>
                <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end" data-reveal>
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-widest text-soft">Visual Gallery</p>
                    <h2 className="mt-2 text-2xl font-light tracking-tight text-ink sm:text-3xl">
                      Crafted for restful spaces.
                    </h2>
                  </div>
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-1.5 text-xs font-medium tracking-wider text-ink transition-colors hover:text-sage-deep"
                  >
                    View all products <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
                <div
                  className={cn(
                    "grid gap-4 sm:gap-6",
                    productMedia.length === 1 && "grid-cols-1 max-w-2xl mx-auto",
                    productMedia.length === 2 && "grid-cols-1 sm:grid-cols-2",
                    productMedia.length === 3 && "grid-cols-1 sm:grid-cols-3",
                    productMedia.length >= 4 && "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
                  )}
                  data-reveal
                  data-reveal-delay="100"
                >
                  {productMedia.map((m) => (
                    <div
                      key={m.id}
                      className="group relative aspect-square overflow-hidden rounded-2xl bg-cream shadow-sm"
                    >
                      <Image
                        src={m.url}
                        alt={m.title || "SLPZY Product Gallery"}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      {m.title && (
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/75 via-ink/20 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                          <p className="text-xs font-medium text-paper">{m.title}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </RevealGroup>
            </div>
          </section>
        </ScrollStage>
      )}

      {/* ============================= CLOSING CTA ============================= */}
      <ScrollStage>
        <section className="border-t border-line bg-cream/40 py-20 text-center lg:py-28">
          <div className="mx-auto max-w-[800px] px-6">
            <RevealGroup>
              <p className="text-[11px] font-medium uppercase tracking-widest text-soft" data-reveal>
                Restorative Sleep
              </p>
              <h2
                className="mt-4 text-3xl font-light tracking-tight text-ink sm:text-5xl"
                data-reveal
                data-reveal-delay="100"
              >
                Wake up feeling{" "}
                <span className="font-normal text-sage-deep">restored</span>.
              </h2>
              <p
                className="mx-auto mt-4 max-w-md text-sm font-light leading-relaxed text-ink/70"
                data-reveal
                data-reveal-delay="160"
              >
                Tidur nyenyak adalah fondasi hari yang luar biasa. Temukan ukuran dan warna yang sempurna untuk kamar tidurmu.
              </p>
              <div className="mt-8" data-reveal data-reveal-delay="220">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 rounded-full bg-ink px-8 py-3.5 text-xs font-medium tracking-wider text-paper transition-colors hover:bg-sage-deep"
                >
                  Explore the Catalogue
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </RevealGroup>
          </div>
        </section>
      </ScrollStage>
    </div>
  );
}
