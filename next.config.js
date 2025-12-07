const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    MONGODB_DB: process.env.MONGODB_DB,
  },
  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
    };
    
    // הוסף fallback למקרה של בעיות ב-resolution
    config.resolve.extensions = ['.js', '.jsx', '.json'];
    
    return config;
  },
};

module.exports = nextConfig;