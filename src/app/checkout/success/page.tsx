import { BadgeCheck, ArrowRight } from "lucide-react";
import Link from "next/link";
import { RevealGroup, ScrollStage } from "@/components/ScrollStage";

export const metadata = { title: "Order Confirmed" };

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;

  return (
    <ScrollStage variant="lift">
      <section className="flex min-h-screen items-center justify-center px-6 py-32">
        <RevealGroup className="w-full max-w-xl text-center">
          <div data-reveal className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sage/15">
            <BadgeCheck className="h-8 w-8 text-sage-deep" strokeWidth={1.5} />
          </div>

          <p className="mt-8 text-xs uppercase tracking-widest text-soft" data-reveal data-reveal-delay="100">
            Order confirmed
          </p>
          <h1 className="mt-5 text-[clamp(2.25rem,5vw,3.75rem)] font-light leading-[1.05]" data-reveal data-reveal-delay="180">
            Rest is on its <strong className="font-semibold text-sage-deep">way</strong>.
          </h1>

          {code && (
            <p className="mt-6 inline-block rounded-full border border-line bg-cream px-5 py-2 font-mono-soft text-sm font-semibold tracking-wide text-ink" data-reveal data-reveal-delay="240">
              {code}
            </p>
          )}

          <p className="mx-auto mt-6 max-w-md text-sm font-light leading-[1.85] text-ink/75" data-reveal data-reveal-delay="300">
            Terima kasih sudah berbelanja di SLPZY. Invoice dan detail pesanan sudah dikirim ke email kamu —
            cek inbox (atau folder spam) untuk instruksi pembayaran berikutnya.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-6" data-reveal data-reveal-delay="380">
            <Link
              href="/shop"
              className="group inline-flex items-center gap-3 rounded-full bg-ink px-7 py-4 text-xs font-medium tracking-wider text-paper transition-colors hover:bg-sage-deep"
            >
              Continue shopping
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-500 ease-smooth group-hover:translate-x-1" strokeWidth={1.6} />
            </Link>
            <Link href="/" className="border-b border-ink pb-1 text-xs font-medium tracking-wider">
              Back home
            </Link>
          </div>
        </RevealGroup>
      </section>
    </ScrollStage>
  );
}
