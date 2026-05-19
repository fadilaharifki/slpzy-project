"use client";
import { usePathname } from "next/navigation";
import { CartDrawer } from "@/components/CartDrawer";
import { CustomCursor } from "@/components/CustomCursor";
import { Footer } from "@/components/Footer";
import { LenisProvider } from "@/components/LenisProvider";
import { Navbar } from "@/components/Navbar";

/**
 * Renders the public storefront chrome (smooth scroll, cursor, navbar, footer,
 * cart). Skipped entirely on /cms-panel so the CMS renders clean & native.
 */
export function SiteFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname.startsWith("/cms-panel")) {
    return <>{children}</>;
  }

  return (
    <LenisProvider>
      {/* Cursor variants: "silk" | "cloud" | "stitch" | "dreamz" | "ripple" | "label" | ... */}
      <CustomCursor variant="silk" />
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <CartDrawer />
    </LenisProvider>
  );
}
