import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { cairo, gramatika, sofiaPro } from '@styles/fonts';
import '@styles/index.scss';
import Providers from '@components/Providers';
import JsonLd from '@components/JsonLd';
import siteMetadata from '@constants/siteMetadata';

export const metadata: Metadata = {
  metadataBase: new URL(siteMetadata.siteUrl),
  title: {
    default: siteMetadata.defaultTitle,
    template: `%s | ${siteMetadata.title}`, // pages that set `title: 'Portfolio'` → "Portfolio | Jehad.Pro"
  },
  description: siteMetadata.description,
  authors: [{ name: siteMetadata.author }],
  alternates: { canonical: './' }, // metadataBase alone does NOT emit canonical tags; this does, per route
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: '/apple-touch-icon.png',
  },
  // iOS installs read these meta tags instead of manifest.ts
  appleWebApp: {
    capable: true,
    title: siteMetadata.title,
    statusBarStyle: 'black-translucent',
  },
  openGraph: {
    title: siteMetadata.defaultTitle,
    description: siteMetadata.description,
    url: siteMetadata.siteUrl,
    siteName: siteMetadata.title,
    locale: 'en_US',
    type: 'website',
    images: [{ url: '/tile-512.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteMetadata.defaultTitle,
    description: siteMetadata.description,
    images: ['/tile-256.png'],
  },
};

export const viewport: Viewport = { themeColor: '#02021e' };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${sofiaPro.variable} ${gramatika.variable} ${cairo.variable}`}>
      <body>
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: siteMetadata.title,
            url: siteMetadata.siteUrl,
            logo: `${siteMetadata.siteUrl}/logo.svg`,
            sameAs: siteMetadata.sameAs,
          }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
