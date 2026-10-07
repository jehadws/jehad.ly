# Plan 07 — Scenes

**Status:** ⬜ TODO  
**Depends on:** Plans 04 + 05 + 06

## Goal

Port every scene and component that still has Gatsby code. Do the mechanical changes with codemods first, then work through the scenes from simple to complex, checking each one in the browser at its route.

---

## Step 1 — Mechanical sweep

```bash
# Gatsby <Link> → next/link
grep -rl "from 'gatsby'" src | xargs -r sed -i -E "s#import \{ Link \} from 'gatsby';?#import Link from 'next/link';#"
# `to=` → `href=` (single-line cases; tsc finds the multi-line ones because Link requires href)
grep -rl "<Link" src | xargs -r sed -i -E 's#(<Link[^>]*) to=#\1 href=#g'

# what's left that mentions Gatsby
grep -rn "from 'gatsby'\|gatsby-plugin-image" src
```

Props that `next/link` doesn't have (`activeClassName`, `partiallyActive`, `state`) show up as type errors. Handle them one by one; `activeClassName` can be done with `usePathname()` in a client component.

## Step 2 — `GatsbyImage` → `Image`

Files that currently use `gatsby-plugin-image` (from your own grep):

```
src/scenes/HomePage/components/Hero/Folder/Folder.tsx
src/scenes/HomePage/components/Works/components/Item/Item.tsx
src/scenes/HomeProjects/components/List/components/ProjectScene/ProjectScene.tsx
src/scenes/HomeProjects/components/List/components/Slider/components/Item.tsx
src/scenes/Projects/components/List/components/ProjectScene/ProjectScene.tsx
```

(`Gallery/*` and `Posts/*` from that list were deleted in Plan 03.)

```tsx
// before
const image = getImage(data.hero_01.childImageSharp.gatsbyImageData);
<GatsbyImage image={image!} alt="…" className={styles.image} />

// after (data comes from the constants module, Plan 04)
<Image src={homeHeroImages.hero_01} alt="…" className={styles.image} placeholder="blur" />
```

Differences to watch:

- `GatsbyImage` rendered a wrapper `<div>` and an inner image. `Image` renders only `<img>`. SCSS that targets the wrapper or `.className img` needs a look. This is the most likely source of visual diffs.
- If the old CSS sized the wrapper, either put the class on `<Image>` or use `fill` inside a `position: relative` container.
- `loading="eager"` → `priority`. Use `priority` only on the first hero image (the LCP image).
- `objectFit` / `objectPosition` props → `style={{ objectFit: 'cover' }}`.
- Add `sizes` to large responsive images so the browser doesn't fetch the biggest variant on phones.
- `placeholder="blur"` only on rasters, never SVG.
- SVGs are `<img src={x.src} alt="…" />`.

## Step 3 — Client boundaries

Don't guess. Run the build and let it tell you:

```bash
npm run build 2>&1 | grep -B1 -A3 "use client\|useState\|useEffect\|createContext"
```

Add `'use client'` to the **top-most** file in each client subtree (descendants inherit it). Typical ones: `HomePage.tsx`, anything with Swiper, GSAP, react-spring, react-tabs, `react-intersection-observer`, the breakpoint hooks, and click handlers. Static pages (Thanks, NotFound, Error) should stay server components.

## Step 4 — Home page mouse animation

`_gatsby/pages/index.tsx` created a react-spring `useSpring` and passed it to `HomePage` as `animation`. Smallest change: move the `useSpring` call and the `onMouseMove` handler into `HomePage.tsx` (client) and pass it to `Hero` exactly as before. `Hero`'s props stay unchanged, and nothing else moves.

## Step 5 — Carousels (one commit each)

```bash
grep -rln "react-slick\|react-id-swiper" src   # these two packages are already uninstalled, so these files fail typecheck
```

For each usage (including the shared `src/components/Slider`), port to Swiper:

```tsx
'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

<Swiper modules={[Navigation, Pagination]} slidesPerView={1} spaceBetween={30} loop>
  {items.map((i) => <SwiperSlide key={i.id}>…</SwiperSlide>)}
</Swiper>
```

| react-slick | Swiper |
|---|---|
| `slidesToShow` | `slidesPerView` |
| `infinite` | `loop` |
| `dots` | `modules={[Pagination]}` + `pagination` |
| `arrows` | `modules={[Navigation]}` + `navigation` |
| `autoplay` / `autoplaySpeed` | `Autoplay` module / `autoplay={{ delay }}` |
| `responsive: [{ breakpoint, settings }]` | `breakpoints={{ 768: { … } }}` (min-width, not max-width) |

Swiper isn't a drop-in for slick: arrows, spacing and breakpoints behave differently. This is the one place the "pixel-perfect" goal needs a manual look.

## Step 6 — Scene order and checks

Work in this order, and open the route as you finish each one:

1. `ThanksPage`, `NotFoundPage`, `ErrorPage` (static; likely no client code)
2. `ContactsPage` (the `Form` is only codemodded here; Plan 08 rewires it)
3. `ServicesPage` (tabs/switchers → client)
4. `PortfolioPage`
5. `Projects`, `HomeProjects`
6. `HomePage` sub-sections last: `Hero` (react-spring), `WhatWeDo`, `Works`, `Testimonials`
7. Shared components: `PageMessage`, `ScrollGallery`, `SlideHover`, `Slider` (+ its `Arrow`)

For each: no Gatsby imports, no `tsc` errors, no 404s in the Network tab, animations still run, links navigate without a full reload, screenshot against the Gatsby build.

## Step 7 — Finish

```bash
grep -rn "hooks/queries" src              # → nothing
grep -rln "gatsby" src                    # → nothing (Form.tsx keeps axiosClient until Plan 08)
npx tsc --noEmit                          # → zero errors, or only the Form's axios import
```

## Verify

- [ ] `npx tsc --noEmit` clean (except `Form.tsx` if Plan 08 isn't done)
- [ ] `npm run build` succeeds
- [ ] Every route in Plan 06's map renders and matches the Gatsby build visually
- [ ] No `react-slick`, `react-id-swiper`, `gatsby-*` references anywhere in `src`
- [ ] Hero image (and only that image) has `priority`
