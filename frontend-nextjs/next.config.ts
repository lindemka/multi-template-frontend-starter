import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Build output configuration for Spring Boot integration
  output: 'export',
  trailingSlash: true,
  distDir: '../backend/src/main/resources/static/nextjs',
  
  // Image optimization disabled for static export
  images: {
    unoptimized: true,
  },
  
  // Base path for Spring Boot integration
  basePath: '/nextjs',
  
  // Enable experimental features for better performance
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
};

export default nextConfig;
