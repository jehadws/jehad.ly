import localFont from 'next/font/local';

// ⚠ No Sofia Pro files exist in src/assets/fonts — Gatsby loaded it from Adobe Typekit.
// The variable is left empty so SCSS $font-sofia-pro falls back to `sans-serif`
// (see variables/fonts.scss). To ship it, add woff2 files and replace this stub
// with a real localFont() call.
export const sofiaPro = {
  variable: '--font-sofia-pro',
  className: '',
} as const;

// Gramatika — local woff2 files present at src/assets/fonts/Gramatika/
export const gramatika = localFont({
  src: [
    {
      path: '../assets/fonts/Gramatika/Gramatika - Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../assets/fonts/Gramatika/Gramatika - Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../assets/fonts/Gramatika/Gramatika - Black.woff2',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-gramatika',
  display: 'swap',
});

// Cairo — local TTF files present at src/assets/fonts/cairo/
// Using localFont instead of next/font/google so the build works offline.
export const cairo = localFont({
  src: [
    {
      path: '../assets/fonts/cairo/Cairo-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../assets/fonts/cairo/Cairo-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../assets/fonts/cairo/Cairo-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-cairo',
  display: 'swap',
});
