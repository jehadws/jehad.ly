function isValidEmail(email: string) {
  const regexp = new RegExp(/[^@]+@[^.]+\..+/g);
  return regexp.test(email);
}

export function scrollHandler(
  ref: { getBoundingClientRect?: () => DOMRect } | null | undefined,
  callback: (arg0: boolean) => void
) {
  return function () {
    if (!ref || typeof ref.getBoundingClientRect !== 'function') return;
    const pos = ref.getBoundingClientRect();
    if (pos && pos.y <= 0 && -pos.y < pos.height) {
      return callback(true);
    }
    callback(false);
  };
}

export function useEffectScroll(
  ref: { current: any } | null | undefined,
  func: (arg0: boolean) => void
) {
  if (typeof window === 'undefined' || !ref) return () => {};
  const handler = scrollHandler(ref.current, func);
  window.addEventListener('scroll', handler);
  return () => window.removeEventListener('scroll', handler);
}

export default isValidEmail;
