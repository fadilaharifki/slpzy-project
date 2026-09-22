import type { Metadata } from "next";
import Image from "next/image";
import { Logo } from "@/components/Logo";
import { RevealGroup, ScrollStage } from "@/components/ScrollStage";
import { ValueProp } from "@/components/ValueProp";
import { VALUE_PROPS } from "@/lib/products";

export const metadata: Metadata = {
  title: "About Our Craft",
  description:
    "Learn about SLPZY's mission — 100% Certified TENCEL™ Lyocell, superior Indonesian craftsmanship, and conscious closed-loop production.",
  openGraph: {
    title: "About SLPZY · The Art of Rest",
    description:
      "slpz·y /slēp ˈēzē/ — A state of pure comfort found in genuine TENCEL™ Lyocell and precise Indonesian tailoring.",
    images: [
      {
        url: "/images/cat-bundle.jpg",
        width: 1200,
        height: 630,
        alt: "SLPZY Studio and Craft",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About SLPZY · The Art of Rest",
    description:
      "100% Certified TENCEL™ Lyocell bedding, consciously crafted in Indonesia.",
    images: ["/images/cat-bundle.jpg"],
  },
};

const VALUES = [
  {
    code: "01",
    title: "Genuine TENCEL™ Lyocell",
    body:
      "Bukan microtex atau tiruan polyester. Setiap meter kain kami adalah TENCEL™ Lyocell asli yang bersertifikat resmi dari Lenzing — silky-soft, bernapas, dan ramah untuk kulit sensitif.",
  },
  {
    code: "02",
    title: "Superior Craftsmanship",
    body:
      "Dijahit oleh penjahit berpengalaman dengan kerapatan jahitan presisi. Hasil akhir yang rapi, jatuhan kain yang mewah, dan kelembutan yang bertahan setelah dicuci berulang kali.",
  },
  {
    code: "03",
    title: "Conscious by Design",
    body:
      "TENCEL™ diproduksi dari serat kayu terbarukan melalui proses closed-loop ramah lingkungan — biodegradable dengan dampak air dan energi yang minimal.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-paper text-ink">
      {/* Hero Banner */}
      <section className="relative h-[45vh] min-h-[260px] max-h-[380px] overflow-hidden">
        <Image
          src="/images/cat-bundle.jpg"
          alt="SLPZY Studio and Craft"
          fill
          priority
          quality={85}
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/30 to-ink/10" />

        <div className="absolute bottom-0 left-0 right-0 px-6 pb-10 lg:px-12">
          <div className="mx-auto max-w-[1440px]">
            <p className="text-[11px] font-medium uppercase tracking-widest text-paper/70">
              About SLPZY
            </p>
            <h1 className="mt-1.5 text-3xl font-light tracking-tight text-paper sm:text-5xl">
              The Art of <strong className="font-medium">Rest</strong>
            </h1>
          </div>
        </div>
      </section>

      {/* Editorial Intro */}
      <ScrollStage>
        <section className="pt-12 pb-14 lg:pt-16 lg:pb-20">
          <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
            <RevealGroup>
              <h2 className="max-w-3xl text-3xl font-light leading-tight tracking-tight sm:text-5xl" data-reveal>
                We believe how you wake up begins with <span className="font-normal text-sage-deep">how you rest</span>.
              </h2>
              <p className="mt-4 max-w-xl text-base font-light leading-relaxed text-ink/70" data-reveal data-reveal-delay="100">
                slpz·y /slēp ˈēzē/ · sleepeazy. Kemurnian kenyamanan yang ditemukan pada serat TENCEL™ Lyocell asli dan ketelitian pengerjaan.
              </p>
            </RevealGroup>
          </div>
        </section>
      </ScrollStage>

      {/* Letter & Commitments */}
      <ScrollStage>
        <section className="border-t border-line py-20 lg:py-28">
          <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
            <RevealGroup>
              <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
                {/* Letter */}
                <div className="space-y-6 text-sm font-light leading-relaxed text-ink/80 lg:col-span-7" data-reveal>
                  <p className="text-[11px] font-medium uppercase tracking-widest text-soft">
                    Letter from the studio
                  </p>
                  <div className="h-px bg-line/80" />
                  <p className="text-base text-ink font-normal leading-relaxed">
                    SLPZY dimulai dari satu keyakinan sederhana: bagaimana caramu memulai hari ditentukan dari caramu menutup malam sebelumnya.
                  </p>
                  <p>
                    Banyak seprai di pasar Indonesia hanya tampak mewah — dipromosikan sebagai &quot;Tencel&quot; padahal
                    sebenarnya hanya serat sintetis polyester microtex. Terasa lembut di awal, tetapi mudah panas, memerangkap keringat,
                    dan cepat rusak.
                  </p>
                  <p>
                    Kami memilih jalur berbeda tanpa kompromi. Setiap produk SLPZY menggunakan 100% Certified TENCEL™ Lyocell asli
                    dari Lenzing — sejuk secara alami, hipoalergenik, dan baik untuk kulit sensitif.
                  </p>
                  <p>
                    Kain tersebut kemudian dijahit dengan ketelitian tinggi oleh penjahit terampil di Indonesia, menghasilkan bedding yang
                    dapat diandalkan malam demi malam.
                  </p>
                  <p className="pt-2 text-[11px] uppercase tracking-wider text-soft">
                    — The SLPZY Team, Indonesia
                  </p>
                </div>

                {/* Commitments Card (Warm, Light, Clean) */}
                <div className="lg:col-span-5" data-reveal data-reveal-delay="120">
                  <div className="rounded-3xl border border-line bg-cream/60 p-8 sm:p-10">
                    <p className="text-[11px] font-medium uppercase tracking-widest text-soft">
                      Three Commitments
                    </p>
                    <ul className="mt-8 space-y-8">
                      {VALUES.map((v) => (
                        <li key={v.code} className="border-b border-line/70 pb-6 last:border-0 last:pb-0">
                          <div className="flex items-baseline gap-3">
                            <span className="text-xs font-semibold text-sage-deep">{v.code}.</span>
                            <span className="text-lg font-normal text-ink">{v.title}</span>
                          </div>
                          <p className="mt-2 text-xs font-light leading-relaxed text-ink/70">{v.body}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </RevealGroup>
          </div>
        </section>
      </ScrollStage>

      {/* Value Props Strip */}
      <ScrollStage>
        <section className="border-t border-line bg-cream/30 py-20 lg:py-28">
          <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
            <RevealGroup>
              <div className="mb-12 max-w-lg" data-reveal>
                <p className="text-[11px] font-medium uppercase tracking-widest text-soft">SLPZY Standards</p>
                <h2 className="mt-2 text-2xl font-light tracking-tight text-ink sm:text-3xl">
                  What you get with every set.
                </h2>
              </div>
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3" data-reveal data-reveal-delay="100">
                {VALUE_PROPS.map((vp) => (
                  <ValueProp key={vp.title} icon={vp.icon} title={vp.title} body={vp.body} tone="light" />
                ))}
              </div>
            </RevealGroup>
          </div>
        </section>
      </ScrollStage>
    </div>
  );
}
