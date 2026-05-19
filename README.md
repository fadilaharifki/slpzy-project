# SLPZY · Sleepeazy

E-commerce site for **SLPZY**, an Indonesian TENCEL™ Lyocell bedding brand. Built directly from the official SLPZY Catalogue Book 2026 — brand tokens, voice, and product data extracted from the source.

> *slpz·y /slēp ˈēzē/ · sleepeazy*
> A state of pure comfort found in genuine TENCEL™ Lyocell fabric and superior craftsmanship.

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS — custom palette extracted from catalogue
- Poppins (Google Fonts) — single rounded geometric sans-serif, matched to catalogue typography
- Zustand + persist — cart state
- @studio-freight/lenis — smooth scroll (lerp 0.08)
- Custom `<ScrollStage>` + `<RevealGroup>` — cinematic section-to-section transitions
- Custom SVG SLPZY wordmark (`<Logo>` / `<LogoMark>`)

## Setup

```bash
pnpm install
pnpm dev
```

Open <http://localhost:3000>.

## Brand tokens

### Color palette (from catalogue)

| Token | Hex | Use |
|---|---|---|
| `ink` | `#3F3F3F` | Primary text, wordmark, dark CTAs |
| `ink2` | `#5C5C5C` | "SLPZY Xperience" dark sections |
| `soft` | `#8A8A8A` | UI labels, captions |
| `paper` | `#FFFFFF` | Primary surface |
| `cream` | `#F8F5F0` | Lifted warm surfaces |
| `bone` | `#EEE9DF` | Hero card backgrounds |
| `sage` | `#9DAD8E` | Signature accent (from hero sage comforter) |
| `sage-deep` | `#7C8E6C` | Hover, active, accent text |
| `khaki` | `#C9A876` | Fabric variant — warm khaki |
| `mauve` | `#C8A6AE` | Fabric variant — dusty mauve |
| `slate` | `#90A3AC` | Fabric variant — dusty blue grey |
| `line` | `#E3DED4` | Hairline dividers |

### Five colorways (matching catalogue)

Silver Mist · Slate Storm · Forest Sage · Warm Khaki · Dusty Mauve

### Typography

Single typeface — **Poppins** — used at multiple weights:
- 700 (bold) — leading word in catalogue-style mixed headlines ("**Ultra** Bundle")
- 600 (semibold) — emphasized words
- 400 (regular) — body
- 300 (light) — display tails and long-form body

Use the `.heading-mixed` class for catalogue-style headings; `<strong>` inside renders as bold for the leading word, the rest stays light.

## Scroll transition system

Every page wraps each section in `<ScrollStage variant="..." />`. The component reads scroll progress per-section and applies transforms:

| Variant | Effect |
|---|---|
| `lift` | Fades in + translateY 32→0 as section enters, holds while in view |
| `scale` | Scale 0.94 → 1 on enter, 1 → 0.96 on exit (used between adjacent light sections for a film-cut feel) |
| `parallax` | Slow translateY drift across the full visible range (-40 → +40px) |
| `curtain` | Clip-path opens from center; pairs with `curtainColor` matching the next section bg |
| `stack` | Sticky pin with outgoing scale + blur (for hero-to-hero stacking) |

For element-level reveals, wrap content in `<RevealGroup>` and tag children with `data-reveal` (+ optional `data-reveal-delay="300"`). The group sets up a single IntersectionObserver that staggers each child as it enters.

Honors `prefers-reduced-motion`.

## Pages

| Route | What |
|---|---|
| `/` | Hero · marquee · SLPZY Xperience (dark) · PureTencel vs Microtex comparison · featured products · sage bundles · brand promise · closing CTA |
| `/shop` | Filter pills (animated charcoal slide) · 3-col grid · per-product Size & Color picker block with live price |
| `/about` | Studio letter · "Three commitments" dark card · Xperience callback · giant watermark |
| `/reach` | Underline-only form · dark contact sidebar with WhatsApp / Email / Instagram |
| `/checkout` | 4-step form (Contact · Address · Shipping · Payment) · sticky dark summary card with itemized cart |

## Product catalog

Five SKUs from the catalogue, all using TENCEL™ Lyocell:

| Product | From | Sizes |
|---|---|---|
| Tencel Bedsheet | IDR 495,500 | 7 sizes (Super King → Single) |
| Double Sided Tencel Bedcover | IDR 1,098,000 | 240×240 only |
| Pillow & Bolster Case Set | IDR 98,000 | Twin / Single / Only Case |
| Super Bundle | IDR 1,604,000 | 6 sizes (Super King → Queen) |
| Ultra Bundle | IDR 2,080,300 | 6 sizes (Super King → Queen) |

Each product has 5 colorways and shows TENCEL™ provenance badging.

## Voice (matched to catalogue)

- "A state of pure comfort found in genuine TENCEL™ Lyocell fabric and superior craftsmanship."
- "How you start your day depends entirely on how you ended the night before."
- "Recharge your energy with ultra comfort sleep like never before with SLPZY."
- "True comfort meets conscious luxury."
- "TENCEL™ · Feels so right"

## Folder structure

```
src/
├── app/
│   ├── layout.tsx        ← Poppins font, Lenis, cursor, navbar, cart drawer
│   ├── page.tsx          ← Home (8 scroll stages)
│   ├── shop/page.tsx
│   ├── about/page.tsx
│   ├── reach/page.tsx
│   ├── checkout/page.tsx
│   └── globals.css
├── components/
│   ├── ScrollStage.tsx   ← 5 transition variants + RevealGroup
│   ├── Logo.tsx          ← Custom SVG SLPZY wordmark + LogoMark
│   ├── ValueProp.tsx     ← Catalogue-style icon + framed value cards
│   ├── Navbar.tsx        ← Scroll-aware frosted, mobile drawer
│   ├── CartDrawer.tsx    ← Right-side 440px drawer, free-ship bar
│   ├── ProductCard.tsx   ← Color chips, gradient fabric, hover add bar
│   ├── MarqueeTicker.tsx ← Dark / sage / light variants
│   ├── CustomCursor.tsx  ← Dot + lagging ring (sage)
│   ├── LenisProvider.tsx
│   └── Footer.tsx
├── lib/
│   ├── products.ts       ← Real TENCEL catalog, 5 colorways, formatIDR
│   └── cn.ts
└── store/
    └── cartStore.ts      ← Zustand + persist
```

## Production photography

Current product imagery uses CSS gradients + folded shapes matched to the catalogue fabric tones. To plug in real photography:

1. Drop `.jpg`/`.webp` into `public/products/` (e.g. `bedsheet-sage.jpg`).
2. Add an `imageSrc` field per color in `src/lib/products.ts`.
3. In `ProductCard.tsx`, replace the gradient div with `<Image>` from `next/image`.

Same goes for hero (`ComforterStack` in `app/page.tsx`) — swap with a real shot when available.
# slpzy-co
