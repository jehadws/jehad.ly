import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProjectTemplate from '@scenes/templates/Project';
import JsonLd from '@components/JsonLd';
import projects from '@data/projects';
import pageMetadata from '@constants/pageMetadata';
import siteMetadata from '@constants/siteMetadata';

type Props = { params: Promise<{ slug: string }> };

// Unknown slugs → 404 at build time, no on-demand render
export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return pageMetadata({
    title: project.title,
    description: project.excerpt,
    path: `/portfolio/${project.slug}/`,
    images: [project.featured_media.source_url],
  });
}

export default async function ProjectRoute({ params }: Props) {
  const { slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();

  const project = projects[index];
  const next = projects[(index + 1) % projects.length];
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: project.title,
          description: project.excerpt,
          image: `${siteMetadata.siteUrl}${project.featured_media.source_url}`,
          datePublished: project.date,
          author: { '@type': 'Organization', name: siteMetadata.title },
          publisher: {
            '@type': 'Organization',
            name: siteMetadata.title,
            url: siteMetadata.siteUrl,
          },
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${siteMetadata.siteUrl}/portfolio/${project.slug}/`,
          },
        }}
      />
      <ProjectTemplate data={project} next={next} />
    </>
  );
}
