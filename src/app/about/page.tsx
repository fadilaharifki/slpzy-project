import type { Metadata } from "next";
import { Logo } from "@/components/Logo";
import { RevealGroup, ScrollStage } from "@/components/ScrollStage";
import { ValueProp } from "@/components/ValueProp";
import { VALUE_PROPS } from "@/lib/products";

export const metadata: Metadata = { title: "About" };

const VALUES = [
  {
    code: "I",
    title: "Genuine TENCEL™ Lyocell",
    body:
      "Bukan microtex atau imitasi. Setiap meter kain kami adalah TENCEL™ Lyocell asli yang bersertifikat Lenzing — silky-soft, bernapas, dan baik untuk kulit sensitif.",
  },
  {
    code: "II",
    title: "Superior craftsmanship",
    body:
      "Dijahit oleh skilled tailors dengan stitching premium quilted. Detail rapi, jatuhan utuh, dan hasil yang tetap halus bahkan setelah dicuci berkali-kali.",
  },
  {
    code: "III",
    title: "Conscious by design",
    body:
      "TENCEL™ diproduksi dari renewable wood sources melalui closed-loop process — biodegradable, low water impact. Kemewahan yang baik untuk planet.",
  },
];

export default function AboutPage() {
  return (
    <>
      <ScrollStage variant="lift">
        <section className="relative pt-14 lg:pt-20">
          <div className="mx-auto max-w-[1480px] px-6 lg:px-12">
            <RevealGroup>
              <p className="text-xs uppercase tracking-widest text-soft" data-reveal>
                <span className="mr-3 inline-block h-px w-8 align-middle bg-ink/40" />
                About SLPZY
              </p>
              <h1 className="mt-10 max-w-[15ch] text-[clamp(3rem,7vw,6.5rem)] font-light leading-[0.93]" data-reveal data-reveal-delay="120">
                We believe in the <strong className="font-semibold text-sage-deep">art of rest</strong>.
              </h1>
              <p className="mt-8 max-w-xl text-base font-light leading-[1.85] text-ink/75" data-reveal data-reveal-delay="240">
                slpz·y /slēp ˈēzē/ · sleepeazy — a state of pure comfort found in genuine TENCEL™ Lyocell
                fabric and superior craftsmanship.
              </p>
            </RevealGroup>
          </div>
        </section>
      </ScrollStage>

      <ScrollStage variant="parallax">
        <section className="mx-auto max-w-[1480px] px-6 py-24 lg:px-12 lg:py-32">
          <RevealGroup>
            <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
              <div className="lg:col-span-7" data-reveal>
                <p className="text-xs uppercase tracking-widest text-soft">Letter from the studio</p>
                <div className="mt-6 h-px bg-line" />
                <div className="mt-10 space-y-6 text-base font-light leading-[1.85] text-ink/85">
                  <p>
                    SLPZY dimulai dari satu keyakinan sederhana:{" "}
                    <strong className="font-semibold text-sage-deep">how you start your day depends entirely on how you ended the night before</strong>.
                  </p>
                  <p>
                    Banyak sprei di pasar Indonesia hanya tampak mewah — di-marketing sebagai "Tencel" padahal
                    sebenarnya hanya polyester microtex. Lembut di sentuhan pertama, tapi cepat panas, mudah pill,
                    dan jauh dari yang dijanjikan.
                  </p>
                  <p>
                    Kami menolak kompromi itu. Setiap produk SLPZY menggunakan{" "}
                    <strong className="font-semibold">100% Certified TENCEL™ Lyocell</strong> langsung dari
                    Lenzing — biodegradable, sejuk secara alami, dan benar-benar lembut untuk kulit sensitif.
                  </p>
                  <p>
                    Lalu kami menyerahkannya pada skilled tailors yang menjahit dengan detail premium quilted —
                    hasil yang tetap halus setelah ratusan kali cuci.
                  </p>
                  <p>
                    Itulah SLPZY: <strong className="font-semibold">true comfort meets conscious luxury</strong>.
                    Thank you for trusting SLPZY to be part of your home.
                  </p>
                  <p className="pt-4 text-[10px] uppercase tracking-widest text-soft">— The SLPZY Team, Indonesia</p>
                </div>
              </div>

              <div className="lg:col-span-5" data-reveal data-reveal-delay="150">
                <div className="relative overflow-hidden rounded-3xl bg-ink2 p-10 text-paper">
                  <Logo className="absolute -right-4 -top-4 h-32 opacity-[0.08]" tone="text-paper" />
                  <p className="relative text-xs uppercase tracking-widest text-paper/70">Three commitments</p>
                  <ul className="relative mt-10 space-y-9">
                    {VALUES.map((v) => (
                      <li key={v.code}>
                        <div className="flex items-baseline gap-4">
                          <span className="text-xs font-semibold tabular-nums text-sage">{v.code}.</span>
                          <span className="text-2xl font-medium">{v.title}</span>
                        </div>
                        <p className="mt-3 pl-7 text-sm font-light leading-relaxed text-paper/75">{v.body}</p>
                        <div className="mt-7 h-px bg-paper/15" />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </RevealGroup>
        </section>
      </ScrollStage>

      {/* ============================= BRAND PROMISE ============================= */}
      <ScrollStage variant="blanket">
        <section className="bg-paper py-16 lg:py-24">
          <div className="mx-auto max-w-[1480px] px-6 lg:px-12">
            <RevealGroup>
              <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
                <div data-reveal>
                  <p className="text-xs uppercase tracking-widest text-soft">Brand promise</p>
                  <h2 className="mt-3 text-[clamp(1.75rem,4vw,3rem)] font-light leading-[1.08]">
                    <strong className="font-semibold">True comfort</strong> meets{" "}
                    <span className="text-sage-deep">conscious luxury</span>.
                  </h2>
                  <p className="mt-5 max-w-md text-sm font-light leading-[1.85] text-ink/75">
                    We believe that how you start your day depends entirely on how you ended the night before.
                    Thank you for trusting SLPZY to be part of your home — this isn&apos;t just making your bed.
                    It&apos;s a commitment to waking up refreshed, happier, and ready for whatever comes next.
                  </p>
                  <div className="mt-10 flex flex-wrap items-center gap-6 text-[10px] uppercase tracking-widest text-soft">
                    <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-sage-deep" />Certified Lenzing</span>
                    <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-khaki" />Skilled tailors</span>
                    <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-ink" />Closed-loop process</span>
                  </div>
                </div>

                <div className="relative aspect-[5/6] overflow-hidden rounded-[2.5rem] bg-cream" data-reveal data-reveal-delay="150">
                  <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, #EEE9DF 0%, #C9A876 80%, #A89679 100%)" }} />
                  <Logo className="absolute right-6 top-6 h-12" tone="text-paper/90" />
                  <div className="absolute bottom-6 left-6 max-w-[260px] rounded-2xl bg-paper/95 p-5 backdrop-blur-md">
                    <p className="text-[10px] uppercase tracking-widest text-soft">Founders&apos; note</p>
                    <p className="mt-2 text-sm font-light leading-relaxed text-ink">
                      &ldquo;Recharge your energy with ultra comfort sleep like never before with SLPZY.&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            </RevealGroup>
          </div>
        </section>
      </ScrollStage>

      {/* SLPZY Xperience callback */}
      <ScrollStage variant="curtain" curtainColor="#F8F5F0">
        <section className="bg-cream py-24 lg:py-32">
          <div className="mx-auto max-w-[1480px] px-6 lg:px-12">
            <RevealGroup>
              <div className="mb-14 flex items-end justify-between gap-6" data-reveal>
                <div>
                  <p className="text-xs uppercase tracking-widest text-soft">SLPZY Xperience</p>
                  <h2 className="mt-4 text-[clamp(2rem,4.5vw,3.75rem)] font-light leading-[1.05]">
                    What you get with every <strong className="font-semibold">SLPZY</strong>.
                  </h2>
                </div>
                <p className="hidden text-sm font-medium md:block">TENCEL™ · Feels so right</p>
              </div>
              <div className="grid gap-12 md:grid-cols-3" data-reveal data-reveal-delay="150">
                {VALUE_PROPS.map((vp) => (
                  <ValueProp key={vp.title} icon={vp.icon} title={vp.title} body={vp.body} tone="light" />
                ))}
              </div>
            </RevealGroup>
          </div>
        </section>
      </ScrollStage>

      <ScrollStage variant="scale">
        <section className="overflow-hidden bg-paper py-20 lg:py-28">
          <div className="mx-auto max-w-[1480px] px-6 lg:px-12">
            <div className="overflow-hidden">
              <Logo className="h-[clamp(5rem,18vw,15rem)] !w-auto" tone="text-ink/[0.08]" />
            </div>
          </div>
        </section>
      </ScrollStage>
    </>
  );
}
