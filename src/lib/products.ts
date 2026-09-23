// Catalogue extracted from SLPZY Catalogue Book 2026.
// All products use certified TENCEL™ Lyocell.

export type ProductCategory = "Bedsheet" | "Bedcover" | "Pillow & Bolster" | "Bundle";

export interface ProductVariant {
  /** Label shown to user (e.g. "Super King 200x200x40") */
  label: string;
  /** Optional dimensions */
  dimensions?: string;
  /** Price in IDR */
  price: number;
}

export interface Product {
  id: string;
  name: string;
  /** Bold leading word for catalogue-style heading. e.g. "Ultra" / "Super" / "Tencel" */
  displayLead?: string;
  /** Following word displayed in light weight */
  displayTail: string;
  category: ProductCategory;
  /** Short subtitle */
  subtitle: string;
  /** Hero color swatch (Tailwind class) used as placeholder fabric tone */
  heroSwatch: string;
  /** Optional uploaded product image (Supabase Storage); falls back to gradient */
  imageUrl?: string;
  /** All product images (Supabase Storage); first image is used as cover */
  images?: string[];
  /** Color name shown next to swatch chips */
  colors: { name: string; hex: string }[];
  variants: ProductVariant[];
  description: string;
  /** Optional product highlights / inclusions */
  inclusions?: string[];
  tag?: "New" | "Bestseller" | "Limited";
}


export const COLOR_PALETTE = {
  silver: { name: "Just Grey", hex: "#D7D2CB" },
  slate: { name: "More Grey", hex: "#464b4fff" },
  sage: { name: "Slightly Green", hex: "#9DAD8E" },
  khaki: { name: "Quite Cream", hex: "#d3c396ff" },
  mauve: { name: "Very Brown", hex: "#776368ff" },
} as const;

const FIVE_COLORS = [
  COLOR_PALETTE.silver,
  COLOR_PALETTE.slate,
  COLOR_PALETTE.sage,
  COLOR_PALETTE.khaki,
  COLOR_PALETTE.mauve,
];

export const PRODUCTS: Product[] = [
  {
    id: "tencel-bedsheet",
    name: "Tencel Bedsheet",
    displayLead: "Tencel",
    displayTail: "Bedsheet",
    category: "Bedsheet",
    subtitle: "Sprei TENCEL™ silky-smooth · 5 warna · 7 ukuran",
    heroSwatch: "bg-khaki",
    colors: FIVE_COLORS,
    variants: [
      { label: "Super King", dimensions: "200 × 200 × 40", price: 998_900 },
      { label: "Super King", dimensions: "200 × 200 × 30", price: 926_900 },
      { label: "King", dimensions: "180 × 200 × 40", price: 850_800 },
      { label: "King", dimensions: "180 × 200 × 30", price: 797_800 },
      { label: "Queen", dimensions: "160 × 200 × 40", price: 769_200 },
      { label: "Queen", dimensions: "160 × 200 × 30", price: 704_200 },
      { label: "Single", dimensions: "120 × 200 × 30", price: 495_500 },
    ],
    description:
      "Sprei TENCEL™ Lyocell silky-smooth dengan moisture-wicking alami. Cocok untuk iklim Indonesia — sejuk, anti-lembap, dan lembut bertahun-tahun. *Bolster dan pillow sheet tidak termasuk.",
    tag: "Bestseller",
  },
  {
    id: "tencel-bedcover",
    name: "Double Sided Tencel Bedcover",
    displayLead: "Double Sided",
    displayTail: "Tencel Bedcover",
    category: "Bedcover",
    subtitle: "Bedcover bolak-balik · 2 warna per sisi · Cloudfill",
    heroSwatch: "bg-sage",
    colors: FIVE_COLORS,
    variants: [
      { label: "Cloudfill 240 × 240", dimensions: "240 × 240", price: 1_098_000 },
    ],
    description:
      "Bedcover dua sisi dengan dua warna berbeda — bisa di-mix dengan sprei dan pillow favoritmu. Jahitan rapi, isian Cloudfill ringan, dan permukaan TENCEL™ yang nyaman untuk dipeluk semalaman.",
    inclusions: ["1 Bedcover Cloudfill 240 × 240", "Reversible 2-sisi", "Stitching premium quilted"],
    tag: "New",
  },
  {
    id: "pillow-bolster",
    name: "Pillow & Bolster Case Set",
    displayLead: "Pillow & Bolster",
    displayTail: "Case Set",
    category: "Pillow & Bolster",
    subtitle: "Sarung bantal & guling TENCEL™ · 5 warna",
    heroSwatch: "bg-khaki",
    colors: FIVE_COLORS,
    variants: [
      { label: "Twin Set", dimensions: "2 pillow + 2 bolster", price: 298_440 },
      { label: "Single Set", dimensions: "1 pillow + 1 bolster", price: 165_800 },
      { label: "Only Case", dimensions: "1 pcs", price: 98_000 },
    ],
    description:
      "Maximize your rest experience. Sarung bantal dan guling TENCEL™ dengan jahitan halus dan jatuhan yang lembut. Tersedia dalam 5 pilihan warna yang sama dengan koleksi Bedsheet.",
  },
  {
    id: "super-bundle",
    name: "Super Bundle",
    displayLead: "Super",
    displayTail: "Bundle",
    category: "Bundle",
    subtitle: "Set komplit untuk satu kasur · 1 sprei + 2 pillow + 2 bolster + 1 bedcover",
    heroSwatch: "bg-bone",
    colors: FIVE_COLORS,
    variants: [
      { label: "Super King", dimensions: "200 × 200 × 40", price: 1_866_200 },
      { label: "Super King", dimensions: "200 × 200 × 30", price: 1_802_200 },
      { label: "King", dimensions: "180 × 200 × 40", price: 1_734_400 },
      { label: "King", dimensions: "180 × 200 × 30", price: 1_687_300 },
      { label: "Queen", dimensions: "160 × 200 × 40", price: 1_661_800 },
      { label: "Queen", dimensions: "160 × 200 × 30", price: 1_604_000 },
    ],
    description:
      "Paket lengkap untuk satu kasur — 1 bed sheet + 2 pillow case + 2 bolster case + 1 double-sided bedcover. Hemat dibanding beli satuan, langsung siap pakai dalam satu paket.",
    inclusions: ["1 Bed Sheet TENCEL™", "2 Pillow Case", "2 Bolster Case", "1 Double Sided Bedcover"],
  },
  {
    id: "ultra-bundle",
    name: "Ultra Bundle",
    displayLead: "Ultra",
    displayTail: "Bundle",
    category: "Bundle",
    subtitle: "Bundle premium untuk dua set — bedsheet rotasi · 2 sprei + 4 pillow + 4 bolster + 1 bedcover",
    heroSwatch: "bg-slate",
    colors: FIVE_COLORS,
    variants: [
      { label: "Super King", dimensions: "200 × 200 × 40", price: 2_569_500 },
      { label: "Super King", dimensions: "200 × 200 × 30", price: 2_449_900 },
      { label: "King", dimensions: "180 × 200 × 40", price: 2_323_700 },
      { label: "King", dimensions: "180 × 200 × 30", price: 2_235_700 },
      { label: "Queen", dimensions: "160 × 200 × 40", price: 2_188_200 },
      { label: "Queen", dimensions: "160 × 200 × 30", price: 2_080_300 },
    ],
    description:
      "Untuk yang ingin punya sprei cadangan tanpa kompromi kualitas. Dua set sprei lengkap dengan pillow & bolster case + satu bedcover reversible — ganti tanpa harus menunggu cucian.",
    inclusions: ["2 Bed Sheet TENCEL™", "4 Pillow Case", "4 Bolster Case", "1 Double Sided Bedcover"],
    tag: "Limited",
  },
];

export const VALUE_PROPS = [
  {
    icon: "cloud" as const,
    title: "Exceptional Softness",
    body: "TENCEL™ fabric is silky-smooth to the touch, providing unparalleled comfort.",
  },
  {
    icon: "snow" as const,
    title: "Breathable & Cool",
    body: "Stay cool and refreshed thanks to TENCEL™'s natural moisture-wicking properties.",
  },
  {
    icon: "leaf" as const,
    title: "Sustainable Choice",
    body: "TENCEL™ is derived from renewable wood sources and produced in an eco-friendly closed-loop process.",
  },
];

export const FILTER_OPTIONS: ("All" | ProductCategory)[] = ["All", "Bedsheet", "Bedcover", "Pillow & Bolster", "Bundle"];

export function formatIDR(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function priceFrom(product: Product): number {
  return Math.min(...product.variants.map((v) => v.price));
}
