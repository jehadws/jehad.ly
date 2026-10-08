function springDebounce(func: { apply: (arg0: any, arg1: IArguments) => void; }, wait = 1, immediate = false) {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  return function (this: unknown) {
    const context = this;
    const args = arguments;
    const later = function() {
      timeout = undefined;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

export default springDebounce;
