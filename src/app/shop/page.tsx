import { getCatalog } from "@/server/services/catalog";
import { ShopClient } from "./shop-client";

export const metadata = { title: "Shop" };

// Always reflect the latest CMS edits
export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const products = await getCatalog();
  return <ShopClient products={products} />;
}
