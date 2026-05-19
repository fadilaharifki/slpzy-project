"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product, ProductVariant } from "@/lib/products";

export interface CartItem {
  id: string; // composite productId + variantLabel + dimensions
  productId: string;
  name: string;
  displayLead?: string;
  displayTail: string;
  category: string;
  variantLabel: string;
  dimensions?: string;
  price: number;
  colorName: string;
  colorHex: string;
  swatch: string;
  qty: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  add: (product: Product, variant: ProductVariant, color: { name: string; hex: string }) => void;
  increment: (id: string) => void;
  decrement: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  count: () => number;
  subtotal: () => number;
}

function compositeId(productId: string, v: ProductVariant, colorName: string) {
  return `${productId}::${v.label}::${v.dimensions ?? ""}::${colorName}`;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((s) => ({ isOpen: !s.isOpen })),

      add: (product, variant, color) => {
        const id = compositeId(product.id, variant, color.name);
        set((s) => {
          const existing = s.items.find((i) => i.id === id);
          if (existing) {
            return {
              items: s.items.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i)),
              isOpen: true,
            };
          }
          return {
            items: [
              ...s.items,
              {
                id,
                productId: product.id,
                name: product.name,
                displayLead: product.displayLead,
                displayTail: product.displayTail,
                category: product.category,
                variantLabel: variant.label,
                dimensions: variant.dimensions,
                price: variant.price,
                colorName: color.name,
                colorHex: color.hex,
                swatch: product.heroSwatch,
                qty: 1,
              },
            ],
            isOpen: true,
          };
        });
      },

      increment: (id) => set((s) => ({ items: s.items.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i)) })),
      decrement: (id) =>
        set((s) => ({
          items: s.items
            .map((i) => (i.id === id ? { ...i, qty: i.qty - 1 } : i))
            .filter((i) => i.qty > 0),
        })),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      clear: () => set({ items: [] }),

      count: () => get().items.reduce((sum, i) => sum + i.qty, 0),
      subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
    }),
    { name: "slpzy-cart" },
  ),
);
