import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Allow ESLint errors during builds
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Ignore Next.js TypeScript errors at build time
  typescript: {
    ignoreBuildErrors: true,
  },

  // Your existing remotePatterns config for external images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
