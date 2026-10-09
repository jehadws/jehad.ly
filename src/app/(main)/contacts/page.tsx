import type { Metadata } from 'next';
import ContactsPage from '@scenes/ContactsPage';
import siteMetadata from '@constants/siteMetadata';

export const metadata: Metadata = {
  title: 'Contacts',
  description: siteMetadata.description,
};

export default function Contacts() {
  return <ContactsPage />;
}
