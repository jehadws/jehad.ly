import type { Metadata } from 'next';
import PortfolioPage from '@scenes/PortfolioPage';
import pageMetadata from '@constants/pageMetadata';

export const metadata: Metadata = pageMetadata({
  title: 'Portfolio',
  description:
    'Selected case studies from the jehad.ly studio: design-driven web development, from strict insurance platforms to dynamic music applications.',
  path: '/portfolio/',
});

export default function Portfolio() {
  return <PortfolioPage />;
}
