import type { ReactNode } from 'react';
import Shell from '@components/Shell';
import Footer from '@components/Footer';

export default function MainLayout({ children }: { children: ReactNode }) {
  return <Shell footer={<Footer />}>{children}</Shell>;
}
