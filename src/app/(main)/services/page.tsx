import type { Metadata } from 'next';
import ServicesPage from '@scenes/ServicesPage';

export const metadata: Metadata = {
  title: 'Services',
  description:
    'We offer to get acquainted with tools that we use in our studio to create the wonders of the digital world.',
};

export default function Services() {
  return <ServicesPage />;
}
