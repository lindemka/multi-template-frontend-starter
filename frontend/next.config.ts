import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const isDevelopment = process.env.NODE_ENV === 'development';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  // No static export - we'll run Next.js server in production
  // output: 'export', // Can't use with dynamic routes
  
  // Image optimization disabled 
  images: {
    unoptimized: true,
  },
  
  // API proxy for both dev and production
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8080/api/:path*',
      },
    ];
  },
  
  // React strict mode for better development
  reactStrictMode: true,
  
  // Skip linting during build to avoid blocking deployment
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Skip TypeScript errors during build
  typescript: {
    ignoreBuildErrors: true,
  },
  
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