import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Sin el optimizador de imágenes de Vercel: el cupo del plan gratuito se agotó
    // y devolvía 402 (las fotos no cargaban). Las imágenes se sirven tal cual.
    unoptimized: true,
  },
};

export default nextConfig;
