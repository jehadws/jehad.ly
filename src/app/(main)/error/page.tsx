import type { Metadata } from 'next';
import ErrorPage from '@scenes/ErrorPage';

export const metadata: Metadata = {
  title: 'Something went wrong',
  robots: { index: false },
};

export default function ErrorRoute() {
  return <ErrorPage />;
}
