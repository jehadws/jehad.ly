import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  trailingSlash: true, // matches the URLs the Gatsby site published
  images: { formats: ['image/avif', 'image/webp'] },
  sassOptions: {
    // lets SCSS `@import 'variables/all'` resolve from src/styles
    // and `@import 'functions'` resolve from src/styles/functions
    loadPaths: ['./src/styles', './src/styles/functions'],
  },
  experimental: {
    serverActions: { bodySizeLimit: '10mb' }, // form attachments; Next's default is 1 MB
  },
  async redirects() {
    return [
      // temporary on purpose until the blog removal is final — then switch to permanent
      { source: '/blog', destination: '/', permanent: false },
      { source: '/blog/:path*', destination: '/', permanent: false },
    ];
  },
  async headers() {
    return [
      // never cache the self-removing service worker, or it outlives the site it replaces
      {
        source: '/sw.js',
        headers: [{ key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' }],
      },
    ];
  },
};

export default nextConfig;
