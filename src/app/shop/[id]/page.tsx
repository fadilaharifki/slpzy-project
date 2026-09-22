import { notFound } from "next/navigation";
import { getProductBySlug, getCatalog } from "@/server/services/catalog";
import { ProductDetailClient } from "./product-detail-client";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductBySlug(id);
  if (!product) return { title: "Product Not Found" };

  const minPrice = product.variants.length > 0 ? Math.min(...product.variants.map((v) => v.price)) : 0;
  const title = `${product.name} — 100% TENCEL™ Lyocell`;
  const description = `${product.subtitle}${minPrice > 0 ? ` · Starting from IDR ${minPrice.toLocaleString("id-ID")}` : ""} · Available in 5 curated colors & 7 sizes.`;

  return {
    title,
    description,
    openGraph: {
      title: `${product.name} · SLPZY`,
      description,
      type: "website",
      images: [
        {
          url: product.imageUrl || "/images/hero-bedroom.jpg",
          width: 1000,
          height: 1000,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} · SLPZY`,
      description,
      images: [product.imageUrl || "/images/hero-bedroom.jpg"],
    },
  };
}

export async function generateStaticParams() {
  const products = await getCatalog();
  return products.map((p) => ({ id: p.id }));
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductBySlug(id);

  if (!product) notFound();

  return <ProductDetailClient product={product} />;
}
