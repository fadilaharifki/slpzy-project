import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SLPZY · Sleepeazy · Premium TENCEL™ Bedding",
    short_name: "SLPZY",
    description:
      "slpz·y /slēp ˈēzē/ — Premium TENCEL™ Lyocell bedding. Recharge your energy with ultra comfort sleep.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#F5F0E8",
    theme_color: "#1C1917",
    categories: ["shopping", "lifestyle"],
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
    screenshots: [],
  };
}
