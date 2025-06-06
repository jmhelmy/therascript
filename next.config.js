/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ Instruct Next.js to produce a standalone build folder
  output: 'standalone',

  // ✅ Configure any external image domains you need
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

  // 🚨 DO NOT include the webpack property anymore!
};

module.exports = nextConfig;
