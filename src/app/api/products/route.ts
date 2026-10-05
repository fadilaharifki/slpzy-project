import { NextResponse } from "next/server";
import { getCatalog } from "@/server/services/catalog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/products
 * Returns active product catalogue from the database (or static fallback).
 * Used by client components (e.g. SearchOverlay) to always reflect CMS edits.
 */
export async function GET() {
  try {
    const products = await getCatalog();
    return NextResponse.json(products);
  } catch (error) {
    console.error("[api/products] Error fetching catalog:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
