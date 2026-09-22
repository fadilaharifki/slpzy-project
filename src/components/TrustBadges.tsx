import { Truck, MessageCircle, RotateCcw, ShieldCheck } from "lucide-react";

const BADGES = [
  {
    icon: Truck,
    title: "Free Shipping",
    desc: "Untuk pembelian di atas IDR 800K",
  },
  {
    icon: MessageCircle,
    title: "Customer Support",
    desc: "Siap bantu kamu setiap hari",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    desc: "7 hari kebijakan pengembalian",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payment",
    desc: "Transaksi aman & terpercaya",
  },
];

export function TrustBadges() {
  return (
    <div className="border-y border-line bg-paper">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <div className="grid grid-cols-2 divide-x divide-y divide-line lg:grid-cols-4 lg:divide-y-0">
          {BADGES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="flex items-center gap-4 px-6 py-5 lg:px-8 lg:py-6"
            >
              <div className="shrink-0 rounded-full bg-cream p-2.5">
                <Icon className="h-4 w-4 text-sage-deep" strokeWidth={1.6} />
              </div>
              <div>
                <p className="text-xs font-medium text-ink">{title}</p>
                <p className="mt-0.5 text-[11px] font-light text-soft">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
