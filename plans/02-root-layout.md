# Plan 02 — Root layout, metadata, fonts, providers

**Status:** ⬜ TODO  
**Depends on:** Plan 01

## Goal

Replace `gatsby-browser.ts`, `gatsby-config.ts` metadata and the `Head` export with a real root layout. Titles don't double up, canonical tags are emitted, and fonts come from `next/font`.

---

## Step 1 — Read what Gatsby did globally

**⚠ VERIFY** `_gatsby/gatsby-browser.ts`. Whatever it imports (global SCSS, polyfills) or wraps (`wrapRootElement` → providers) has to be reproduced in `layout.tsx`. The rest of this plan assumes it imports `src/styles/index.scss` and wraps the app in `Providers`.

## Step 2 — Site constants

```ts
// src/constants/siteMetadata.ts
// ⚠ Placeholder copy: Plan 09 replaces it. The URL is the only value that matters now.
const siteMetadata = {
  title: 'Jehad.Pro',
  defaultTitle: 'Web Design and Development Services | Jehad.Pro',
  description:
    'Experts from all your network providers integrated into one powerful platform.',
  author: '@jehadabdulwafi',
  email: 'hello@jehad.pro',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://jehad.ly',
  sameAs: ['https://github.com/jehadws'],
};

export default siteMetadata;
```

Every URL in the project (metadata, sitemap, robots, JSON-LD) reads `siteUrl`. Never hard-code a domain elsewhere.

## Step 3 — Fonts

```bash
ls -R src/assets/fonts                                    # real file names
grep -rhoE "font-weight: *[0-9]+" src | sort | uniq -c    # weights you actually use
grep -rn "font-family\|@font-face" src/styles | head -30
```

```ts
// src/styles/fonts.ts
import localFont from 'next/font/local';
import { Cairo } from 'next/font/google';

// ⚠ Paths and weights below are guesses. Match them to the `ls` output above.
export const sofiaPro = localFont({
  src: [
    { path: '../assets/fonts/SofiaPro/SofiaPro-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../assets/fonts/SofiaPro/SofiaPro-Medium.woff2', weight: '500', style: 'normal' },
    { path: '../assets/fonts/SofiaPro/SofiaPro-Bold.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-sofia-pro',
  display: 'swap',
});

export const gramatika = localFont({
  src: [
    { path: '../assets/fonts/Gramatika/Gramatika - Regular.woff2', weight: '400', style: 'normal' },
    { path: '../assets/fonts/Gramatika/Gramatika - Bold.woff2', weight: '700', style: 'normal' },
    { path: '../assets/fonts/Gramatika/Gramatika - Black.woff2', weight: '900', style: 'normal' },
  ],
  variable: '--font-gramatika',
  display: 'swap',
});

export const cairo = Cairo({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-cairo',
  display: 'swap',
});
```

Notes:

- `next/font/google` downloads Cairo at **build time**. If your build machine has no internet, self-host the Cairo files with `localFont` instead.
- Your SCSS has both `sofia-pro` and `sofia-pro-soft`. If "Soft" is a separate font family with its own files, give it its own `localFont` and variable (`--font-sofia-pro-soft`) instead of aliasing it to Sofia Pro.
- Sofia Pro and Gramatika are commercial typefaces. Plan 09 decides whether you may keep them.

Update the SCSS font variables (in `src/styles/variables/fonts.scss` or wherever `grep` shows them):

```scss
$font-sofia-pro:      var(--font-sofia-pro), sans-serif;
$font-sofia-pro-soft: var(--font-sofia-pro), sans-serif; // or its own variable, see above
$font-gramatika:      var(--font-gramatika), sans-serif;
$font-cairo:          var(--font-cairo), sans-serif;
```

Then delete every `@font-face` block and the Google Fonts `@import url(...)` from `src/styles/fonts.scss`. **⚠ VERIFY** nothing in SCSS does Sass math or functions on these variables.

## Step 4 — Providers

```tsx
// src/components/Providers/Providers.tsx
'use client';

import type { ReactNode } from 'react';
import { MenuContext } from '@contexts/index';
import { useIsOpened } from '@hooks/index';

export default function Providers({ children }: { children: ReactNode }) {
  const menuState = useIsOpened();
  return <MenuContext.Provider value={menuState}>{children}</MenuContext.Provider>;
}
```

`useIsOpened` is fixed for SSR in Plan 04.

## Step 5 — JSON-LD helper

```tsx
// src/components/JsonLd/JsonLd.tsx
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // `<` is escaped so content can never close the script tag
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
```

(Add an `index.ts` re-export if your other components use that pattern.)

## Step 6 — Root layout

```tsx
// src/app/layout.tsx
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
    card: 'summary',
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
```

How pages set titles (used in Plan 06):

```ts
title: 'Portfolio'                                  // → "Portfolio | Jehad.Pro"
title: { absolute: siteMetadata.defaultTitle }      // home: no template
```

The layout does not render the header, footer or scroll logic. That lives in the route-group layouts (Plan 05).

## Verify

- [ ] `npm run dev` compiles with no font or SCSS errors; fonts look right next to the Gatsby build
- [ ] `<html>` carries the three `--font-*` variable classes (DevTools)
- [ ] View source: one `<title>`, a `<link rel="canonical" href="https://…/">` that matches the URL including the trailing slash, JSON-LD with `"@context": "https://schema.org"`
- [ ] No `@font-face` or Google CDN import left in SCSS: `grep -rn "@font-face\|fonts.googleapis" src`
- [ ] No Gatsby imports in files touched here
