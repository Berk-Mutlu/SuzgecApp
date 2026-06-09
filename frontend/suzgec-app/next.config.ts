import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Docker çok aşamalı derleme için standalone çıktısı gerekli
  output: "standalone",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
