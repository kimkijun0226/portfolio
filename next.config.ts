import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Avoid restoring the accumulated disk cache while diagnosing dev compiler growth.
    turbopackFileSystemCacheForDev: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "qdpekurmredvfdsaxkca.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
