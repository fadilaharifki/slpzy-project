import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { SiteFrame } from "@/components/SiteFrame";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://slpzy.id"),
  title: { default: "SLPZY · Sleepeazy · TENCEL™ Bedding", template: "%s · SLPZY" },
  description:
    "slpz·y /slēp ˈēzē/ · sleepeazy. A state of pure comfort found in genuine TENCEL™ Lyocell fabric and superior craftsmanship.",
  openGraph: {
    title: "SLPZY · Sleepeazy",
    description: "Premium TENCEL™ Lyocell bedding. Recharge your energy with ultra comfort sleep.",
    type: "website",
    locale: "id_ID",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={poppins.variable}>
      <body className="font-sans font-light text-ink">
        <SiteFrame>{children}</SiteFrame>
      </body>
    </html>
  );
}
