import { LitElement, property } from '@lib/lit';
import { TabManager } from '@lib/tab-manager';

export abstract class TabElement extends LitElement {
  @property({ attribute: false }) protected _tab: chrome.tabs.Tab | undefined;

  protected _tabManager = TabManager.instance;

  constructor() {
    super();

    void this._tabManager.fetchActiveTabAndMonitor((tab) => (this._tab = tab));
  }
}
