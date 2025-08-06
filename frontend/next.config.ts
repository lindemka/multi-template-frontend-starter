import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const isDevelopment = process.env.NODE_ENV === 'development';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  // Static export for Spring Boot
  output: 'export',
  
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
  
  // Webpack configuration to prevent module loading issues
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Prevent webpack module conflicts in development
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization.splitChunks,
          cacheGroups: {
            ...config.optimization.splitChunks.cacheGroups,
            default: false,
            vendors: false,
          },
        },
      };
      
      // Better error handling for hot module replacement
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }
    
    return config;
  },
};

export default withNextIntl(nextConfig);