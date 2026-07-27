import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/actor-ai",
  assetPrefix: "/actor-ai/",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

