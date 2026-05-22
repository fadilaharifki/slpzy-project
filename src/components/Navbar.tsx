"use client";
import { ChevronDown, Home, Info, Search, ShoppingBag, Zap } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { SearchOverlay } from "@/components/SearchOverlay";
import { useCart } from "@/store/cartStore";
import { cn } from "@/lib/cn";

const CATEGORIES = [
  { label: "Bedsheet", href: "/shop?c=Bedsheet" },
  { label: "Bedcover", href: "/shop?c=Bedcover" },
  { label: "Pillows & Bolster", href: "/shop?c=Pillow+%26+Bolster" },
  { label: "Bundles", href: "/shop?c=Bundle" },
];

const PAGES = [
  { label: "About", href: "/about" },
  { label: "Reach", href: "/reach" },
];

const BOTTOM_TABS = [
  { label: "Home", href: "/", icon: Home },
  { label: "Shop", href: "/shop", icon: ShoppingBag },
  { label: "About", href: "/about", icon: Info },
  { label: "Reach", href: "/reach", icon: Zap },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const openCart = useCart((s) => s.open);
  const count = useCart((s) => s.items.reduce((sum, i) => sum + i.qty, 0));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setShopOpen(false);
  }, [pathname]);

  return (
    <>
      {/* ── Desktop / Tablet Navbar ── */}
      <header
        className={cn(
          "sticky top-0 z-50 bg-paper transition-shadow duration-300",
          scrolled
            ? "border-b border-line shadow-[0_1px_16px_-10px_rgba(63,63,63,0.35)]"
            : "border-b border-line/60",
        )}
      >
        <div className="mx-auto flex h-14 max-w-[1500px] items-center px-5 lg:px-10">
          {/* Logo — left */}
          <Link href="/" aria-label="SLPZY home" className="shrink-0 z-10">
            <Logo className="h-10 w-auto" />
          </Link>

          {/* Nav — center (desktop only), positioned absolute to stay truly centered */}
          <nav className="absolute inset-x-0 hidden items-center justify-center gap-7 lg:flex" aria-label="Main">
            {/* Shop dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setShopOpen(true)}
              onMouseLeave={() => setShopOpen(false)}
            >
              <Link
                href="/shop"
                className={cn(
                  "flex items-center gap-1 py-4 text-[13px] font-medium tracking-wide transition-colors",
                  pathname.startsWith("/shop") ? "text-ink" : "text-ink/55 hover:text-ink",
                )}
              >
                Shop
                <ChevronDown
                  className={cn("h-3 w-3 transition-transform duration-300", shopOpen && "rotate-180")}
                  strokeWidth={1.8}
                />
              </Link>

              <div
                className={cn(
                  "absolute left-1/2 top-full w-56 -translate-x-1/2 origin-top overflow-hidden rounded-xl border border-line bg-paper shadow-card transition-all duration-200 ease-smooth",
                  shopOpen
                    ? "pointer-events-auto translate-y-0 opacity-100"
                    : "pointer-events-none -translate-y-1 opacity-0",
                )}
              >
                <div className="p-1.5">
                  {CATEGORIES.map((c) => (
                    <Link
                      key={c.label}
                      href={c.href}
                      className="block rounded-lg px-3 py-2 text-[12px] text-ink/70 transition-colors hover:bg-cream hover:text-ink"
                    >
                      {c.label}
                    </Link>
                  ))}
                </div>
                <Link
                  href="/shop"
                  className="block border-t border-line bg-cream/60 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-widest text-sage-deep hover:bg-cream"
                >
                  View all products →
                </Link>
              </div>
            </div>

            {PAGES.map((l) => {
              const active = pathname.startsWith(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "py-4 text-[13px] font-medium tracking-wide transition-colors",
                    active ? "text-ink" : "text-ink/55 hover:text-ink",
                  )}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions — right */}
          <div className="ml-auto flex items-center gap-1">
            {/* Search (desktop) */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="hidden rounded-full p-2 text-ink/60 transition-colors hover:bg-cream hover:text-ink lg:block"
            >
              <Search className="h-[16px] w-[16px]" strokeWidth={1.6} />
            </button>

            {/* Bag (desktop) */}
            <button
              type="button"
              onClick={openCart}
              aria-label={`Bag — ${count} items`}
              className="relative hidden rounded-full p-2 text-ink/60 transition-colors hover:bg-cream hover:text-ink lg:block"
            >
              <ShoppingBag className="h-[16px] w-[16px]" strokeWidth={1.6} />
              {count > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-sage-deep px-0.5 text-[8px] font-bold tabular-nums text-paper">
                  {count}
                </span>
              )}
            </button>

            {/* Mobile — search + bag */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="rounded-full p-2 text-ink/60 transition-colors hover:bg-cream hover:text-ink lg:hidden"
            >
              <Search className="h-[16px] w-[16px]" strokeWidth={1.6} />
            </button>
            <button
              type="button"
              onClick={openCart}
              aria-label={`Bag — ${count} items`}
              className="relative rounded-full p-2 text-ink/60 transition-colors hover:bg-cream hover:text-ink lg:hidden"
            >
              <ShoppingBag className="h-[16px] w-[16px]" strokeWidth={1.6} />
              {count > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-sage-deep px-0.5 text-[8px] font-bold tabular-nums text-paper">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Bottom Tab Bar ── */}
      <nav
        aria-label="Mobile navigation"
        className="fixed bottom-0 inset-x-0 z-50 flex items-stretch border-t border-line bg-paper/95 backdrop-blur-md lg:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {BOTTOM_TABS.map(({ label, href, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-1 py-2.5 transition-colors",
                active ? "text-ink" : "text-ink/40",
              )}
            >
              <Icon className="h-[18px] w-[18px]" strokeWidth={active ? 2 : 1.5} />
              <span className={cn("text-[9px] font-medium tracking-wider uppercase", active ? "opacity-100" : "opacity-60")}>
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Spacer so content isn't hidden behind bottom tab on mobile */}
      <div className="h-[60px] lg:hidden" aria-hidden />

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
