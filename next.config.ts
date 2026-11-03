import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow opening the dev server from a phone on the local network
  allowedDevOrigins: ["10.223.1.200", "*.local"],
};

export default nextConfig;
