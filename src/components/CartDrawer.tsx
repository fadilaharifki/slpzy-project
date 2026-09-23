"use client";
import Image from "next/image";
import { Check, Lock, Minus, Plus, Sparkles, Trash2, Truck, X } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useCart, type CartItem } from "@/store/cartStore";
import { formatIDR } from "@/lib/products";
import { cn } from "@/lib/cn";

const SHIPPING_THRESHOLD = 800_000;

function getItemImage(item: CartItem): string {
  if (item.imageUrl) return item.imageUrl;
  switch (item.category) {
    case "Bedcover":
      return "/images/cat-bedcover.jpg";
    case "Pillow & Bolster":
      return "/images/cat-pillow.jpg";
    case "Bundle":
      return "/images/cat-bundle.jpg";
    default:
      return "/images/cat-bedsheet.jpg";
  }
}

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
  const progressPercent = Math.min(100, (subtotal / SHIPPING_THRESHOLD) * 100);

  return (
    <div
      className={cn("fixed inset-0 z-50", isOpen ? "pointer-events-auto" : "pointer-events-none")}
      aria-hidden={!isOpen}
    >
      {/* Backdrop */}
      <div
        className={cn(
          "absolute inset-0 bg-ink/40 backdrop-blur-sm transition-opacity duration-500 ease-smooth",
          isOpen ? "opacity-100" : "opacity-0",
        )}
        onClick={close}
      />

      {/* Drawer Panel */}
      <aside
        role="dialog"
        aria-label="Shopping bag"
        className={cn(
          "absolute inset-y-0 right-0 flex w-full max-w-[460px] flex-col bg-paper shadow-2xl transition-transform duration-500 ease-smooth",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Header */}
        <header className="flex items-center justify-between border-b border-line px-4 py-3.5 sm:px-6 sm:py-4">
          <div className="flex items-baseline gap-2">
            <h2 className="text-base font-medium tracking-tight text-ink sm:text-lg">Your Bag</h2>
            <span className="text-[11px] font-normal text-soft sm:text-xs">
              ({items.reduce((sum, i) => sum + i.qty, 0)} {items.length === 1 && items[0]?.qty === 1 ? "item" : "items"})
            </span>
          </div>
          <button
            onClick={close}
            aria-label="Close bag"
            className="flex h-7 w-7 items-center justify-center rounded-full text-ink/70 transition-colors hover:bg-cream/80 hover:text-ink sm:h-8 sm:w-8"
          >
            <X className="h-4 w-4" strokeWidth={1.8} />
          </button>
        </header>

        {/* Free Shipping Progress Indicator */}
        {items.length > 0 && (
          <div className="border-b border-line bg-cream/40 px-4 py-2.5 sm:px-6 sm:py-3">
            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs">
              {freeShipping ? (
                <>
                  <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-sage-deep text-paper">
                    <Check className="h-2 w-2" strokeWidth={2.5} />
                  </span>
                  <span className="font-medium text-ink">
                    Free standard shipping unlocked! 🎉
                  </span>
                </>
              ) : (
                <>
                  <Truck className="h-3 w-3 text-soft shrink-0" strokeWidth={1.8} />
                  <span className="text-[10px] text-ink/80 sm:text-[11px]">
                    Add <strong className="font-semibold text-ink">{formatIDR(remaining)}</strong> more for free shipping
                  </span>
                </>
              )}
            </div>
            <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-line/80">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-700 ease-smooth",
                  freeShipping ? "bg-sage-deep" : "bg-ink",
                )}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Items List */}
        <div className="flex-1 overflow-y-auto px-4 py-3 sm:px-6 sm:py-5">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-cream/80 text-soft">
                <Truck className="h-6 w-6 opacity-40" strokeWidth={1.5} />
              </div>
              <p className="mt-2 text-base font-light text-ink">Your bag is empty</p>
              <p className="max-w-[220px] text-xs font-light leading-relaxed text-soft">
                Explore our pure 100% TENCEL™ Lyocell bedding collection.
              </p>
              <Link
                href="/shop"
                onClick={close}
                className="mt-3 inline-flex items-center justify-center rounded-full bg-ink px-5 py-2 text-xs font-medium tracking-wider text-paper transition-all hover:bg-sage-deep"
              >
                Explore Collection →
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-line/60">
              {items.map((item) => {
                const itemImg = getItemImage(item);
                return (
                  <li key={item.id} className="flex gap-3 py-3.5 first:pt-0 last:pb-0 sm:gap-4 sm:py-4">
                    {/* Thumbnail Image + Color Swatch Badge */}
                    <div className="relative h-[72px] w-[64px] shrink-0 overflow-hidden rounded-lg border border-line bg-cream/40 sm:h-20 sm:w-18">
                      <Image
                        src={itemImg}
                        alt={item.name}
                        fill
                        sizes="80px"
                        className="object-cover object-center"
                      />
                      {/* Floating Color Swatch Badge in corner */}
                      <span
                        className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full border border-paper shadow-sm"
                        style={{ backgroundColor: item.colorHex }}
                        title={item.colorName}
                      />
                    </div>

                    {/* Item Info */}
                    <div className="flex flex-1 flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-xs sm:text-sm font-medium leading-snug text-ink truncate pr-1">
                            {item.displayLead && <span className="font-semibold">{item.displayLead} </span>}
                            <span className="font-normal">{item.displayTail}</span>
                          </h3>
                          <button
                            onClick={() => remove(item.id)}
                            aria-label="Remove item"
                            className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-soft transition-colors hover:bg-cream hover:text-ink"
                            title="Remove"
                          >
                            <Trash2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" strokeWidth={1.6} />
                          </button>
                        </div>

                        {/* Specs & Color indicator */}
                        <div className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[10px] sm:text-[11px] text-soft">
                          <span className="font-medium text-ink/80">{item.variantLabel}</span>
                          {item.dimensions && (
                            <>
                              <span>·</span>
                              <span>{item.dimensions}</span>
                            </>
                          )}
                          <span>·</span>
                          <span className="inline-flex items-center gap-1">
                            <span
                              className="h-1.5 w-1.5 rounded-full border border-line shrink-0"
                              style={{ backgroundColor: item.colorHex }}
                            />
                            <span>{item.colorName}</span>
                          </span>
                        </div>
                      </div>

                      {/* Qty Controls & Line Price */}
                      <div className="mt-2 flex items-center justify-between pt-0.5">
                        <div className="flex items-center rounded-full border border-line bg-paper px-1.5 py-0.5 shadow-2xs">
                          <button
                            onClick={() => decrement(item.id)}
                            aria-label="Decrease quantity"
                            className="flex h-4 w-4 items-center justify-center text-ink/70 hover:text-ink transition-colors"
                          >
                            <Minus className="h-2.5 w-2.5" strokeWidth={1.8} />
                          </button>
                          <span className="min-w-[1.2rem] text-center text-[11px] font-semibold tabular-nums text-ink">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => increment(item.id)}
                            aria-label="Increase quantity"
                            className="flex h-4 w-4 items-center justify-center text-ink/70 hover:text-ink transition-colors"
                          >
                            <Plus className="h-2.5 w-2.5" strokeWidth={1.8} />
                          </button>
                        </div>

                        <span className="text-xs sm:text-sm font-semibold tracking-tight text-ink tabular-nums">
                          {formatIDR(item.price * item.qty)}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer & Checkout */}
        {items.length > 0 && (
          <footer
            className="border-t border-line bg-paper px-4 pb-4 pt-3.5 sm:px-6 sm:pb-6 sm:pt-4"
            style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
          >
            <div className="space-y-1">
              <div className="flex items-baseline justify-between text-[11px] text-soft sm:text-xs">
                <span>Shipping</span>
                <span className="font-medium text-ink">
                  {freeShipping ? "FREE" : "Calculated at checkout"}
                </span>
              </div>
              <div className="flex items-baseline justify-between pt-0.5">
                <span className="text-[11px] font-medium uppercase tracking-wider text-ink sm:text-xs">Subtotal</span>
                <span className="text-base font-semibold tracking-tight text-ink tabular-nums sm:text-lg">
                  {formatIDR(subtotal)}
                </span>
              </div>
            </div>

            <Link
              href="/checkout"
              onClick={close}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-ink py-3 text-xs font-medium tracking-wider text-paper transition-all hover:bg-sage-deep active:scale-[0.99]"
            >
              <Lock className="h-3.5 w-3.5" strokeWidth={1.8} />
              <span>Proceed to Checkout</span>
            </Link>

            {/* Micro Trust Indicators */}
            <div className="mt-2.5 flex items-center justify-center gap-3 text-[9px] uppercase tracking-wider text-soft sm:text-[10px]">
              <span className="inline-flex items-center gap-1">
                <Check className="h-2 w-2 text-sage-deep" strokeWidth={2.5} /> Genuine TENCEL™
              </span>
              <span>·</span>
              <span className="inline-flex items-center gap-1">
                <Lock className="h-2 w-2" /> 256-bit Secure
              </span>
              <span>·</span>
              <span>Easy Returns</span>
            </div>
          </footer>
        )}
      </aside>
    </div>
  );
}
