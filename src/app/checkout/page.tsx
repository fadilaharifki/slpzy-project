"use client";
import { ArrowRight, BadgeCheck, Check, Minus, Plus, Tag, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { RevealGroup, ScrollStage } from "@/components/ScrollStage";
import { createOrder } from "@/app/actions/checkout";
import { formatIDR } from "@/lib/products";
import { autoVouchers, computeTotals, findVoucher, type Voucher } from "@/lib/voucher";
import { useCart } from "@/store/cartStore";
import { cn } from "@/lib/cn";

const SHIPPING_THRESHOLD = 800_000;
const EXPRESS_FEE = 45_000;
const REGULAR_FEE = 22_000;

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCart((s) => s.items);
  const increment = useCart((s) => s.increment);
  const decrement = useCart((s) => s.decrement);
  const clear = useCart((s) => s.clear);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const [shipping, setShipping] = useState<"regular" | "express">("regular");
  const [payment, setPayment] = useState<"bank" | "qris">("bank");
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Vouchers ───────────────────────────────────────────────────────────
  // Auto vouchers are always on. Extra codes can be redeemed via the input.
  const auto = useMemo(() => autoVouchers(), []);
  const [extra, setExtra] = useState<Voucher[]>([]);
  const [code, setCode] = useState("");
  const [voucherMsg, setVoucherMsg] = useState<string | null>(null);

  const isFreeRegular = subtotal >= SHIPPING_THRESHOLD;
  const shippingCost = shipping === "express" ? EXPRESS_FEE : isFreeRegular ? 0 : REGULAR_FEE;

  const allVouchers = useMemo(() => [...auto, ...extra], [auto, extra]);
  const totals = useMemo(
    () => computeTotals(subtotal, shippingCost, allVouchers),
    [subtotal, shippingCost, allVouchers],
  );

  function redeem() {
    setVoucherMsg(null);
    const clean = code.trim();
    if (!clean) return;
    const found = findVoucher(clean);
    if (!found) {
      setVoucherMsg("Kode voucher tidak ditemukan.");
      return;
    }
    if (found.auto || allVouchers.some((v) => v.code === found.code)) {
      setVoucherMsg("Voucher ini sudah terpasang.");
      return;
    }
    setExtra((prev) => [...prev, found]);
    setCode("");
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (items.length === 0) return;
    setError(null);
    setPlacing(true);

    const fd = new FormData(e.currentTarget);
    const res = await createOrder({
      customer: {
        name: String(fd.get("name") || ""),
        email: String(fd.get("email") || ""),
        phone: String(fd.get("phone") || ""),
        address: String(fd.get("address") || ""),
        city: String(fd.get("city") || ""),
        province: String(fd.get("province") || ""),
        postalCode: String(fd.get("postal") || ""),
      },
      items: items.map((i) => ({
        productName: `${i.displayLead ? i.displayLead + " " : ""}${i.displayTail}`,
        variantLabel: i.variantLabel,
        dimensions: i.dimensions,
        colorName: i.colorName,
        colorHex: i.colorHex,
        unitPrice: i.price,
        qty: i.qty,
      })),
      shippingMethod: shipping,
      shippingCost,
      paymentMethod: payment,
      voucherCodes: allVouchers.map((v) => v.code),
    });

    setPlacing(false);
    if (!res.ok) {
      setError(res.error ?? "Gagal memproses order. Coba lagi.");
      return;
    }
    clear();
    router.push(`/checkout/success?code=${encodeURIComponent(res.code!)}`);
  }

  return (
    <>
      <ScrollStage variant="lift">
        <section className="pt-14 lg:pt-20">
          <div className="mx-auto max-w-[1480px] px-6 lg:px-12">
            <RevealGroup>
              <p className="text-xs uppercase tracking-widest text-soft" data-reveal>
                <span className="mr-3 inline-block h-px w-8 align-middle bg-ink/40" />
                Checkout · slpz·y /slēp ˈēzē/
              </p>
              <h1 className="mt-8 text-[clamp(2.5rem,6vw,5rem)] font-light leading-[0.95]" data-reveal data-reveal-delay="120">
                Almost <strong className="font-semibold text-sage-deep">rested</strong>.
              </h1>
            </RevealGroup>
          </div>
        </section>
      </ScrollStage>

      <ScrollStage variant="parallax">
        <div className="mx-auto mt-16 grid max-w-[1480px] gap-16 px-6 pb-24 lg:grid-cols-12 lg:gap-20 lg:px-12 lg:pb-32">
          <form onSubmit={onSubmit} className="space-y-14 lg:col-span-7">
            <Step n="01" title="Contact">
              <Row two>
                <Field label="Full name" name="name" required />
                <Field label="Phone (WhatsApp)" name="phone" type="tel" required />
              </Row>
              <Field label="Email" name="email" type="email" required />
            </Step>

            <Step n="02" title="Address">
              <Field label="Street address" name="address" required />
              <Row two>
                <Field label="City" name="city" required />
                <Field label="Province" name="province" required />
              </Row>
              <Field label="Postal code" name="postal" required />
            </Step>

            <Step n="03" title="Shipping">
              <div className="grid gap-3 sm:grid-cols-2">
                <Option
                  checked={shipping === "regular"}
                  onSelect={() => setShipping("regular")}
                  title="Regular"
                  meta={isFreeRegular ? "Free · 3–5 days" : `${formatIDR(REGULAR_FEE)} · 3–5 days`}
                />
                <Option
                  checked={shipping === "express"}
                  onSelect={() => setShipping("express")}
                  title="Express"
                  meta={`${formatIDR(EXPRESS_FEE)} · 1–2 days`}
                />
              </div>
            </Step>

            {/* ── VOUCHER ─────────────────────────────────────────────── */}
            <Step n="04" title="Voucher">
              {/* Auto-applied vouchers */}
              <div className="space-y-2.5">
                {auto.map((v) => (
                  <div
                    key={v.code}
                    className="flex items-start justify-between gap-4 rounded-2xl border border-sage/50 bg-sage/[0.08] p-4"
                  >
                    <div className="flex items-start gap-3">
                      <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-sage-deep" strokeWidth={1.8} />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono-soft text-sm font-semibold tracking-wide text-ink">{v.code}</span>
                          <span className="rounded-full bg-sage-deep px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-paper">
                            Auto-applied
                          </span>
                        </div>
                        <p className="mt-1 text-xs font-light leading-relaxed text-ink/70">{v.description}</p>
                      </div>
                    </div>
                    <span className="shrink-0 text-sm font-semibold tabular-nums text-sage-deep">
                      −{formatIDR(v.amount)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Extra redeemable vouchers */}
              {extra.map((v) => (
                <div
                  key={v.code}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-line bg-cream p-4"
                >
                  <div className="flex items-center gap-3">
                    <Tag className="h-4 w-4 shrink-0 text-ink/60" strokeWidth={1.8} />
                    <div>
                      <span className="font-mono-soft text-sm font-semibold text-ink">{v.code}</span>
                      <p className="text-xs font-light text-ink/70">{v.label}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold tabular-nums text-sage-deep">−{formatIDR(v.amount)}</span>
                    <button
                      type="button"
                      onClick={() => setExtra((prev) => prev.filter((x) => x.code !== v.code))}
                      aria-label={`Remove ${v.code}`}
                      className="text-ink/40 hover:text-ink"
                    >
                      <X className="h-4 w-4" strokeWidth={1.6} />
                    </button>
                  </div>
                </div>
              ))}

              {/* Redeem input */}
              <div>
                <div className="flex items-end gap-3 border-b border-ink/25 pb-1">
                  <input
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        redeem();
                      }
                    }}
                    placeholder="Punya kode lain? Masukkan di sini"
                    className="flex-1 bg-transparent py-2 text-sm font-light uppercase tracking-wide outline-none placeholder:normal-case placeholder:tracking-normal placeholder:text-ink/40"
                    aria-label="Voucher code"
                  />
                  <button
                    type="button"
                    onClick={redeem}
                    className="shrink-0 pb-1 text-[10px] font-semibold uppercase tracking-widest text-ink hover:text-sage-deep"
                  >
                    Apply →
                  </button>
                </div>
                {voucherMsg && <p className="mt-2 text-[10px] uppercase tracking-widest text-ink/50">{voucherMsg}</p>}
              </div>
            </Step>

            <Step n="05" title="Payment">
              <div className="grid gap-3 sm:grid-cols-2">
                <Option checked={payment === "bank"} onSelect={() => setPayment("bank")} title="Bank Transfer" meta="BCA · Mandiri · BNI" />
                <Option checked={payment === "qris"} onSelect={() => setPayment("qris")} title="QRIS" meta="Scan & pay from any e-wallet" />
              </div>
            </Step>

            <div>
              <button
                type="submit"
                disabled={items.length === 0 || placing}
                className={cn(
                  "group inline-flex items-center gap-3 rounded-full px-8 py-4 text-xs font-medium tracking-wider transition-colors",
                  items.length === 0 || placing ? "bg-ink/30 text-paper" : "bg-ink text-paper hover:bg-sage-deep",
                )}
              >
                {placing ? "Placing order..." : `Place order · ${formatIDR(totals.total)}`}
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-500 ease-smooth group-hover:translate-x-1" strokeWidth={1.6} />
              </button>

              {error && <p className="mt-4 text-xs font-light text-rose-600">{error}</p>}
              {items.length === 0 && (
                <p className="mt-4 text-[10px] uppercase tracking-widest text-soft">
                  Bag kamu kosong. <Link href="/shop" className="underline underline-offset-4">Browse shop →</Link>
                </p>
              )}
            </div>
          </form>

          <aside className="lg:col-span-5">
            <div className="sticky top-28 overflow-hidden rounded-3xl bg-ink2 p-10 text-paper">
              <p className="text-xs uppercase tracking-widest text-paper/70">Your order</p>
              <h2 className="mt-3 text-3xl font-medium">Summary</h2>

              {items.length === 0 ? (
                <p className="mt-10 text-sm font-light text-paper/60">Belum ada item untuk diringkas.</p>
              ) : (
                <ul className="mt-10 space-y-5">
                  {items.map((item) => (
                    <li key={item.id} className="flex gap-4">
                      <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-xl" style={{ backgroundColor: item.colorHex }}>
                        <span className="slpzy-mark absolute inset-0 flex items-center justify-center text-xl !text-paper/30">slpzy</span>
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-base font-medium leading-tight text-paper">
                              {item.displayLead && <span className="font-semibold">{item.displayLead} </span>}
                              <span className="font-light">{item.displayTail}</span>
                            </p>
                            <p className="mt-1 text-[10px] uppercase tracking-wider text-paper/60">{item.variantLabel} · {item.colorName}</p>
                            {item.dimensions && <p className="text-[10px] tracking-wider text-paper/60">{item.dimensions}</p>}
                          </div>
                          <span className="text-xs font-semibold tabular-nums text-sage">{formatIDR(item.price * item.qty)}</span>
                        </div>
                        <div className="mt-auto flex items-center gap-2 pt-2">
                          <button type="button" onClick={() => decrement(item.id)} aria-label="Decrease" className="text-paper/70 hover:text-paper">
                            <Minus className="h-3 w-3" strokeWidth={1.6} />
                          </button>
                          <span className="min-w-[1rem] text-center text-xs font-medium tabular-nums">{item.qty}</span>
                          <button type="button" onClick={() => increment(item.id)} aria-label="Increase" className="text-paper/70 hover:text-paper">
                            <Plus className="h-3 w-3" strokeWidth={1.6} />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-10 h-px bg-paper/15" />
              <dl className="mt-8 space-y-3 text-sm font-light">
                <Line k="Subtotal" v={formatIDR(totals.subtotal)} />
                <Line k={`Shipping · ${shipping}`} v={shippingCost === 0 ? "Free" : formatIDR(shippingCost)} />
                {totals.shippingDiscount > 0 && (
                  <Line k="Voucher · ongkir" v={`− ${formatIDR(totals.shippingDiscount)}`} accent />
                )}
                {totals.subtotalDiscount > 0 && (
                  <Line k="Voucher · subtotal" v={`− ${formatIDR(totals.subtotalDiscount)}`} accent />
                )}
              </dl>
              <div className="mt-6 h-px bg-paper/15" />
              <div className="mt-6 flex items-baseline justify-between">
                <span className="text-xs uppercase tracking-wider">Total</span>
                <span className="text-2xl font-semibold tabular-nums text-sage">{formatIDR(totals.total)}</span>
              </div>

              {totals.shippingDiscount + totals.subtotalDiscount > 0 && (
                <p className="mt-4 flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-sage">
                  <Check className="h-3 w-3" strokeWidth={2.5} />
                  Kamu hemat {formatIDR(totals.shippingDiscount + totals.subtotalDiscount)}
                </p>
              )}

              <p className="mt-8 text-[10px] uppercase tracking-widest text-paper/60">
                TENCEL™ · Feels so right · sleepeazy
              </p>
            </div>
          </aside>
        </div>
      </ScrollStage>
    </>
  );
}

function Step({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <div data-reveal>
      <div className="flex items-baseline gap-4 border-b border-line pb-4">
        <span className="text-xs font-semibold text-sage-deep tabular-nums">{n}</span>
        <h2 className="text-2xl font-medium">{title}</h2>
      </div>
      <div className="mt-8 space-y-4">{children}</div>
    </div>
  );
}

function Row({ children, two }: { children: React.ReactNode; two?: boolean }) {
  return <div className={cn("grid gap-8", two && "sm:grid-cols-2")}>{children}</div>;
}

function Field({ label, name, type = "text", required }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label htmlFor={name} className="block text-[10px] uppercase tracking-widest text-soft">
        {label}
        {required && <span className="ml-1 text-sage-deep">*</span>}
      </label>
      <input id={name} name={name} type={type} required={required} className="input-underline mt-3" />
    </div>
  );
}

function Option({
  checked,
  onSelect,
  title,
  meta,
}: {
  checked: boolean;
  onSelect: () => void;
  title: string;
  meta: string;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      onClick={onSelect}
      className={cn(
        "flex items-start justify-between gap-4 rounded-2xl border p-5 text-left transition-colors duration-500 ease-smooth",
        checked ? "border-ink bg-ink/[0.02]" : "border-line hover:border-soft",
      )}
    >
      <div>
        <p className="text-lg font-medium leading-tight">{title}</p>
        <p className="mt-1 text-[10px] uppercase tracking-widest text-soft">{meta}</p>
      </div>
      <span
        className={cn(
          "mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors duration-300",
          checked ? "border-ink bg-ink text-paper" : "border-line",
        )}
      >
        {checked && <Check className="h-3 w-3" strokeWidth={2} />}
      </span>
    </button>
  );
}

function Line({ k, v, accent }: { k: string; v: string; accent?: boolean }) {
  return (
    <div className="flex items-baseline justify-between">
      <dt className="text-[10px] uppercase tracking-widest text-paper/70 capitalize">{k}</dt>
      <dd className={cn("text-xs tabular-nums", accent ? "font-semibold text-sage" : "text-paper/85")}>{v}</dd>
    </div>
  );
}
