'use client';

import { useContext, useEffect } from 'react';
import {
  DEFAULT_SHELL_OPTIONS,
  ShellOptionsContext,
  type ShellOptionsValue,
} from '@contexts/ShellOptionsContext';

export default function ShellOptions(props: Partial<ShellOptionsValue>) {
  const { setOptions } = useContext(ShellOptionsContext);
  const { headerIsWhite = false, isGlow = true, withoutGradient = false } = props;

  useEffect(() => {
    setOptions({ headerIsWhite, isGlow, withoutGradient });
    return () => setOptions(DEFAULT_SHELL_OPTIONS);
  }, [headerIsWhite, isGlow, withoutGradient, setOptions]);

  return null;
}
