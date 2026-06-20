import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Pin Turbopack root to the project directory to silence multi-lockfile warning
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
