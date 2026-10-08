import type { Metadata } from 'next';
import HomePage from '@scenes/HomePage';
import siteMetadata from '@constants/siteMetadata';

export const metadata: Metadata = {
  title: { absolute: siteMetadata.defaultTitle },
  description: siteMetadata.description,
};

export default function Home() {
  return <HomePage />;
}
