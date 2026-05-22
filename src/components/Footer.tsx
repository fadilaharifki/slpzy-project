import Link from "next/link";
import { Logo } from "@/components/Logo";
import { NewsletterForm } from "@/components/NewsletterForm";

const SHOP_LINKS = [
  { label: "Bedsheet", href: "/shop?c=Bedsheet" },
  { label: "Bedcover", href: "/shop?c=Bedcover" },
  { label: "Pillows & Bolster", href: "/shop?c=Pillow+%26+Bolster" },
  { label: "Bundles", href: "/shop?c=Bundle" },
  { label: "All products", href: "/shop" },
];

const EXPLORE_LINKS = [
  { label: "About SLPZY", href: "/about" },
  { label: "Reach Us", href: "/reach" },
  { label: "TENCEL™ Lyocell", href: "/about" },
];

const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "TikTok", href: "https://tiktok.com" },
  { label: "WhatsApp", href: "https://wa.me/" },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-cream">
      <div className="mx-auto max-w-[1500px] px-6 py-16 lg:px-10 lg:py-20">
        <div className="grid gap-12 md:grid-cols-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-4">
            <Logo className="h-9 w-auto" />
            <p className="mt-5 text-[11px] uppercase tracking-widest text-soft">slpz·y /slēp ˈēzē/ · sleepeazy</p>
            <p className="mt-4 max-w-xs text-sm font-light leading-[1.8] text-ink/70">
              Premium TENCEL™ Lyocell bedding. A state of pure comfort — the art of deep, restorative rest.
            </p>
          </div>

          {/* Shop */}
          <nav className="md:col-span-2" aria-label="Shop">
            <h3 className="text-[10px] font-semibold uppercase tracking-widest text-ink">Shop</h3>
            <ul className="mt-5 space-y-2.5">
              {SHOP_LINKS.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm font-light text-ink/65 transition-colors hover:text-sage-deep">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Explore */}
          <nav className="md:col-span-2" aria-label="Explore">
            <h3 className="text-[10px] font-semibold uppercase tracking-widest text-ink">Explore</h3>
            <ul className="mt-5 space-y-2.5">
              {EXPLORE_LINKS.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm font-light text-ink/65 transition-colors hover:text-sage-deep">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Newsletter */}
          <div className="md:col-span-4">
            <h3 className="text-[10px] font-semibold uppercase tracking-widest text-ink">Cozy updates</h3>
            <p className="mt-5 text-sm font-light leading-relaxed text-ink/70">
              Drops, restock notes, and our quiet thoughts on rest — plus a treat for your first order.
            </p>
            <NewsletterForm />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col gap-4 border-t border-line pt-6 md:flex-row md:items-center md:justify-between">
          <p className="text-[11px] text-soft">© {new Date().getFullYear()} SLPZY · All rights reserved.</p>

          <div className="flex items-center gap-5">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer noopener"
                className="text-[11px] font-medium uppercase tracking-wider text-ink/60 transition-colors hover:text-sage-deep"
              >
                {s.label}
              </a>
            ))}
          </div>

          <p className="text-[11px] font-medium uppercase tracking-wider text-soft">TENCEL™ · Feels so right</p>
        </div>
      </div>
    </footer>
  );
}
