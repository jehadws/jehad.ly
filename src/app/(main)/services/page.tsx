import type { Metadata } from 'next';
import ServicesPage from '@scenes/ServicesPage';
import pageMetadata from '@constants/pageMetadata';

export const metadata: Metadata = pageMetadata({
  title: 'Services',
  description:
    'We offer to get acquainted with tools that we use in our studio to create the wonders of the digital world.',
  path: '/services/',
});

export default function Services() {
  return <ServicesPage />;
}
