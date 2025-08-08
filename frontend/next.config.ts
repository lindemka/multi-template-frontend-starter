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

  // API proxy for backend endpoints not handled by our BFF route handlers
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

  // Use Next.js default webpack settings to avoid chunk issues
};

export default withNextIntl(nextConfig);