import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // GitHub Pages serves static files only — no Node server — so the site is
  // pre-rendered to out/ rather than built as a standalone server.
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
