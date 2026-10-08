import type { Metadata } from 'next';
import ThanksPage from '@scenes/ThanksPage';

export const metadata: Metadata = {
  title: 'Thank you',
  robots: { index: false },
};

export default function Thanks() {
  return <ThanksPage />;
}
