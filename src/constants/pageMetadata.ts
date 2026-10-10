import type { Metadata } from 'next';
import siteMetadata from './siteMetadata';

type Options = {
  title: string;
  description: string;
  path: string;
  images?: string[];
};

// The root layout's openGraph defaults would otherwise repeat the homepage OG
// tags on every page; this overrides title/description/url (and images) per route.
export default function pageMetadata({ title, description, path, images }: Options): Metadata {
  const openGraph = {
    title: `${title} | ${siteMetadata.title}`,
    description,
    url: path,
    ...(images && { images }),
  };
  return {
    title,
    description,
    openGraph,
    twitter: {
      card: 'summary_large_image',
      title: openGraph.title,
      description: openGraph.description,
      ...(images && { images }),
    },
  };
}
