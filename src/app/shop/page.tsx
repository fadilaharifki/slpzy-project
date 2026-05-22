import { getCatalog } from "@/server/services/catalog";
import { FILTER_OPTIONS, type ProductCategory } from "@/lib/products";
import { ShopClient } from "./shop-client";

export const metadata = { title: "Shop" };

// Always reflect the latest CMS edits
export const dynamic = "force-dynamic";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ c?: string }>;
}) {
  const products = await getCatalog();
  const { c } = await searchParams;

  // Pre-select a category when arriving from a nav / footer category link
  const initialCategory = (FILTER_OPTIONS as string[]).includes(c ?? "")
    ? (c as ProductCategory)
    : "All";

  return <ShopClient products={products} initialCategory={initialCategory} />;
}
