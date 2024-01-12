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

  public fetchTabs(): Promise<chrome.tabs.Tab[]> {
    if (this._isExtension) {
      return chrome.tabs.query({ lastFocusedWindow: true });
    }

    // When running in a non-chrome environment, we'll just fake the tabs, so we can still test the UI.
    return Promise.resolve(this.getFakeTabs());
  }

  public async fetchActiveTab(): Promise<chrome.tabs.Tab | undefined> {
    const tabs = await this.fetchTabs();

    return tabs.find((tab) => tab.active);
  }

  public async navigateToTab(tabId: number): Promise<void> {
    if (this._isExtension) {
      await chrome.tabs.update(tabId, { active: true });
    }
  }

  public onThisTabUpdate(callback: (tabs: chrome.tabs.Tab) => void): void {
    if (this._isExtension) {
      chrome.tabs.onUpdated.addListener(
        (tabId: number) =>
          void this.fetchTabs()
            .then((tabs) => tabs.find((t) => t.id === tabId))
            .then((tab) => callback(tab)),
      );
    }
  }

  private getFakeTabs(): chrome.tabs.Tab[] {
    return [
      {
        title: 'Test tab 1',
        favIconUrl: 'https://www.google.com/favicon.ico',
        active: true,
      },
      {
        title: 'Test tab 2',
      },
      {
        title:
          // eslint-disable-next-line max-len
          'Test tab 3 has a very long title that should be truncated and not overflow the container',
        favIconUrl: 'https://www.google.com/favicon.ico',
      },
    ] as chrome.tabs.Tab[];
  }
}
