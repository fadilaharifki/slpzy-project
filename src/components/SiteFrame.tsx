"use client";
import { usePathname } from "next/navigation";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { CartDrawer } from "@/components/CartDrawer";
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
      <AnnouncementBar />
      <Navbar />
      <main className="min-h-screen pb-[60px] lg:pb-0">{children}</main>
      <Footer />
      <CartDrawer />
    </LenisProvider>
  );
}
