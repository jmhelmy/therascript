// next.config.js
const path = require('path'); // Used for noParse if you need more complex path matching

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com', // Or your actual image patterns
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    console.log('SIMPLIFIED WEBPACK CONFIG (for dynamic imports test) IS RUNNING! isServer:', isServer);
    if (!isServer) {
      // Fallback for 'undici' - provide an empty module
      config.resolve.fallback = {
        ...(config.resolve.fallback || {}),
        undici: false,
      };

      // Optionally, keep noParse for undici as an extra measure,
      // though dynamic imports should ideally prevent Webpack from needing to parse it via Firebase.
      config.module = config.module || {};
      config.module.noParse = config.module.noParse || [];
      const undiciRegex = /node_modules[\\/]undici/; // Match undici anywhere in node_modules
      let noParseExists = config.module.noParse.some(r => r.source === undiciRegex.source);
      if (!noParseExists) {
        config.module.noParse.push(undiciRegex);
      }
    }
    return config;
  },
};
module.exports = nextConfig;