import "server-only";
import { asc, eq } from "drizzle-orm";
import { db, isDbConfigured } from "@/db";
import { products, productVariants } from "@/db/schema";
import { PRODUCTS, type Product } from "@/lib/products";

/**
 * Read the product catalogue. Reads from the DB when configured (so CMS edits
 * show on the storefront); falls back to the static catalogue otherwise.
 */
export async function getCatalog(): Promise<Product[]> {
  if (!isDbConfigured()) return PRODUCTS;

  try {
    const rows = await db.select().from(products).orderBy(asc(products.sortOrder));
    if (rows.length === 0) return PRODUCTS;

    const variants = await db.select().from(productVariants).orderBy(asc(productVariants.sortOrder));

    return rows
      .filter((r) => r.isActive)
      .map((r): Product => ({
        id: r.slug,
        name: r.name,
        displayLead: r.displayLead ?? undefined,
        displayTail: r.displayTail,
        category: r.category,
        subtitle: r.subtitle,
        heroSwatch: r.heroSwatch,
        imageUrl: r.imageUrl ?? undefined,
        colors: r.colors ?? [],
        inclusions: r.inclusions ?? [],
        tag: r.tag ?? undefined,
        description: r.description,
        variants: variants
          .filter((v) => v.productId === r.id)
          .map((v) => ({ label: v.label, dimensions: v.dimensions ?? undefined, price: Number(v.price) })),
      }));
  } catch (err) {
    console.error("[catalog] DB read failed, using static fallback:", err);
    return PRODUCTS;
  }
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const all = await getCatalog();
  return all.find((p) => p.id === slug);
}

/** Raw product rows + variants for the CMS editor. */
export async function getCatalogForCms() {
  if (!isDbConfigured()) return { configured: false as const, products: [], variants: [] };
  const rows = await db.select().from(products).orderBy(asc(products.sortOrder));
  const variants = await db.select().from(productVariants).orderBy(asc(productVariants.sortOrder));
  return { configured: true as const, products: rows, variants };
}

export async function getCmsProduct(id: string) {
  const [row] = await db.select().from(products).where(eq(products.id, id)).limit(1);
  if (!row) return null;
  const variants = await db
    .select()
    .from(productVariants)
    .where(eq(productVariants.productId, id))
    .orderBy(asc(productVariants.sortOrder));
  return { ...row, variants };
}
