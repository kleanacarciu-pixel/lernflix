import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Moderne, deutlich kleinere Formate automatisch ausliefern.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
