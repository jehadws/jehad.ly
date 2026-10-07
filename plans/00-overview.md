# Gatsby → Next.js 16 migration — jehad.ly

**Revision 4.** Written without access to `src/`, so every step that depends on code I haven't seen is marked **⚠ VERIFY**, with the command that gives the real answer.

## Scope

- **Stage 1 (Plans 01–10):** port the Gatsby site to Next.js 16 (App Router), keeping SCSS Modules so the port stays mechanical, clean out third-party content, and launch.
- **Stage 2 (Plan 11):** add Tailwind v4 and move the UI over piece by piece.

## Decisions I made so you don't have to

Change any of these in one place and the later plans still hold.

| Topic | Decision | Why |
|---|---|---|
| Site URL | One constant, `siteMetadata.siteUrl`, from `NEXT_PUBLIC_SITE_URL`, default `https://jehad.ly` | Earlier plans mixed `jehad.pro` and `jehad.ly`. **⚠ Confirm which is production.** |
| Blog | **Removed** (Plan 03), `/blog` redirects to `/` | API is dead, there are no posts. Add MDX later as its own plan. |
| Dead code | `Gallery` and `MailUs` (commented out in production) are deleted, not migrated | Less to port. It's all in git history. |
| Carousels | `swiper` only; each replaced slider is its own commit | `react-slick` and `react-id-swiper` are dated or unmaintained. |
| Images | Import from `src/assets` → `<Image>` for rasters, `.src` for SVGs. `public/` only for `static/` content and the video | Next reads dimensions from imports. |
| SVG components | One-off SVGR CLI conversion to `.tsx` | No bundler loader config to break. |
| Fonts | `next/font` | Self-hosted, no layout shift. Licensing is checked in Plan 09. |
| Layout | Two route groups: `(main)` with footer, `(bare)` without. One client `Shell`. Per-page header options via `<ShellOptions />` | Header/footer mount once. Replaces the `<Layout>` wrapper per page. |
| Contact form | Server Action → your existing API, validated server-side | Honeypot and size limits must run on the server to count. |
| URLs | `trailingSlash: true` | Matches Gatsby, so no redirect rules. |
| Content & licence | Dedicated gate before launch (Plan 09) | The current copy, logos, clients and reviews don't look like yours. |
| Tailwind v4 | Stage 2 (Plan 11) | Your original goal. Sass and Tailwind can't mix in one file, so it comes after the port. |
| Hosting | Needs a Node runtime (Server Action), so no `output: 'export'` | |

## Plan order

| # | File | Focus | Replaces (old plan) |
|---|---|---|---|
| 01 | `01-scaffold.md` | Branch, scaffold, staging, deps, aliases, config, codemods | 01 |
| 02 | `02-root-layout.md` | Root layout, metadata, fonts, providers | 02 |
| 03 | `03-remove-blog-and-dead-code.md` | Delete blog, Gallery, MailUs | 09 (decided) |
| 04 | `04-assets-and-hooks.md` | GraphQL hooks → image constants, window-safe hooks | 04 |
| 05 | `05-shell-header-footer.md` | `Shell`, route-group layouts, Header, Menu, Footer, SVG icons | 03 + part of 06 |
| 06 | `06-pages-and-routes.md` | Pages, 404, error boundaries, portfolio `[slug]` | 06 + 07 |
| 07 | `07-scenes.md` | Scene-by-scene port, GatsbyImage → Image, carousels | 05 |
| 08 | `08-contact-form.md` | Server Action | 08 |
| 09 | `09-content-and-licensing.md` | Replace third-party content, fonts, logo | new |
| 10 | `10-seo-sw-launch.md` | SEO files, service worker, cleanup, deploy, cutover | 10 |
| 11 | `11-tailwind-v4.md` | Stage 2 | new |

Dependencies run forward: each plan assumes the ones before it are done.

## Conventions

- **Shell:** commands are bash (Git Bash on Windows). Node **≥ 20.9** (Next 16's minimum).
- **One commit per plan** (several for Plan 07, one per carousel swap).
- **Progress meter:** `npx tsc --noEmit 2>&1 | grep -c "error TS"`. After Plan 01 it will be large, because unmigrated files still import Gatsby. The rule is *no new errors in files you've already migrated*. It reaches zero at the end of Plan 07.
- **Rollback:** `main` stays untouched until Plan 10's cutover.

## Golden rules

1. **CSS Modules use the default import** (`import styles from './X.module.scss'`). Next's type declaration has no named exports. Plan 01 runs the codemod and a check script for kebab-case class names.
2. **`'use client'`** goes on the top-most file that uses state, effects, refs, context, `window`, event handlers, GSAP, react-spring, Swiper, react-tabs or react-intersection-observer. Descendants of a client file need nothing.
3. **`<Link href>`**, not `to`.
4. **Images:** rasters → `<Image src={imported} placeholder="blur" />`. SVGs → `<img src={imported.src} />`. Never `placeholder="blur"` on an SVG. `priority` on the LCP image only.
5. **`await params`** in every dynamic page. **`notFound()`**, never `return null`.
6. **Server and first client render must match.** Hooks that read `window` start from a fixed value and update in an effect.
7. **No `gatsby` import survives.**
8. **Don't edit `.module.scss` files** in stage 1. Stage 2 deletes them one at a time.

## Inventory commands

Run these once now and keep the output. Several plans refer to them.

```bash
grep -rln "from 'gatsby'\|from \"gatsby\"" src          # everything that must change
grep -rln "gatsby-plugin-image" src                      # GatsbyImage / StaticImage users
grep -rln "hooks/queries" src                            # GraphQL hook consumers
grep -rln "\.inline\.svg" src                            # SVGs used as components
grep -rln "\.publicURL" src                              # SVG/URL assets from GraphQL
grep -rln "react-slick\|react-id-swiper\|swiper" src     # carousels
grep -rln "import \* as .* from '.*\.module\.scss'" src | wc -l   # CSS Module imports
grep -rln "window\.\|document\." src                     # browser-only access
grep -rn "<Layout" src                                   # per-page Layout props (run BEFORE Plan 01)
grep -rnE "@(use|import|forward) ['\"]@" src             # SCSS imports that use path aliases
```

## Definition of done

- [ ] `npx tsc --noEmit` — zero errors
- [ ] `npm run build` — exit 0
- [ ] `grep -rln "gatsby" src package.json` — nothing
- [ ] `grep -rln "import \* as .* from '.*\.module\.scss'" src` — nothing
- [ ] Plan 09 checklist passes (no third-party content, fonts licensed)
- [ ] Plan 10 acceptance list passes
