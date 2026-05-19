import Link from "next/link";
import { Logo } from "@/components/Logo";
import { NewsletterForm } from "@/components/NewsletterForm";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-cream">
      <div className="mx-auto max-w-[1480px] px-6 py-20 lg:px-12">
        <div className="grid gap-16 md:grid-cols-12">
          <div className="md:col-span-5 space-y-6">
            <Logo className="h-9" />
            <p className="text-sm tracking-widest text-soft">slpz·y /slēp ˈēzē/ · sleepeazy</p>
            <p className="max-w-md text-sm font-light leading-[1.85] text-ink/75">
              A state of pure comfort found in genuine TENCEL™ Lyocell fabric and superior craftsmanship.
              The art of upgrading your life through the luxury of deep, restorative rest.
            </p>
          </div>

          <div className="md:col-span-4">
            <p className="text-[10px] uppercase tracking-widest text-soft">Newsletter</p>
            <p className="mt-3 text-sm font-light text-ink/75">
              Drops, restock notes, and our quiet thoughts on rest.
            </p>
            <NewsletterForm />
          </div>

          <div className="md:col-span-3">
            <p className="text-[10px] uppercase tracking-widest text-soft">Explore</p>
            <ul className="mt-4 space-y-2.5 text-sm font-light">
              <li><Link href="/shop" className="hover:text-sage-deep">Shop</Link></li>
              <li><Link href="/about" className="hover:text-sage-deep">About</Link></li>
              <li><Link href="/reach" className="hover:text-sage-deep">Reach</Link></li>
              <li><a href="https://instagram.com" target="_blank" rel="noreferrer noopener" className="hover:text-sage-deep">Instagram ↗</a></li>
              <li><a href="https://wa.me/" target="_blank" rel="noreferrer noopener" className="hover:text-sage-deep">WhatsApp ↗</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-20 overflow-hidden">
          <Logo className="h-[clamp(6rem,18vw,15rem)] !w-auto" tone="text-ink/[0.08]" />
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-3 border-t border-line pt-6 md:flex-row md:items-center">
          <p className="text-[10px] uppercase tracking-widest text-soft">© {new Date().getFullYear()} SLPZY · All rights reserved. Slpzy 2026</p>
          <p className="text-[10px] uppercase tracking-widest text-soft">Powered by TENCEL™ Lyocell · Feels so right</p>
        </div>
      </div>
    </footer>
  );
}
