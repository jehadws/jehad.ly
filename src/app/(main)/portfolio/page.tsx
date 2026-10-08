import type { Metadata } from 'next';
import PortfolioPage from '@scenes/PortfolioPage';

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'Selected projects.', // ⚠ real copy in Plan 09
};

export default function Portfolio() {
  return <PortfolioPage />;
}
