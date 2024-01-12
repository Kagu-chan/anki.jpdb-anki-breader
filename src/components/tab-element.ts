import { TabManager } from '@lib/tab-manager';
import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';

export abstract class TabElement extends LitElement {
  @property({ attribute: false }) protected _tab: chrome.tabs.Tab | undefined;

  protected _tabManager = TabManager.instance;

  constructor() {
    super();

    void this._tabManager.fetchActiveTab().then((tab) => (this._tab = tab));
    this._tabManager.onThisTabUpdate((tab) => (this._tab = tab));
  }
}
