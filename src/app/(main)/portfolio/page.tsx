import type { Metadata } from 'next';
import PortfolioPage from '@scenes/PortfolioPage';
import siteMetadata from '@constants/siteMetadata';

export const metadata: Metadata = {
  title: 'Portfolio',
  description: siteMetadata.description,
};

export default function Portfolio() {
  return <PortfolioPage />;
}
