const globalCallbacks = new Map<string, Function>();

export function registerListener(name: string, fn: Function): void {
  globalCallbacks.set(name, fn);
}

export function getCallable<TArgs extends any[], TOut>(
  key: string,
): (...args: TArgs) => Promise<{ success: boolean; result: TOut }> {
  return async (...args: TArgs): Promise<{ success: boolean; result: TOut }> => {
    return (await chrome.runtime.sendMessage({ key, args })) as {
      success: boolean;
      result: TOut;
    };
  };
}

chrome.runtime.onMessage.addListener(
  (
    request: { key: string; args?: unknown[] },
    _sender,
    sendResponse: (response: { success: boolean; result: unknown }) => void,
  ): boolean => {
    if (globalCallbacks.has(request.key)) {
      const fn = globalCallbacks.get(request.key) as (...args: unknown[]) => Promise<unknown>;

      void fn(...(request.args ?? []))
        .then((result) => {
          sendResponse({ success: true, result });
        })
        .catch((_error) => {
          sendResponse({ success: false, result: undefined });
        });

      return true;
    }

    return false;
  },
);

export const readLocalStorage = getCallable<[key: string, defaultValue?: string], string>('lsr');
export const setLocalStorage = getCallable<[key: string, value: string], void>('lsw');
