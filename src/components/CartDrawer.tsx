"use client";
import { Minus, Plus, X } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/store/cartStore";
import { formatIDR } from "@/lib/products";
import { cn } from "@/lib/cn";

const SHIPPING_THRESHOLD = 800_000;

export function CartDrawer() {
  const isOpen = useCart((s) => s.isOpen);
  const close = useCart((s) => s.close);
  const items = useCart((s) => s.items);
  const increment = useCart((s) => s.increment);
  const decrement = useCart((s) => s.decrement);
  const remove = useCart((s) => s.remove);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", onKey);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen, close]);

  const remaining = Math.max(0, SHIPPING_THRESHOLD - subtotal);
  const freeShipping = remaining === 0 && items.length > 0;

  return (
    <div
      className={cn("fixed inset-0 z-50", isOpen ? "pointer-events-auto" : "pointer-events-none")}
      aria-hidden={!isOpen}
    >
      <div
        className={cn(
          "absolute inset-0 bg-ink/35 backdrop-blur-sm transition-opacity duration-500 ease-smooth",
          isOpen ? "opacity-100" : "opacity-0",
        )}
        onClick={close}
      />
      <aside
        role="dialog"
        aria-label="Shopping bag"
        className={cn(
          "absolute inset-y-0 right-0 flex w-full max-w-[440px] flex-col bg-paper shadow-soft transition-transform duration-500 ease-smooth",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <header className="flex items-center justify-between border-b border-line px-8 py-6">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-soft">Your</p>
            <h2 className="text-2xl font-medium text-ink">Bag</h2>
          </div>
          <button onClick={close} aria-label="Close bag" className="text-ink/70 transition-colors hover:text-ink">
            <X className="h-5 w-5" strokeWidth={1.6} />
          </button>
        </header>

        {items.length > 0 && (
          <div className="border-b border-line px-8 py-3">
            <p className="text-[10px] uppercase tracking-widest text-soft">
              {freeShipping ? "Free shipping unlocked" : `Add ${formatIDR(remaining)} for free shipping`}
            </p>
            <div className="mt-2 h-px w-full bg-line">
              <div
                className="h-px bg-sage-deep transition-[width] duration-700 ease-smooth"
                style={{ width: `${Math.min(100, (subtotal / SHIPPING_THRESHOLD) * 100)}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-8 py-6">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 py-20 text-center">
              <p className="text-2xl font-light italic text-ink/60">empty</p>
              <p className="text-[10px] uppercase tracking-widest text-soft">Belum ada barang dalam bag.</p>
              <Link href="/shop" onClick={close} className="mt-4 border-b border-ink pb-1 text-xs font-medium">
                Browse shop →
              </Link>
            </div>
          ) : (
            <ul className="space-y-6">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4">
                  <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl" style={{ backgroundColor: item.colorHex }}>
                    <span className="slpzy-mark absolute inset-0 flex items-center justify-center text-2xl !text-paper/30">
                      slpzy
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-base font-medium leading-tight text-ink">
                          {item.displayLead && <span className="font-semibold">{item.displayLead} </span>}
                          <span className="font-light">{item.displayTail}</span>
                        </p>
                        <p className="mt-1 text-[10px] uppercase tracking-wider text-soft">
                          {item.variantLabel} · {item.colorName}
                        </p>
                        {item.dimensions && <p className="text-[10px] tracking-wider text-soft">{item.dimensions}</p>}
                      </div>
                      <button
                        onClick={() => remove(item.id)}
                        aria-label="Remove"
                        className="text-[10px] uppercase tracking-wider text-soft underline-offset-4 hover:text-ink hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="flex items-center gap-3 rounded-full border border-line px-2 py-1">
                        <button onClick={() => decrement(item.id)} aria-label="Decrease">
                          <Minus className="h-3 w-3" strokeWidth={1.6} />
                        </button>
                        <span className="min-w-[1.25rem] text-center text-xs font-medium tabular-nums">{item.qty}</span>
                        <button onClick={() => increment(item.id)} aria-label="Increase">
                          <Plus className="h-3 w-3" strokeWidth={1.6} />
                        </button>
                      </div>
                      <span className="text-sm font-semibold text-ink tabular-nums">{formatIDR(item.price * item.qty)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <footer className="border-t border-line px-8 pb-8 pt-6">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-medium uppercase tracking-wider">Subtotal</span>
              <span className="text-lg font-semibold text-ink tabular-nums">{formatIDR(subtotal)}</span>
            </div>
            <p className="mt-1 text-[10px] uppercase tracking-wider text-soft">Ongkos kirim dihitung saat checkout.</p>
            <Link
              href="/checkout"
              onClick={close}
              className="mt-6 flex w-full items-center justify-center rounded-full bg-ink py-4 text-xs font-medium tracking-wider text-paper transition-colors hover:bg-sage-deep"
            >
              Proceed to Checkout
            </Link>
          </footer>
        )}
      </aside>
    </div>
  );
}
