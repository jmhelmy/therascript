import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Your original setting is preserved
  eslint: {
    ignoreDuringBuilds: true,
  },

  // The new, required setting for external images
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