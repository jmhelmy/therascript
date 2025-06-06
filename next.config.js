const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
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
  webpack: (config, { isServer }) => {
    console.log('🧪 Webpack config loaded – checking alias for @');
    console.log('SIMPLIFIED WEBPACK CONFIG IS RUNNING! isServer:', isServer);

    if (!isServer) {
      config.resolve.fallback = {
        ...(config.resolve.fallback || {}),
        undici: false,
      };

      const undiciRegex = /node_modules[\\/]undici/;
      config.module.noParse = config.module.noParse || [];
      const alreadyExists = config.module.noParse.some(
        (r) => r instanceof RegExp && r.source === undiciRegex.source
      );
      if (!alreadyExists) {
        config.module.noParse.push(undiciRegex);
      }

      if (!Array.isArray(config.externals)) {
        config.externals = config.externals ? [config.externals] : [];
      }
      config.externals.push({
        'firebase-admin': 'commonjs firebase-admin',
      });
    }

    // 👇 THE ACTUAL FIX
    config.resolve.alias['@'] = path.join(__dirname, 'src');

    return config;
  },
};

module.exports = nextConfig;
