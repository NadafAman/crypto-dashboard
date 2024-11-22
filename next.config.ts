import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['coin-images.coingecko.com']
  },
  reactStrictMode: true, // Add a comma here
};

export default nextConfig;