import { getCatalogForCms } from "@/server/services/catalog";
import { CmsPageHead } from "../_ui";
import { ProductsClient } from "./products-client";

export const metadata = { title: "Products · CMS" };

export default async function CmsProductsPage() {
  const data = await getCatalogForCms();

  return (
    <div>
      <CmsPageHead
        title="Products"
        desc="Ubah harga, deskripsi, kategori, warna, varian, dan foto produk. Perubahan langsung tampil di toko."
      />
      {!data.configured ? (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5 text-sm text-amber-800">
          Database belum dikonfigurasi. Jalankan <code>pnpm db:push</code> &amp; <code>pnpm db:seed</code>.
        </div>
      ) : (
        <ProductsClient
          products={data.products.map((p) => ({
            id: p.id,
            slug: p.slug,
            name: p.name,
            displayLead: p.displayLead ?? "",
            displayTail: p.displayTail,
            category: p.category,
            subtitle: p.subtitle,
            description: p.description,
            heroSwatch: p.heroSwatch,
            imageUrl: p.imageUrl ?? "",
            images: (p.images as string[] | null) ?? [],
            tag: p.tag ?? "",
            colors: p.colors ?? [],
            inclusions: p.inclusions ?? [],
            isActive: p.isActive,
          }))}
          variants={data.variants.map((v) => ({
            id: v.id,
            productId: v.productId,
            label: v.label,
            dimensions: v.dimensions ?? "",
            price: Number(v.price),
            sortOrder: v.sortOrder,
          }))}
        />
      )}
    </div>
  );
}
