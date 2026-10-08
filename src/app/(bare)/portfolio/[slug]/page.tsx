import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProjectTemplate from '@scenes/templates/Project';
import projects from '@data/projects';

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
  return { title: project.title, description: project.excerpt };
}

export default async function ProjectRoute({ params }: Props) {
  const { slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();

  const next = projects[(index + 1) % projects.length];
  return <ProjectTemplate data={projects[index]} next={next} />;
}
