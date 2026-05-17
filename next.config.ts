import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  // Required for GitHub Pages: assets served from /demo-2/ in production
  basePath: isProd ? "/demo-2" : "",
  assetPrefix: isProd ? "/demo-2/" : "",
};

export default nextConfig;
