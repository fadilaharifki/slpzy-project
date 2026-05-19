// Seed the SLPZY database from the static catalogue.
// Run: pnpm db:seed   (loads .env.local via tsx --env-file)
import { db, isDbConfigured } from "./index";
import { mediaAssets, newsletterSubscribers, orderItems, orders, productVariants, products, siteContent, vouchers } from "./schema";
import { PRODUCTS } from "../lib/products";
import { DEFAULT_VOUCHERS } from "../lib/voucher";

const SITE_CONTENT: { key: string; label: string; value: string }[] = [
  { key: "hero.eyebrow", label: "Hero — eyebrow", value: "Product Catalogue · 2026" },
  { key: "hero.title", label: "Hero — title", value: "A state of pure comfort, found in genuine TENCEL™ fabric." },
  {
    key: "hero.body",
    label: "Hero — body",
    value:
      "slpz·y /slēp ˈēzē/ · sleepeazy — the art of upgrading your life through the luxury of deep, restorative rest. Premium bedding, dijahit dengan TENCEL™ Lyocell asli.",
  },
  { key: "hero.ctaLabel", label: "Hero — CTA label", value: "Shop the Catalogue" },
  {
    key: "marquee.items",
    label: "Marquee strip (one item per line)",
    value: [
      "100% Certified TENCEL™ Lyocell",
      "Free shipping above IDR 800K",
      "5 colorways · 7 sizes",
      "Hypoallergenic & gentle for sensitive skin",
      "Eco-friendly closed-loop process",
      "Maximize your rest experience",
    ].join("\n"),
  },
];

async function main() {
  if (!isDbConfigured()) {
    console.error("✗ DATABASE_URL belum di-set. Isi .env.local dulu.");
    process.exit(1);
  }
  console.log("🌱 Seeding SLPZY database...");

  // Wipe in FK-safe order (idempotent re-seed)
  await db.delete(orderItems);
  await db.delete(orders);
  await db.delete(productVariants);
  await db.delete(products);
  await db.delete(vouchers);
  await db.delete(mediaAssets);
  await db.delete(siteContent);
  await db.delete(newsletterSubscribers);

  // Products + variants
  for (let i = 0; i < PRODUCTS.length; i++) {
    const p = PRODUCTS[i];
    const [row] = await db
      .insert(products)
      .values({
        slug: p.id,
        name: p.name,
        displayLead: p.displayLead ?? null,
        displayTail: p.displayTail,
        category: p.category,
        subtitle: p.subtitle,
        description: p.description,
        heroSwatch: p.heroSwatch,
        tag: p.tag ?? null,
        colors: p.colors,
        inclusions: p.inclusions ?? [],
        sortOrder: i,
        isActive: true,
      })
      .returning();

    await db.insert(productVariants).values(
      p.variants.map((v, vi) => ({
        productId: row.id,
        label: v.label,
        dimensions: v.dimensions ?? null,
        price: v.price.toString(),
        sortOrder: vi,
      })),
    );
    console.log(`  ✓ ${p.name} (${p.variants.length} variants)`);
  }

  // Vouchers
  await db.insert(vouchers).values(
    DEFAULT_VOUCHERS.map((v) => ({
      code: v.code,
      label: v.label,
      description: v.description,
      kind: v.kind,
      amount: v.amount.toString(),
      auto: v.auto,
      active: v.active,
      minSubtotal: v.minSubtotal ? v.minSubtotal.toString() : null,
    })),
  );
  console.log(`  ✓ ${DEFAULT_VOUCHERS.length} voucher(s)`);

  // Site content
  await db.insert(siteContent).values(
    SITE_CONTENT.map((c) => ({ key: c.key, label: c.label, value: c.value })),
  );
  console.log(`  ✓ ${SITE_CONTENT.length} content blocks`);

  console.log("✅ Seed complete.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
