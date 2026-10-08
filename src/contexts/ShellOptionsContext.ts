'use client';
import { createContext } from 'react';

export type ShellOptionsValue = {
  headerIsWhite: boolean;
  isGlow: boolean;
  withoutGradient: boolean;
};

export const DEFAULT_SHELL_OPTIONS: ShellOptionsValue = {
  headerIsWhite: false,
  isGlow: true,
  withoutGradient: false,
};

export const ShellOptionsContext = createContext<{
  options: ShellOptionsValue;
  setOptions: (o: ShellOptionsValue) => void;
}>({
  options: DEFAULT_SHELL_OPTIONS,
  setOptions: () => {},
});
