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
    isMobile: width !== undefined ? width <= 568 : false,
    isTablet: width !== undefined ? width > 568 && width <= 768 : false,
    isDesktop: width !== undefined ? width > 768 : true,
  };
}