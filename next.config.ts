import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  trailingSlash: true, // matches Gatsby URLs
  images: { formats: ['image/avif', 'image/webp'] },
  sassOptions: {
    // Replaces gatsby-plugin-alias-imports for SCSS:
    // @import 'variables/all'  resolves from src/styles
    // @import 'functions'       resolves from src/styles/functions
    loadPaths: ['./src/styles', './src/styles/functions'],
  },
  experimental: {
    serverActions: { bodySizeLimit: '10mb' }, // Plan 08: attachments (default is 1 MB)
  },
  async redirects() {
    return [
      // Plan 03: blog removed. Temporary on purpose; switch to permanent once you're sure.
      { source: '/blog', destination: '/', permanent: false },
      { source: '/blog/:path*', destination: '/', permanent: false },
    ];
  },
  async headers() {
    return [
      // Plan 10: the self-removing service worker must never be cached
      {
        source: '/sw.js',
        headers: [{ key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' }],
      },
    ];
  },
};

export default nextConfig;
