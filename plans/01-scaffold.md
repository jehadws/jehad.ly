# Plan 01 — Scaffold, staging, dependencies, codemods

**Status:** 🟡 IN PROGRESS

## Goal

On a branch, in the same repo: stand up Next.js 16 next to the Gatsby code, move every Gatsby-only file into `_gatsby/` (so Next's Pages Router never activates and `tsc` stops seeing Gatsby imports), fix dependencies, and run the two mechanical codemods that touch most files.

---

## Step 1 — Branch and prerequisites

```bash
node -v                      # must be >= 20.9
git status                   # clean tree
grep -rn "<Layout" src > /tmp/layout-props.txt   # keep: Plan 05 needs the props each page passed
git checkout -b feat/nextjs
```

## Step 2 — Scaffold in a temp folder

`create-next-app .` refuses to run in a non-empty folder, so scaffold elsewhere and copy what you need.

```bash
cd ..
npx create-next-app@latest _next-scaffold \
  --typescript --app --src-dir --no-tailwind --no-eslint \
  --import-alias "@/*" --use-npm
# if asked about the React Compiler: No
```

Copy exactly two files into your project (the one with `src/` and `package.json`), then delete the temp folder:

```bash
cp _next-scaffold/tsconfig.json  <project>/tsconfig.json     # overwrites the Gatsby one
cp _next-scaffold/next.config.ts <project>/next.config.ts
# keep the scaffold's .gitignore open for Step 5, then:
rm -rf _next-scaffold
cd <project>
```

Don't copy its `src/app` or `public`. Plan 02 writes the real layout.

## Step 3 — Stage the Gatsby files

```bash
mkdir -p _gatsby
git mv src/pages        _gatsby/pages
git mv src/templates    _gatsby/templates
git mv src/hooks/queries _gatsby/hooks-queries
git mv gatsby-config.ts gatsby-node.js gatsby-browser.ts _gatsby/
git mv src/gatsby-types.d.ts _gatsby/      # if present
git mv src/react-app-env.d.ts _gatsby/     # if present
git mv tsconfig.node.json _gatsby/         # if present
```

Then remove the `queries` re-export from `src/hooks/index.ts` so it exports only `useBreakPoints`, `useHeaderIsWhite`, `useIsOpened`, `useResize`.

Leave `axiosClient.ts` and `svg.ts` for now (Plan 08 and Plan 10 deal with them).

**⚠ VERIFY** what else imports Gatsby: `grep -rln "gatsby" src`. Anything in `src/types` or `src/helpers` shows up here. Fix those now.

## Step 4 — Dependencies

```bash
npm uninstall gatsby gatsby-image gatsby-plugin-alias-imports gatsby-plugin-canonical-urls \
  gatsby-plugin-image gatsby-plugin-manifest gatsby-plugin-offline gatsby-plugin-optimize-svgs \
  gatsby-plugin-react-svg gatsby-plugin-robots-txt gatsby-plugin-sass gatsby-plugin-sharp \
  gatsby-plugin-sitemap gatsby-source-filesystem gatsby-source-rest-api gatsby-transformer-sharp \
  react-svg react-slick slick-carousel react-id-swiper @types/react-slick

npm install next@latest react@latest react-dom@latest swiper@latest sass@latest
npm install -D typescript@latest @types/react@latest @types/react-dom@latest @types/node@latest
```

Next 16 is built for React 19, and your project is on React 18. Now check the libraries you're keeping:

```bash
npm ls react react-dom
npm ls react-spring gsap react-tabs react-intersection-observer classnames
```

If any package reports a peer-dependency conflict with React 19, check its latest version first. Use `--legacy-peer-deps` only as a last resort and note which package forced it.

In `package.json`: rename the package (`"name": "jehad-ly"`), and set the scripts:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "typecheck": "tsc --noEmit"
}
```

(`next lint` no longer exists in Next 16. Optional ESLint setup is in Plan 10.)

## Step 5 — `.gitignore`

Start from the scaffold's `.gitignore` and merge. Gatsby's list ignores `public/` and `.cache/`. **Remove those two entries**, or everything you put in `public/` (including `sw.js`) will never be committed. Make sure these are present:

```
.next/
node_modules
.env*.local
next-env.d.ts
```

## Step 6 — `tsconfig.json`

You copied the scaffold's file, so `jsx`, `moduleResolution`, `plugins` and `include` are already right. Edit only two things:

```jsonc
{
  "compilerOptions": {
    "paths": {
      "@/*":            ["./src/*"],
      "@src/*":         ["./src/*"],
      "@components/*":  ["./src/components/*"],
      "@scenes/*":      ["./src/scenes/*"],
      "@hooks/*":       ["./src/hooks/*"],
      "@assets/*":      ["./src/assets/*"],
      "@contexts/*":    ["./src/contexts/*"],
      "@helpers/*":     ["./src/helpers/*"],
      "@app-types/*":   ["./src/types/*"],
      "@styles/*":      ["./src/styles/*"],
      "@functions/*":   ["./src/styles/functions/*"],
      "@constants/*":   ["./src/constants/*"],
      "@data/*":        ["./src/data/*"]
    }
  },
  "exclude": ["node_modules", "_gatsby"]
}
```

Keep `@/*`. Plan 08 uses it. `@types/*` is renamed `@app-types/*` because it sits on top of npm's `@types` scope. `@pages/*` is dropped (Gatsby-only); **⚠ VERIFY** `grep -rn "@pages/" src` is empty. Rename the imports:

```bash
grep -rln "from '@types/" src | xargs -r sed -i "s#from '@types/#from '@app-types/#"
```

## Step 7 — `next.config.ts`

All config for the whole migration goes here once. Each plan tells you what to verify.

```ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  trailingSlash: true, // matches Gatsby URLs
  images: { formats: ['image/avif', 'image/webp'] },
  experimental: {
    serverActions: { bodySizeLimit: '10mb' }, // Plan 08: attachments (default is 1 MB)
  },
  async redirects() {
    return [
      // Plan 03: blog removed. Temporary on purpose; switch to permanent once you're sure.
      { source: '/blog', destination: '/', permanent: false },
      { source: '/blog/:path*', destination: '/', permanent: false },
    ];
  },
  async headers() {
    return [
      // Plan 10: the self-removing service worker must never be cached
      {
        source: '/sw.js',
        headers: [{ key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' }],
      },
    ];
  },
};

export default nextConfig;
```

**⚠ VERIFY: SCSS path aliases.** Gatsby's alias plugin let SCSS use imports like `@use '@functions/…'`. Check:

```bash
grep -rnE "@(use|import|forward) ['\"]@" src
```

If that returns anything, test it in Step 10. First try `sassOptions: { loadPaths: ['./src/styles'] }` in the config (and shorten the imports to match). If that doesn't resolve, codemod the SCSS imports to relative paths. This is the one place stage 1 edits `.scss` files.

## Step 8 — Static files and the video

Gatsby's `static/` is served from the site root, which is exactly what `public/` does:

```bash
mkdir -p public
git mv static/* public/
rmdir static
```

The video is the only component asset that has to be a URL (Next can't import `.mp4`):

```bash
grep -rn "\.mp4" src                       # ⚠ VERIFY the path(s) in use
mkdir -p public/videos
git mv src/assets/images/videos/Mirror.mp4 public/videos/Mirror.mp4
```

## Step 9 — `projects.js` → typed data

```bash
mkdir -p src/data
git mv projects.js src/data/projects.ts
```

Edit the file so it ends like this. Inferring the type means you don't have to guess the fields:

```ts
const projects = [
  /* ...existing array, unchanged... */
];

export type Project = (typeof projects)[number];
export default projects;
```

## Step 10 — Codemods

**(a) CSS Module imports** (default import):

```bash
grep -rlE "import \* as [A-Za-z_]+ from '[^']+\.module\.s[ac]ss'" src \
  | xargs -r sed -i -E "s#import \* as ([A-Za-z_]+) from ('[^']+\.module\.s[ac]ss')#import \1 from \2#"
```

If the project also uses double quotes, run it again with `"` in place of `'`.

**(b) kebab-case class names.** As far as I know, Gatsby 5 converts `.nav-item` to `styles.navItem`; Next does not. Save this as `scripts/css-modules-check.mjs`:

```js
// node scripts/css-modules-check.mjs        → report
// node scripts/css-modules-check.mjs --fix  → rewrite styles.navItem → styles['nav-item']
import fs from 'node:fs';
import path from 'node:path';

const FIX = process.argv.includes('--fix');
const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]);
const camel = (s) => s.replace(/-([a-z0-9])/gi, (_, c) => c.toUpperCase());

let problems = 0;
for (const file of walk('src').filter((f) => /\.(tsx?|jsx?)$/.test(f))) {
  let code = fs.readFileSync(file, 'utf8');
  let changed = false;
  const importRe = /import\s+(?:\*\s+as\s+)?(\w+)\s+from\s+['"](\.[^'"]+\.module\.s[ac]ss)['"]/g;
  for (const [, name, rel] of [...code.matchAll(importRe)]) {
    const scssFile = path.resolve(path.dirname(file), rel);
    if (!fs.existsSync(scssFile)) { console.log(`MISSING  ${file} -> ${rel}`); problems++; continue; }
    const classes = new Set(
      [...fs.readFileSync(scssFile, 'utf8').matchAll(/\.([A-Za-z_][\w-]*)/g)].map((m) => m[1]));
    const used = new Set([...code.matchAll(new RegExp(`\\b${name}\\.([A-Za-z_]\\w*)`, 'g'))].map((m) => m[1]));
    for (const u of used) {
      if (classes.has(u)) continue;
      const kebab = [...classes].find((c) => camel(c) === u);
      problems++;
      if (kebab) {
        console.log(`CAMEL    ${file}: ${name}.${u} -> ${name}['${kebab}']`);
        if (FIX) {
          code = code.replace(new RegExp(`\\b${name}\\.${u}\\b`, 'g'), `${name}['${kebab}']`);
          changed = true;
        }
      } else {
        console.log(`UNKNOWN  ${file}: ${name}.${u} not found in ${path.basename(scssFile)}`);
      }
    }
  }
  if (changed) fs.writeFileSync(file, code);
}
console.log(problems ? `${problems} issue(s)` : 'OK');
```

Run it without `--fix`, read the report, then with `--fix`. Limits: it can't see dynamic access (`styles[variant]`; `grep -rn "styles\[" src`), and it reports nested `&-suffix` selectors as UNKNOWN even when they're fine. Check those by hand.

## Step 11 — Placeholder app so the dev server starts

Next refuses to start without an `app/` directory. Plan 02 overwrites both files.

```bash
mkdir -p src/app
cat > src/app/layout.tsx <<'EOF'
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><body>{children}</body></html>);
}
EOF
echo "export default function Page() { return <p>ok</p>; }" > src/app/page.tsx
```

## Verify

- [ ] `git branch --show-current` → `feat/nextjs`
- [ ] `src/pages` and `src/templates` don't exist; `_gatsby/` holds them
- [ ] `grep -rln "gatsby" package.json` → nothing
- [ ] `npm run dev` starts, `/` shows "ok"
- [ ] `public/` contains the former `static/` files and `videos/Mirror.mp4`; `git status` shows them as tracked
- [ ] `grep -rlE "import \* as .* from '.*\.module\.s[ac]ss'" src` → nothing
- [ ] Check script reports only issues you've reviewed
- [ ] SCSS alias grep result is known, and the fix (if needed) is tested
- [ ] `tsc` error count written down as your baseline
