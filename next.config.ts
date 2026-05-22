import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // pg is Node-only — never bundle it for the Edge runtime. (Resend is fetch-based.)
  serverExternalPackages: ["pg", "pg-native"],
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
