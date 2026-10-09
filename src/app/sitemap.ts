import type { MetadataRoute } from 'next';
import projects from '@data/projects';
import siteMetadata from '@constants/siteMetadata';

// `trailingSlash: true`, so every URL here carries its slash to avoid a redirect in the index.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const pages = ['/', '/services/', '/portfolio/', '/contacts/'].map((path) => ({
    url: `${siteMetadata.siteUrl}${path}`,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: path === '/' ? 1 : 0.7,
  }));

  const portfolio = projects.map((project) => ({
    url: `${siteMetadata.siteUrl}/portfolio/${project.slug}/`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...pages, ...portfolio];
}
