import { useEffect, useState } from 'react';

function debounce(callback: () => void, waitTime: number): () => void {
  let timeNow = Date.now();
  return () => {
    if (timeNow - Date.now() + waitTime < 0) {
      callback();
      timeNow = Date.now();
    }
  };
}

const getScreenSize = () => {
  if (typeof window === 'undefined') {
    return {
      width: 0,
      height: 0,
    };
  }
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
};

export default function useResize() {
  const [screenSize, setScreenSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const handleSetWidth = () => setScreenSize(getScreenSize());
    handleSetWidth();
    const handler = debounce(handleSetWidth, 200);

    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return screenSize;
}