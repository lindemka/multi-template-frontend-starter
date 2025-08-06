import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Development configuration - NO basePath, direct API proxy
  images: {
    unoptimized: true,
  },
  
  // Proxy API requests to Spring Boot during development
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8080/api/:path*',
      },
    ];
  },
  
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  
  // Turbopack for faster builds
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
};

export default nextConfig;