const nop = (): void => {
  /* NOP */
};

export const openSidebar = (view: string, closeView?: boolean): void => {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
    const [activeTab] = tabs;

    if (!activeTab) {
      return;
    }

    chrome.sidePanel.setOptions(
      {
        tabId: activeTab.id,
        path: `views/${view}/${view}.html`,
        enabled: true,
      },
      () => {
        chrome.sidePanel.open(
          {
            tabId: activeTab.id,
          },
          () => {
            if (closeView) {
              window.close();
            }
          },
        );
      },
    );
  });
};

export const closeSidebar = (): void => {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
    const [activeTab] = tabs;

    if (!activeTab) {
      return;
    }

    chrome.sidePanel.getOptions({ tabId: activeTab.id }, (options) => {
      if (!options.enabled) {
        return;
      }

      chrome.sidePanel.setOptions(
        {
          tabId: activeTab.id,
          enabled: false,
        },
        nop,
      );
    });
  });
};
