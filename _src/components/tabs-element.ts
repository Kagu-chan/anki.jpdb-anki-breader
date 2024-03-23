import { LitElement, property } from '@lib/lit';
import { TabManager } from '@lib/tab-manager';

export abstract class TabsElement extends LitElement {
  @property({ attribute: false }) protected _tabs: chrome.tabs.Tab[] = [];

  protected _tabManager = TabManager.instance;

  constructor() {
    super();

    void this._tabManager.fetchTabs().then((tabs) => (this._tabs = tabs));
  }
}
