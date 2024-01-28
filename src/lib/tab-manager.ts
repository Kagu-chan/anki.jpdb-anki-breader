export class TabManager {
  private static _instance: TabManager;
  public static get instance(): TabManager {
    if (!this._instance) {
      this._instance = new TabManager();
    }

    return this._instance;
  }

  private _isExtension: boolean;
  private constructor() {
    this._isExtension = !!chrome?.tabs;
  }

  public fetchTabs(query?: Parameters<typeof chrome.tabs.query>[0]): Promise<chrome.tabs.Tab[]> {
    if (this._isExtension) {
      return chrome.tabs.query({ currentWindow: true, ...(query ?? {}) });
    }

    // When running in a non-chrome environment, we'll just fake the tabs, so we can still test the UI.
    return Promise.resolve(this.getFakeTabs());
  }

  public async fetchTab(query?: Parameters<typeof chrome.tabs.query>[0]): Promise<chrome.tabs.Tab> {
    const [tab] = await this.fetchTabs(query);

    return tab;
  }

  public fetchActiveTab(): Promise<chrome.tabs.Tab | undefined> {
    return this.fetchTab({ active: true });
  }

  public async fetchActiveTabAndMonitor(
    callback: (tab: chrome.tabs.Tab) => void,
  ): Promise<chrome.tabs.Tab | undefined> {
    const tab = await this.fetchActiveTab();

    tab && this.onTabUpdate(tab, callback);
    tab && callback(tab);

    return tab;
  }

  public findTabsByURL(url: string): Promise<chrome.tabs.Tab[]> {
    return this.fetchTabs({ url });
  }

  public async findTabById(id: number): Promise<chrome.tabs.Tab | undefined> {
    const tabs = await this.fetchTabs();

    return tabs.find((t) => t.id === id);
  }

  public async navigateToTab(tabId: number): Promise<void> {
    if (this._isExtension) {
      await chrome.tabs.update(tabId, { active: true });
    }
  }

  public onTabUpdate(callback: (tab: chrome.tabs.Tab) => void): void;
  public onTabUpdate(tab: chrome.tabs.Tab, callback: (tab: chrome.tabs.Tab) => void): void;

  public onTabUpdate(
    tabOrCallback: chrome.tabs.Tab | ((tab: chrome.tabs.Tab) => void),
    callback?: (tab: chrome.tabs.Tab) => void,
  ): void {
    const tab = typeof tabOrCallback === 'function' ? undefined : tabOrCallback;
    const cb = typeof tabOrCallback === 'function' ? tabOrCallback : callback;

    if (this._isExtension) {
      chrome.tabs.onUpdated.addListener((tabId: number) => {
        if (tab && tab.id !== tabId) {
          return;
        }

        void this.findTabById(tab?.id ?? tabId).then((tab) => tab && cb(tab));
      });
    }
  }

  public async navigateActiveTabTo(url: string): Promise<void> {
    const tab = await this.fetchActiveTab();

    await chrome.tabs.update(tab?.id ?? 0, { url });
  }

  public async executeScript(tabId: number, fnOrScript: (() => void) | string): Promise<void> {
    if (this._isExtension) {
      const injection: Partial<chrome.scripting.ScriptInjection> = {
        target: { tabId },
      };

      if (typeof fnOrScript === 'string') {
        injection.files = [fnOrScript];
      } else {
        injection.func = fnOrScript;
      }

      await chrome.scripting.executeScript(injection as chrome.scripting.ScriptInjection);
    }
  }

  public async sendEvent<TIn extends { action?: string }, TOut extends object>(
    request: TIn,
  ): Promise<TOut>;
  public async sendEvent<TIn extends { action?: string }, TOut extends object>(
    tabId: number,
    request: TIn,
  ): Promise<TOut>;

  public async sendEvent<TIn extends { action?: string }, TOut extends object>(
    p1: number | TIn,
    p2?: TIn,
  ): Promise<TOut> {
    const tabId = typeof p1 === 'number' ? p1 : (await this.fetchActiveTab())?.id;
    const request = typeof p1 === 'number' ? p2 : p1;

    return (await chrome.tabs.sendMessage(tabId, request)) as TOut;
  }

  private getFakeTabs(): chrome.tabs.Tab[] {
    return [
      {
        title: 'Test tab 1',
        url: 'https://www.google.com',
        favIconUrl: 'https://www.google.com/favicon.ico',
        active: true,
      },
      {
        url: 'https://www.sample.com',
        title: 'Test tab 2',
      },
      {
        title:
          // eslint-disable-next-line max-len
          'Test tab 3 has a very long title that should be truncated and not overflow the container',
        url: 'https://www.example.com',
        favIconUrl: 'https://www.google.com/favicon.ico',
      },
    ] as chrome.tabs.Tab[];
  }
}
