// Extract the origin domain from your API URL dynamically
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
let apiDomain = 'http://localhost:5000';
try {
  apiDomain = new URL(apiUrl).origin;
} catch (e) {
  console.warn('Invalid NEXT_PUBLIC_API_URL format, defaulting to localhost');
}

import withPWAInit from '@ducanh2912/next-pwa';

const withPWA = withPWAInit({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  customWorkerSrc: 'worker',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Compress responses
  compress: true,

  // Power by header removal
  poweredByHeader: false,

  // Image optimization
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [375, 430, 768, 1024, 1280, 1536],
    imageSizes: [64, 128, 256, 384, 512],
    minimumCacheTTL: 86400,
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL
      || 'http://localhost:5000/api',
    NEXT_PUBLIC_WHATSAPP:
      process.env.NEXT_PUBLIC_WHATSAPP
      || '+9198985 58222',
    NEXT_PUBLIC_BASE_URL:
      process.env.NEXT_PUBLIC_BASE_URL
      || 'https://www.hariramcars.com/',
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            value: `default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com; worker-src 'self' blob:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob: https://res.cloudinary.com https://images.unsplash.com https://lh3.googleusercontent.com https://randomuser.me; media-src 'self' https://res.cloudinary.com; font-src 'self' data: https://fonts.gstatic.com; frame-src 'self' https://www.google.com https://maps.google.com; connect-src 'self' https://res.cloudinary.com https://www.googletagmanager.com https://api.cloudinary.com https://maps.googleapis.com ${apiDomain} https://www.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net;`,
          },
        ],
      },
      {
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: 'https://www.hariramcars.com' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
      {
        // Cache static assets aggressively
        source: '/(.*)\\.(jpg|jpeg|png|webp|avif|svg|ico|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Proxy API requests to Vercel Serverless Function via absolute URL
  async rewrites() {
    const isVercel = process.env.VERCEL === '1';
    let baseUrl = 'http://localhost:5000';

    if (isVercel) {
      if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' || process.env.VERCEL_ENV === 'production') {
        baseUrl = 'https://www.hariramcars.com';
      } else {
        baseUrl = `https://${process.env.VERCEL_URL}`;
      }
    }

    let destination = `${baseUrl}/backend/server.js?path=:path*`;

    if (!isVercel) {
      destination = `${baseUrl}/api/:path*`;
    }

    return [
      {
        source: '/api/:path*',
        destination,
      },
    ];
  },
};

import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzer(withPWA(nextConfig));
