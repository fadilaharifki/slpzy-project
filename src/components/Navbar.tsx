"use client";
import { Menu, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { useCart } from "@/store/cartStore";
import { cn } from "@/lib/cn";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/reach", label: "Reach" },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const openCart = useCart((s) => s.open);
  const count = useCart((s) => s.items.reduce((sum, i) => sum + i.qty, 0));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-40 transition-all duration-500 ease-smooth",
          scrolled ? "border-b border-line bg-paper/85 backdrop-blur-lg" : "border-b border-transparent bg-transparent",
        )}
      >
        <div className="mx-auto flex h-20 max-w-[1480px] items-center justify-between px-6 lg:px-12">
          <Link href="/" aria-label="SLPZY home" className="flex items-center gap-3">
            <Logo className="h-24" />
          </Link>

          <nav className="hidden items-center gap-10 md:flex" aria-label="Main">
            {LINKS.map((l) => {
              const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "group relative text-sm font-medium transition-colors",
                    active ? "text-ink" : "text-soft hover:text-ink",
                  )}
                >
                  {l.label}
                  <span
                    className={cn(
                      "absolute -bottom-1.5 left-0 h-px w-full origin-left bg-sage-deep transition-transform duration-500 ease-smooth",
                      active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={openCart}
              aria-label={`Open bag — ${count} items`}
              className="group relative flex items-center gap-2 rounded-full border border-line bg-paper/60 px-4 py-2 text-xs font-medium text-ink transition-colors hover:border-sage hover:bg-paper"
            >
              <ShoppingBag className="h-3.5 w-3.5" strokeWidth={1.6} />
              <span>Bag</span>
              <span className="tabular-nums text-sage-deep">[{count.toString().padStart(2, "0")}]</span>
            </button>
            <button type="button" onClick={() => setMobileOpen(true)} aria-label="Open menu" className="md:hidden">
              <Menu className="h-5 w-5" strokeWidth={1.6} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div className={cn("fixed inset-0 z-50 md:hidden", mobileOpen ? "pointer-events-auto" : "pointer-events-none")} aria-hidden={!mobileOpen}>
        <div
          className={cn(
            "absolute inset-0 bg-ink/40 backdrop-blur-sm transition-opacity duration-500 ease-smooth",
            mobileOpen ? "opacity-100" : "opacity-0",
          )}
          onClick={() => setMobileOpen(false)}
        />
        <aside
          className={cn(
            "absolute inset-y-0 right-0 w-[78%] max-w-sm bg-paper p-8 shadow-soft transition-transform duration-500 ease-smooth",
            mobileOpen ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className="flex items-center justify-between">
            <Logo className="h-[84px]" />
            <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
              <X className="h-5 w-5" strokeWidth={1.6} />
            </button>
          </div>
          <nav className="mt-16 flex flex-col gap-7">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="text-3xl font-light text-ink hover:text-sage-deep">
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="mt-12 border-t border-line pt-6">
            <p className="text-xs tracking-wider text-soft">/slēp ˈēzē/ · sleepeazy</p>
          </div>
        </aside>
      </div>
    </>
  );
}
