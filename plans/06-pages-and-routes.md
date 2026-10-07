# Plan 06 — Pages and routes

**Status:** ⬜ TODO  
**Depends on:** Plan 05

## Goal

Create every route as a thin Server Component, with correct 404 and error handling, and the portfolio `[slug]` pages. The scenes the pages render still contain Gatsby code until Plan 07, so in dev a route only compiles once its scene is migrated. Create all routes now so Plan 07 can check each scene in the browser.

---

## Folder map

```
src/app/
├── layout.tsx                  (Plan 02)
├── global-error.tsx            errors thrown by the root layout
├── not-found.tsx               fallback 404 (no shell)
├── (main)/                     header + footer (Plan 05)
│   ├── layout.tsx
│   ├── error.tsx               runtime error boundary, renders inside the shell
│   ├── not-found.tsx           404 inside the shell
│   ├── [...rest]/page.tsx      catch-all → notFound(), so unknown URLs get the shell
│   ├── page.tsx                /
│   ├── portfolio/page.tsx
│   ├── portfolio/[slug]/page.tsx
│   ├── services/page.tsx
│   ├── contacts/page.tsx
│   └── error/page.tsx          /error (shown after a failed form submission)
└── (bare)/                     header only
    ├── layout.tsx
    └── thanks/page.tsx
```

Old routes → new: `index`, `portfolio`, `services`, `contacts`, `thanks`, `error` (page), `404` → as above. `blog` is gone (Plan 03).

`(main)/error.tsx` (the boundary) and `(main)/error/page.tsx` (the form-failure page) live side by side without conflict: one is a file convention, the other a URL segment. Keep the URL `/error/` to preserve the old behaviour.

## Page templates

Check each old page for `<Layout …props>` in `/tmp/layout-props.txt` and add `<ShellOptions … />` (Plan 05) where props were used.

```tsx
// src/app/(main)/page.tsx
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
```

```tsx
// src/app/(main)/portfolio/page.tsx; services and contacts follow the same shape
import type { Metadata } from 'next';
import PortfolioPage from '@scenes/PortfolioPage';

export const metadata: Metadata = {
  title: 'Portfolio', // template adds " | Jehad.Pro"
  description: 'Selected projects.', // ⚠ real copy in Plan 09
};

export default function Portfolio() {
  return <PortfolioPage />;
}
```

Services → `ServicesPage`, title `'Services'`. Contacts → `ContactsPage`, title `'Contact'`.

```tsx
// src/app/(bare)/thanks/page.tsx
import type { Metadata } from 'next';
import ThanksPage from '@scenes/ThanksPage';

export const metadata: Metadata = { title: 'Thank you', robots: { index: false } };

export default function Thanks() {
  return <ThanksPage />;
}
```

```tsx
// src/app/(main)/error/page.tsx
import type { Metadata } from 'next';
import ErrorPage from '@scenes/ErrorPage';

export const metadata: Metadata = { title: 'Something went wrong', robots: { index: false } };

export default function ErrorRoute() {
  return <ErrorPage />;
}
```

## 404 and error boundaries

```tsx
// src/app/(main)/[...rest]/page.tsx
import { notFound } from 'next/navigation';

export default function CatchAll() {
  notFound();
}
```

```tsx
// src/app/(main)/not-found.tsx, and the same file as src/app/not-found.tsx
import NotFoundPage from '@scenes/NotFoundPage';

export default function NotFound() {
  return <NotFoundPage />;
}
```

Next adds `noindex` to 404 responses on its own, so no metadata export is needed there.

```tsx
// src/app/(main)/error.tsx: plain content, NO <html>/<body>; it renders inside the layouts
'use client';

import { useEffect } from 'react';

export default function RouteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => console.error(error), [error]);
  return (
    <div>
      <h2>Something went wrong.</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

```tsx
// src/app/global-error.tsx: only this file owns <html><body>; it replaces the root layout
'use client';

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body>
        <h2>Something went wrong.</h2>
        <button onClick={reset}>Try again</button>
      </body>
    </html>
  );
}
```

## Portfolio `[slug]`

Replaces `createPages()` in `gatsby-node.js`. Open `_gatsby/gatsby-node.js` and `_gatsby/templates/Project/` first: **⚠ VERIFY** what context the template received (`data`, `next`) and how "next project" was linked.

```tsx
// src/app/(main)/portfolio/[slug]/page.tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProjectTemplate from '@scenes/templates/Project';
import projects from '@data/projects';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false; // unknown slugs → 404, no on-demand render

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return { title: project.title, description: project.excerpt };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();

  const next = projects[(index + 1) % projects.length];
  return <ProjectTemplate data={projects[index]} next={next} />;
}
```

Move the template:

```bash
mkdir -p src/scenes/templates
git mv _gatsby/templates/Project src/scenes/templates/Project
```

In the template:

- `pageContext: { data, next }` → props typed with `Project` from `@data/projects`
- `Link` swap (`to=` → `href=`; link to `/portfolio/${next.slug}/`)
- `GatsbyImage`/`getImage` → `<Image>`. The featured image is a **URL string** (`/projects/…` in `public/`), so it needs real dimensions. Get them once:
  ```bash
  node -e "const s=require('sharp'),fs=require('fs');(async()=>{for(const f of fs.readdirSync('public/projects')){const m=await s('public/projects/'+f).metadata();console.log(f,m.width,m.height)}})()"
  ```
  If every image shares one aspect ratio, use it for `width`/`height`; otherwise add `width`/`height` fields to `projects.ts` and use them. Add `style={{ width: '100%', height: 'auto' }}` (or let the SCSS class size it).
- `'use client'` only if the template really uses state/effects/refs (the build tells you in Plan 07)

## Verify

- [ ] Every route in the map exists and renders (after its scene is migrated in Plan 07)
- [ ] `curl -I http://localhost:3000/nonexistent/` → `404`, and the page shows the header and footer
- [ ] `/portfolio/<a real slug>/` renders; `/portfolio/nope/` → 404
- [ ] `/blog/` → redirects to `/`
- [ ] `/thanks/` has no footer; `/thanks/` and `/error/` have `<meta name="robots" content="noindex">`
- [ ] Titles: home has no doubled `| Jehad.Pro`; other pages read `Page | Jehad.Pro`
- [ ] `app/(main)/error.tsx` returns no `<html>`; only `global-error.tsx` does
- [ ] `grep -rn "<Layout\|return null" src/app` → nothing
