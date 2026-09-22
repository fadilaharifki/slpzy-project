import { getCatalog } from "@/server/services/catalog";
import { FILTER_OPTIONS, type ProductCategory } from "@/lib/products";
import { ShopClient } from "./shop-client";

export const metadata = {
  title: "Shop The Collection",
  description:
    "Explore our complete collection of 100% Certified TENCEL™ Lyocell bedsheets, bedcovers, pillows & bolsters, and bundle sets. Designed for restful sleep.",
  openGraph: {
    title: "The Collection · SLPZY",
    description:
      "Explore 100% Certified TENCEL™ Lyocell bedding. Silky-soft, naturally cooling, and crafted for restorative sleep.",
    images: [
      {
        url: "/images/hero-bedroom.jpg",
        width: 1200,
        height: 630,
        alt: "SLPZY Bedding Collection",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Collection · SLPZY",
    description: "Explore 100% Certified TENCEL™ Lyocell bedding.",
    images: ["/images/hero-bedroom.jpg"],
  },
};

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
