import { getAllOrderItems, listOrders } from "@/server/services/orders";
import { CmsPageHead } from "../_ui";
import { OrdersClient } from "./orders-client";

export const metadata = { title: "Orders · CMS" };

export default async function CmsOrdersPage() {
  const [orders, allItems] = await Promise.all([listOrders(), getAllOrderItems()]);

  const itemsByOrder: Record<string, { productName: string; variantLabel: string; dimensions: string | null; colorName: string; qty: number; unitPrice: number; lineTotal: number }[]> = {};
  for (const it of allItems) {
    (itemsByOrder[it.orderId] ??= []).push({
      productName: it.productName,
      variantLabel: it.variantLabel,
      dimensions: it.dimensions,
      colorName: it.colorName,
      qty: it.qty,
      unitPrice: Number(it.unitPrice),
      lineTotal: Number(it.lineTotal),
    });
  }

  return (
    <div>
      <CmsPageHead
        title="Orders"
        desc="Semua orderan dari website + order manual. Klik baris untuk detail."
      />
      <OrdersClient
        initialOrders={orders.map((o) => ({
          id: o.id,
          code: o.code,
          customerName: o.customerName,
          customerEmail: o.customerEmail,
          customerPhone: o.customerPhone,
          address: o.address,
          city: o.city,
          province: o.province,
          postalCode: o.postalCode,
          shippingMethod: o.shippingMethod,
          shippingCost: Number(o.shippingCost),
          paymentMethod: o.paymentMethod,
          subtotal: Number(o.subtotal),
          voucherCode: o.voucherCode,
          voucherDiscount: Number(o.voucherDiscount),
          total: Number(o.total),
          status: o.status,
          source: o.source,
          notes: o.notes,
          createdAt: o.createdAt.toISOString(),
        }))}
        itemsByOrder={itemsByOrder}
      />
    </div>
  );
}
