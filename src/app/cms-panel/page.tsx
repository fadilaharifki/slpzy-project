import Link from "next/link";
import { isDbConfigured } from "@/db";
import { formatIDR } from "@/lib/products";
import { listOrders } from "@/server/services/orders";
import { getCatalogForCms } from "@/server/services/catalog";
import { listSubscribers } from "@/server/services/newsletter";
import { CmsCard, CmsPageHead, StatTile, StatusPill } from "./_ui";

export default async function CmsDashboard() {
  const dbReady = isDbConfigured();
  const [orders, catalog, subs] = await Promise.all([
    listOrders(),
    getCatalogForCms(),
    listSubscribers(),
  ]);

  const revenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + Number(o.total), 0);
  const pending = orders.filter((o) => o.status === "pending").length;
  const recent = orders.slice(0, 6);

  return (
    <div>
      <CmsPageHead title="Dashboard" desc="Ringkasan toko SLPZY — orderan, produk, dan subscriber." />

      {!dbReady && (
        <div className="mb-8 rounded-2xl border border-amber-300 bg-amber-50 p-5 text-sm text-amber-800">
          <strong>Database belum terkonfigurasi.</strong> Isi <code>DATABASE_URL</code> di{" "}
          <code>.env.local</code>, jalankan <code>pnpm db:push</code> lalu <code>pnpm db:seed</code> untuk
          mengaktifkan CMS sepenuhnya.
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile label="Total Orders" value={String(orders.length)} hint={`${pending} pending`} />
        <StatTile label="Revenue" value={formatIDR(revenue)} hint="Exclude cancelled" />
        <StatTile label="Products" value={String(catalog.products.length)} hint={`${catalog.variants.length} variants`} />
        <StatTile label="Subscribers" value={String(subs.length)} hint="Newsletter" />
      </div>

      <CmsCard className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-ink/70">Recent orders</h2>
          <Link href="/cms-panel/orders" className="text-xs font-medium text-sage-deep hover:underline">
            View all →
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="py-8 text-center text-sm text-ink/40">Belum ada order.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-[10px] uppercase tracking-widest text-ink/45">
                <th className="py-2 font-semibold">Code</th>
                <th className="py-2 font-semibold">Customer</th>
                <th className="py-2 font-semibold">Total</th>
                <th className="py-2 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((o) => (
                <tr key={o.id} className="border-b border-line/60 last:border-0">
                  <td className="py-3 font-mono-soft text-xs font-semibold">{o.code}</td>
                  <td className="py-3">{o.customerName}</td>
                  <td className="py-3 font-semibold tabular-nums">{formatIDR(Number(o.total))}</td>
                  <td className="py-3"><StatusPill status={o.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CmsCard>
    </div>
  );
}
