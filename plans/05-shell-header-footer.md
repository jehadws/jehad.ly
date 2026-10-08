# Plan 05 — Shell, Header, Menu, Footer

**Status:** ✅ DONE  
**Depends on:** Plans 02 + 03 + 04

## Goal

Header and footer mount **once** per route group and persist across navigation, instead of every page wrapping itself in `<Layout>`. `Footer` stays a Server Component. Per-page options that used to be `<Layout>` props still work.

---

## Step 1 — Read the old `Layout` before touching it

I haven't seen `src/components/Layout/Layout.tsx`, so this plan describes the transformation, not a rewrite.

```bash
cat /tmp/layout-props.txt                # saved in Plan 01: every <Layout ...> call and its props
sed -n '1,200p' src/components/Layout/Layout.tsx
```

Fill in this table before you start:

| Old `Layout` behaviour | New home |
|---|---|
| Scroll-hide header (`oldScrollPosition`, scroll listener) | `Shell` (a ref, not a module variable) |
| `MenuContext` consumption (`isOpened` forces header visible) | `Shell` |
| `HeaderGradientContext.Provider` | `Shell` (must wrap `{children}`, because pages call its setter) |
| Props `headerIsWhite`, `isGlow`, `withoutGradient` | `<ShellOptions />` (Step 3) |
| Prop `footerIsHide` | the `(bare)` route group (no footer) |
| `<Head>` export | gone (Plan 02) |
| Global SCSS import | gone (Plan 02) |

## Step 2 — Rename, don't rewrite

```bash
git mv src/components/Layout src/components/Shell
git mv src/components/Shell/Layout.tsx src/components/Shell/Shell.tsx
git mv src/components/Shell/Layout.module.scss src/components/Shell/Shell.module.scss
```

Update `src/components/Shell/index.ts` to export `Shell`, and fix imports: `grep -rn "@components/Layout" src`.

## Step 3 — Per-page options without a prop

Pages are Server Components and can't pass props up to a layout, so a tiny client component sets the options in context instead.

```ts
// src/contexts/ShellOptionsContext.ts
'use client';
import { createContext } from 'react';

export type ShellOptionsValue = { headerIsWhite: boolean; isGlow: boolean; withoutGradient: boolean };

// ⚠ VERIFY the old defaults in Layout.tsx (isGlow used to default to true)
export const DEFAULT_SHELL_OPTIONS: ShellOptionsValue = {
  headerIsWhite: false,
  isGlow: true,
  withoutGradient: false,
};

export const ShellOptionsContext = createContext<{
  options: ShellOptionsValue;
  setOptions: (o: ShellOptionsValue) => void;
}>({ options: DEFAULT_SHELL_OPTIONS, setOptions: () => {} });
```

```tsx
// src/components/ShellOptions/ShellOptions.tsx
'use client';
import { useContext, useEffect } from 'react';
import { DEFAULT_SHELL_OPTIONS, ShellOptionsContext, type ShellOptionsValue } from '@contexts/ShellOptionsContext';

export default function ShellOptions(props: Partial<ShellOptionsValue>) {
  const { setOptions } = useContext(ShellOptionsContext);
  const { headerIsWhite = false, isGlow = true, withoutGradient = false } = props;

  useEffect(() => {
    setOptions({ headerIsWhite, isGlow, withoutGradient });
    return () => setOptions(DEFAULT_SHELL_OPTIONS);
  }, [headerIsWhite, isGlow, withoutGradient, setOptions]);

  return null;
}
```

A page that used `<Layout headerIsWhite>` now renders `<ShellOptions headerIsWhite />` next to its scene. Because it applies in an effect, a page that needs a white header may flash the default for a frame. If that's visible, move the page into its own route group with its own layout.

## Step 4 — `Shell`

Edit the renamed file. **Keep Layout's real JSX and class names** and change only what the table in Step 1 says. The shape:

```tsx
// src/components/Shell/Shell.tsx
'use client';

import { useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import classNames from 'classnames';
import { HeaderGradientContext, MenuContext } from '@contexts/index';
import { DEFAULT_SHELL_OPTIONS, ShellOptionsContext } from '@contexts/ShellOptionsContext';
import Header from '@components/Header';
import styles from './Shell.module.scss';

export default function Shell({ children, footer }: { children: ReactNode; footer?: ReactNode }) {
  const { isOpened } = useContext(MenuContext);
  const [options, setOptions] = useState(DEFAULT_SHELL_OPTIONS);
  const [isHeaderShow, setIsHeaderShow] = useState(true); // same on server and client, so no mismatch
  const headerRef = useRef<HTMLDivElement>(null);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setIsHeaderShow(y - lastY.current <= 0);
      lastY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ⚠ Keep Layout's real structure and class names below. This only shows where each piece goes.
  return (
    <ShellOptionsContext.Provider value={{ options, setOptions }}>
      {/* the real HeaderGradientContext.Provider value: copy it from Layout */}
      <HeaderGradientContext.Provider value={/* ...as in Layout... */ undefined as never}>
        <div className={classNames(styles.container /* , options.isGlow && styles.glow */)}>
          <header className={styles.header}>
            <Header
              headerIsWhite={options.headerIsWhite}
              withoutGradient={options.withoutGradient}
              headerShow={isOpened ? true : isHeaderShow}
              forwardedRef={headerRef}
            />
          </header>
          <main className={styles.main}>{children}</main>
          {footer && <footer className={styles.footer}>{footer}</footer>}
        </div>
      </HeaderGradientContext.Provider>
    </ShellOptionsContext.Provider>
  );
}
```

(Replace the `undefined as never` placeholder and the class names with what `Layout.tsx` really has.)

## Step 5 — Route-group layouts

```tsx
// src/app/(main)/layout.tsx: header + footer
import type { ReactNode } from 'react';
import Shell from '@components/Shell';
import Footer from '@components/Footer';

export default function MainLayout({ children }: { children: ReactNode }) {
  return <Shell footer={<Footer />}>{children}</Shell>;
}
```

```tsx
// src/app/(bare)/layout.tsx: header only (thanks page)
import type { ReactNode } from 'react';
import Shell from '@components/Shell';

export default function BareLayout({ children }: { children: ReactNode }) {
  return <Shell>{children}</Shell>;
}
```

`<Footer />` is created in a Server Component and passed as a prop, so it stays on the server even though `Shell` is a client component. The Footer must not import `'use client'` code or use hooks (**⚠ VERIFY** `grep -n "use[A-Z]" src/components/Footer/*.tsx`).

## Step 6 — Header

`src/components/Header/Header.tsx`:

- add `'use client'` (it uses `useContext`)
- `import Link from 'next/link'`, and `to=` → `href=`
- delete `useHeaderAssets()` and `react-svg`
- logo: `import { headerImages } from '@constants/images/headerImages'` and `<img src={headerImages.logotype.src} alt="…" height={60} />`. **This is currently the Halo Lab logotype; Plan 09 replaces it.**
- keep nav links as `/services/`, `/portfolio/`, `/contacts/` (trailing slash, matching `trailingSlash: true`); the blog link is already gone

## Step 7 — Menu

`src/components/Header/components/Menu/*`: `'use client'`, `Link` swap, and replace `useMenuAssets()` with `menuImages` (icons and star images used with `.src`). The blog item is already removed.

## Step 8 — Footer and SVG icons

```bash
grep -rln "\.inline\.svg" src          # the real list of SVGs used as components
mkdir -p src/assets/icons
npx @svgr/cli --typescript --out-dir src/assets/icons -- <each folder or file from the grep>
```

SVGR names files from the SVG file name (e.g. `dribbble.inline.svg` → `DribbbleInline.tsx`); rename them if you like. Then:

```tsx
// before
import Dribbble from '../../assets/images/brands/dribbble.inline.svg';
// after
import Dribbble from '@assets/icons/DribbbleInline';
```

If an icon's size or colour now behaves differently, check whether the old plugin stripped `width`/`height`; re-run SVGR with `--no-dimensions` and size it from CSS. Footer's other images come from `footerImages`.

## Verify

- [x] `src/components/Layout` no longer exists; `grep -rn "components/Layout" src` is empty
- [x] Header and footer don't re-render on navigation (React DevTools → highlight updates)
- [x] Mobile menu opens and closes; header hides on scroll down and shows on scroll up
- [x] `Footer` has no `'use client'` and imports no client-only code
- [x] `grep -rn "react-svg\|useHeaderAssets\|useMenuAssets\|useFooterAssets" src` → nothing
- [x] `grep -rln "\.inline\.svg" src` → nothing
