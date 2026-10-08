import type { Metadata } from 'next';
import NotFoundPage from '@scenes/NotFoundPage';

export const metadata: Metadata = {
  title: 'Page not found',
};

export default function NotFound() {
  return <NotFoundPage />;
}
