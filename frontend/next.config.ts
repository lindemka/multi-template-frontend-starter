import type { NextConfig } from "next";

const isDevelopment = process.env.NODE_ENV === 'development';

const nextConfig: NextConfig = {
  // Static export in production (no basePath - same paths as dev!)
  ...(isDevelopment ? {} : {
    output: 'export',
    distDir: '../backend/src/main/resources/static',
  }),
  
  // Always have trailing slash for consistency
  trailingSlash: true,
  
  // Image optimization disabled for static export
  images: {
    unoptimized: true,
  },
  
  // Development-only API proxy
  ...(isDevelopment ? {
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost:8080/api/:path*',
        },
      ];
    },
  } : {}),
  
  // React strict mode for better development
  reactStrictMode: true,
};

export default nextConfig;