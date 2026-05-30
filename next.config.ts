import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  // Las imágenes no optimizadas de Next evitan errores en Cloudflare Pages estático
  images: { unoptimized: true },
};

export default nextConfig;
