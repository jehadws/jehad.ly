import type { ReactNode } from 'react';
import Shell from '@components/Shell';
import Footer from '@components/Footer';
import MailUs from '@scenes/MailUs';

export default function MainLayout({ children }: { children: ReactNode }) {
  return <Shell footer={<Footer />}>
    {children}
    <MailUs />
  </Shell>;
}
