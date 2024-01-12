import { TabManager } from '@lib/tab-manager';
import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';

export abstract class TabsElement extends LitElement {
  @property({ attribute: false }) protected _tabs: chrome.tabs.Tab[] = [];

  protected _tabManager = TabManager.instance;

  constructor() {
    super();

    void this._tabManager.fetchTabs().then((tabs) => (this._tabs = tabs));
  }
}
