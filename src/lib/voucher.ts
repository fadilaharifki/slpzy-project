// Voucher logic — framework-agnostic, safe to import on client & server.

export type VoucherKind = "shipping" | "subtotal";

export interface Voucher {
  code: string;
  label: string;
  description: string;
  kind: VoucherKind;
  /** Flat discount amount in IDR */
  amount: number;
  /** Auto-applied at checkout for every order */
  auto: boolean;
  active: boolean;
  /** Minimum subtotal required for the voucher to apply */
  minSubtotal?: number;
}

/**
 * Default catalogue of vouchers. The shipping cashback is `auto: true`, so it is
 * applied automatically for every checkout. The CMS can later override / extend
 * this list via the `vouchers` table — `getActiveVouchers()` merges DB + defaults.
 */
export const DEFAULT_VOUCHERS: Voucher[] = [
  {
    code: "SLPZYSHIP30",
    label: "Shipping cashback",
    description: "Potongan ongkir Rp 30.000 — otomatis terpasang untuk semua order.",
    kind: "shipping",
    amount: 30_000,
    auto: true,
    active: true,
  },
];

export function autoVouchers(list: Voucher[] = DEFAULT_VOUCHERS): Voucher[] {
  return list.filter((v) => v.active && v.auto);
}

export function findVoucher(code: string, list: Voucher[] = DEFAULT_VOUCHERS): Voucher | undefined {
  return list.find((v) => v.active && v.code.toUpperCase() === code.trim().toUpperCase());
}

export interface CartTotals {
  subtotal: number;
  shippingCost: number;
  shippingDiscount: number;
  subtotalDiscount: number;
  total: number;
  appliedVouchers: Voucher[];
}

/**
 * Compute order totals given the cart subtotal, shipping cost, and a set of
 * applied vouchers. Shipping discount is capped at the shipping cost (never
 * goes negative); subtotal discount is capped at the subtotal.
 */
export function computeTotals(subtotal: number, shippingCost: number, vouchers: Voucher[]): CartTotals {
  let shippingOff = 0;
  let subtotalOff = 0;
  const applied: Voucher[] = [];

  for (const v of vouchers) {
    if (!v.active) continue;
    if (v.minSubtotal && subtotal < v.minSubtotal) continue;
    if (v.kind === "shipping") shippingOff += v.amount;
    else subtotalOff += v.amount;
    applied.push(v);
  }

  const shippingDiscount = Math.min(shippingOff, shippingCost);
  const subtotalDiscount = Math.min(subtotalOff, subtotal);
  const total = Math.max(0, subtotal + shippingCost - shippingDiscount - subtotalDiscount);

  return { subtotal, shippingCost, shippingDiscount, subtotalDiscount, total, appliedVouchers: applied };
}
