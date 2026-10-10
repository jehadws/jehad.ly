import type { Metadata } from 'next';
import ContactsPage from '@scenes/ContactsPage';
import pageMetadata from '@constants/pageMetadata';
import siteMetadata from '@constants/siteMetadata';

export const metadata: Metadata = pageMetadata({
  title: 'Contacts',
  description: `Get in touch with the jehad.ly team about your next digital product — write us at ${siteMetadata.email}.`,
  path: '/contacts/',
});

export default function Contacts() {
  return <ContactsPage />;
}
