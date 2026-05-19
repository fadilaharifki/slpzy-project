import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // pg & nodemailer are Node-only — never bundle them for the Edge runtime
  serverExternalPackages: ["pg", "pg-native", "nodemailer"],
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
