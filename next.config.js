/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: false,
  compiler: {
    removeConsole: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    webpackBuildWorker: true,
  },
  webpack: (config, { dev, isServer }) => {
    // Disable webpack caching in development to prevent cache corruption
    if (dev) {
      config.cache = false;
    }
    
    // Ensure proper file system handling
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/.next/**', '**/node_modules/**'],
    };
    
    return config;
  },
};

module.exports = nextConfig;