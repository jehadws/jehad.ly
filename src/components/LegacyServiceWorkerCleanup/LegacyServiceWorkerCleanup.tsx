'use client';

import { useEffect } from 'react';

export default function LegacyServiceWorkerCleanup() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    navigator.serviceWorker.getRegistrations().then((registrations) => {
      // New visitors get nothing at all; only browsers still holding Gatsby's
      // offline worker are handed /sw.js so it can replace and remove itself.
      if (registrations.length > 0) {
        void navigator.serviceWorker.register('/sw.js');
      }
    });
  }, []);

  return null;
}
