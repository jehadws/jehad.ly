import { useState, useEffect } from 'react';
import { useEffectScroll } from '@src/helpers/utils';

const useHeaderIsWhite = (contentRef: any) => {
  const [headerIsWhite, setHeaderIsWhite] = useState(false);

  useEffect(() => {
    return useEffectScroll(contentRef, setHeaderIsWhite);
  }, [contentRef]);

  return headerIsWhite;
};

export default useHeaderIsWhite;
