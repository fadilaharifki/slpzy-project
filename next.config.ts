import { spawnSync } from "node:child_process";
import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

// Generate a revision string for precache versioning
const revision =
  spawnSync("git", ["rev-parse", "HEAD"], { encoding: "utf-8" }).stdout?.trim() ??
  crypto.randomUUID();

const withSerwist = withSerwistInit({
  // Offline fallback page will be precached
  additionalPrecacheEntries: [{ url: "/~offline", revision }],
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  // Disable PWA service worker in development to avoid caching issues
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // pg is Node-only — never bundle it for the Edge runtime. (Resend is fetch-based.)
  serverExternalPackages: ["pg", "pg-native"],
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default withSerwist(nextConfig);
