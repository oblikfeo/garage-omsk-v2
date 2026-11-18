import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Admin photo uploads go through a Server Action; the default 1 MB limit
      // rejects ordinary phone photos. The action itself caps files at 8 MB.
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
