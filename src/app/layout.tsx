import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import { SiteFrame } from "@/components/SiteFrame";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const APP_NAME = "SLPZY";
const APP_DEFAULT_TITLE = "SLPZY · Sleepeazy · TENCEL™ Bedding";
const APP_DESCRIPTION =
  "slpz·y /slēp ˈēzē/ · sleepeazy. A state of pure comfort found in genuine TENCEL™ Lyocell fabric and superior craftsmanship.";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://slpzy.co"),
  title: {
    default: APP_DEFAULT_TITLE,
    template: "%s · SLPZY",
  },
  description: APP_DESCRIPTION,
  keywords: [
    "SLPZY",
    "Tencel Bedding",
    "Seprai Tencel",
    "Tencel Lyocell",
    "Bedcover Tencel",
    "Sprei Sutra Organik",
    "Bedding Indonesia",
    "Cooling Bedding",
    "Luxury Bedding",
  ],
  authors: [{ name: "SLPZY Studio" }],
  creator: "SLPZY",
  publisher: "SLPZY",
  // Icons configuration
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  // PWA: installable on iOS home screen
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: APP_NAME,
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://slpzy.co",
    siteName: APP_NAME,
    title: "SLPZY · Sleepeazy · 100% Certified TENCEL™ Bedding",
    description: "Premium 100% Certified TENCEL™ Lyocell bedding. Naturally cooling, silky-soft, hypoallergenic and gentle on skin.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SLPZY Sleepeazy Bedding Collection",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SLPZY · Sleepeazy · 100% Certified TENCEL™ Bedding",
    description: "Premium 100% Certified TENCEL™ Lyocell bedding. Naturally cooling, silky-soft, hypoallergenic and gentle on skin.",
    images: ["/images/og-image.jpg"],
  },
};

// Viewport exported separately (Next.js 14+ requirement)
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F5F0E8" },
    { media: "(prefers-color-scheme: dark)", color: "#1C1917" },
  ],
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={poppins.variable} suppressHydrationWarning>
      <head>
        {/* Apple touch icon for iOS add-to-homescreen */}
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
      </head>
      <body className="font-sans font-light text-ink" suppressHydrationWarning>
        <SiteFrame>{children}</SiteFrame>
      </body>
    </html>
  );
}
