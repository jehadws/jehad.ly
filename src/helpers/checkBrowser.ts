type SafariWindow = Window & {
  HTMLElement: { toString(): string };
  safari?: { pushNotification?: unknown };
};

const checkBrowser = () => {
  let isSafari: boolean | null = null;

  if (typeof window !== `undefined`) {
    const safariWindow = window as SafariWindow;

    isSafari =
      /constructor/i.test(safariWindow.HTMLElement.toString()) ||
      (function (p: unknown) {
        return (
          Object.prototype.toString.call(p) === '[object SafariRemoteNotification]'
        );
      })(
        !safariWindow.safari ||
          (typeof safariWindow.safari !== 'undefined' &&
            safariWindow.safari.pushNotification)
      );
  }

  return { isSafari };
};

export default checkBrowser;
