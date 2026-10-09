import type { MetadataRoute } from 'next';
import siteMetadata from '@constants/siteMetadata';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // both pages set `robots: { index: false }`; keep them out of the crawl too
      disallow: ['/thanks/', '/error/'],
    },
    sitemap: `${siteMetadata.siteUrl}/sitemap.xml`,
    host: siteMetadata.siteUrl,
  };
}
