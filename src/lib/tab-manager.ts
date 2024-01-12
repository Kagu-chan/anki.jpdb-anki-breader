export class TabManager {
  public fetchTabs(): Promise<chrome.tabs.Tab[]> {
    if (chrome?.tabs) {
      return chrome.tabs.query({ lastFocusedWindow: true });
    }

    // When running in a non-chrome environment, we'll just fake the tabs, so we can still test the UI.
    return Promise.resolve(this.getFakeTabs());
  }

  public async navigateToTab(tabId: number): Promise<void> {
    if (chrome?.tabs) {
      await chrome.tabs.update(tabId, { active: true });
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
