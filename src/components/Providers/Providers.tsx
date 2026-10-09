'use client';

import type { ReactNode } from 'react';
import { MenuContext } from '@contexts/index';
import { useIsOpened } from '@hooks/index';
import LegacyServiceWorkerCleanup from '@components/LegacyServiceWorkerCleanup';

export default function Providers({ children }: { children: ReactNode }) {
  const menuState = useIsOpened();
  return (
    <MenuContext.Provider value={menuState}>
      <LegacyServiceWorkerCleanup />
      {children}
    </MenuContext.Provider>
  );
}
