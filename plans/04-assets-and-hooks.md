# Plan 04 — Assets and hooks

**Status:** ⬜ TODO  
**Depends on:** Plans 01 + 03

## Goal

Replace every GraphQL asset hook with a plain constants module that has **the same keys**, so components change by one line instead of being rewritten. Then make the browser-reading hooks safe for server rendering.

The old hooks are in `_gatsby/hooks-queries/` for reference. Each hook's `graphql` query lists exactly which files it loaded.

---

## Step 1 — One constants module per hook

| Old hook | New module (`src/constants/images/`) |
|---|---|
| `useHeaderAssets` | `headerImages.ts` |
| `useMenuAssets` | `menuImages.ts` |
| `useFooterAssets` | `footerImages.ts` |
| `useBackgroundsAssets` | `backgroundImages.ts` |
| `useContactsAssets` | `contactsImages.ts` |
| `useHomeHeroAssets` | `homeHeroImages.ts` |
| `useHomeWorksAssets` | `homeWorksImages.ts` |
| `useTestimonialsAssets` | `testimonialsImages.ts` |
| `useProjectsAssets` | `projectsImages.ts` |
| `usePortfolioClientsAssets` | `portfolioClientsImages.ts` |
| `usePortfolioWorksAssets` | `portfolioWorksImages.ts` |
| `useServicesDesignAssets` | `servicesDesignImages.ts` |
| `useServicesDevelopmentAssets` | `servicesDevelopmentImages.ts` |
| `useServicesIndustriesAssets` | `servicesIndustriesImages.ts` |
| `useServicesTechnologiesAssets` | `servicesTechnologiesImages.ts` |
| `useSiteMetadata` | already `siteMetadata.ts` (Plan 02) |

(Blog, gallery and site-pages hooks were deleted in Plan 03.)

Template. Import each file, export an object with the **same keys the hook returned**:

```ts
// src/constants/images/homeHeroImages.ts
import hero_01 from '@assets/images/sections/home-hero/gold/home-hero_01.webp';
import hero_02 from '@assets/images/sections/home-hero/gold/home-hero_02.webp';
import clutchBackground from '@assets/images/sections/home-hero/clutch-background.png';
import clutchLogotype from '@assets/images/brands/clutch.svg'; // SVG: used with `.src`

export const homeHeroImages = { hero_01, hero_02, clutchBackground, clutchLogotype };
```

Rules:

- Raster imports (`.jpg`, `.jpeg`, `.png`, `.webp`) are `StaticImageData`; pass them straight to `<Image>`.
- SVG imports are `{ src, width, height }`; use `.src` in `<img>`.
- If a hook returned a **list** (`allFile`, `edges`, `nodes`), write the array out with explicit imports. `import.meta.glob` and `require.context` don't work under Turbopack.
- **⚠ VERIFY** key names and paths against each hook's query before writing the module.

## Step 2 — How components change

| Old | New |
|---|---|
| `const data = useHomeHeroAssets()` | `const data = homeHeroImages` (or import the object directly) |
| `getImage(data.hero_01.childImageSharp.gatsbyImageData)` | `data.hero_01` |
| `data.clutchLogo.publicURL` | `data.clutchLogo.src` |

The `publicURL` → `src` change is mechanical, so do it now across the project:

```bash
grep -rl "\.publicURL" src | xargs -r sed -i 's/\.publicURL/.src/g'
```

Components still call the deleted hooks until Plan 07 migrates them. Those `Cannot find module '@hooks/queries'` errors are your to-do list:

```bash
npx tsc --noEmit 2>&1 | grep "hooks/queries" | cut -d'(' -f1 | sort -u
```

## Step 3 — What belongs in `public/`

Only things referenced by a **URL string**, not by `import`:

- everything from the old `static/` (done in Plan 01), including `/projects/*` and `/companies/*` that `projects.ts` points at
- `/videos/Mirror.mp4` (done in Plan 01)
- `sw.js`, `logo.svg`, icons and OG images (Plan 10)

Menu icons, brand logos, laurels, technology icons and services SVGs are **not** copied to `public/`; they're imported in the constants modules above.

## Step 4 — Make window-reading hooks SSR-safe

```bash
grep -ln "window\.\|document\." src/hooks/*.ts src/contexts/* src/helpers/* 2>/dev/null
```

`useBreakPoints`, `useResize`, `useHeaderIsWhite` and possibly `useIsOpened` are the candidates. Pattern: the first client render must equal the server render, so start with a fixed value and read the browser in an effect.

```ts
// useBreakPoints.ts: adapt to the shape your hook actually returns
import { useEffect, useState } from 'react';

export default function useBreakPoints() {
  const [width, setWidth] = useState<number | undefined>(undefined);

  useEffect(() => {
    const update = () => setWidth(window.innerWidth);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return {
    isMobile: width !== undefined && width < 768,
    isTablet: width !== undefined && width < 1024,
    // ...keep your existing breakpoints and names
  };
}
```

Use your existing numbers and return shape, not these. Two consequences:

- For one frame after load, hooks report "desktop". Layout that can be done with CSS media queries should stay in CSS; use the hooks only for behaviour.
- Every file using these hooks needs `'use client'` (Plan 07 picks that up).

Final `src/hooks/index.ts`:

```ts
export { default as useBreakPoints } from './useBreakPoints';
export { default as useHeaderIsWhite } from './useHeaderIsWhite';
export { default as useIsOpened } from './useIsOpened';
export { default as useResize } from './useResize';
```

## Verify

- [ ] `src/constants/images/` has one module per row above, and every key the old hooks returned exists
- [ ] `grep -rn "useStaticQuery\|graphql" src` → nothing
- [ ] `grep -rn "\.publicURL" src` → nothing
- [ ] No `window`/`document` access during render in any hook (only inside effects or handlers)
- [ ] The list of files still importing `hooks/queries` is written down for Plan 07
