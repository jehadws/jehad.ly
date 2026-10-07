# Plan 03 — Remove the blog and dead code

**Status:** ✅ DONE  
**Depends on:** Plan 01

## Goal

Delete what is empty or commented out in production *before* porting, so nothing dead gets migrated. The blog API (`api.jehad.pro/api/posts`) returns nothing and no posts are generated.

Everything deleted here stays in git history. If you want a blog later, add MDX as a new plan (`src/content/blog/*.mdx`, `@next/mdx`, `generateStaticParams`), not by reviving this code.

---

## Step 1 — Confirm it's dead

```bash
grep -rniE "blog|posts" src --include=*.ts --include=*.tsx -l
grep -rn "MailUs\|Gallery" src --include=*.tsx | grep -v "^src/scenes/\(MailUs\|HomePage/components/Gallery\)"
```

**⚠ VERIFY** that `Gallery` and `MailUs` really are commented out where they're used, and that nothing else imports them.

## Step 2 — Delete

```bash
git rm -r src/scenes/BlogPage src/scenes/PostThumbnail
git rm -r src/scenes/HomePage/components/Posts
git rm -r src/scenes/HomePage/components/Gallery
git rm -r src/scenes/MailUs

git rm -r _gatsby/templates/BlogPost
git rm _gatsby/pages/blog.tsx
git rm _gatsby/hooks-queries/useBlogAssets.ts \
       _gatsby/hooks-queries/useHomeGalleryAssets.ts \
       _gatsby/hooks-queries/useSitePages.ts
```

Adjust paths to what the greps in Step 1 actually showed.

## Step 3 — Fix the references

| Where | Change |
|---|---|
| `src/scenes/HomePage/HomePage.tsx` | Remove the `Posts` (and `Gallery`) imports and JSX |
| `src/components/Header/Header.tsx` | Remove the `blog` nav item |
| `src/components/Header/components/Menu/*` | Remove the blog entry from the menu data and JSX |
| `src/components/Footer/*` | Remove any link to `/blog` |
| `src/types/*` | Remove blog/post types if nothing else uses them |

Then re-run `grep -rniE "blog|posts" src -l`. Anything left must be intentional.

The old blog images (`blogIcon`, `blogStars`, post previews) stay in `src/assets` for now. Plan 09 deletes unused assets in one sweep.

## Step 4 — Redirect

`next.config.ts` (Plan 01) already redirects `/blog` and `/blog/*` to `/` with `permanent: false`. Keep it temporary until you've decided you'll never bring the URLs back. Browsers cache permanent redirects hard.

## Verify

- [x] `grep -rniE "blog" src` shows only intentional leftovers (asset file names are fine)
- [x] Nothing imports `BlogPage`, `PostThumbnail`, `Posts`, `Gallery` or `MailUs`
- [x] `tsc` error count is lower than your Plan 01 baseline
