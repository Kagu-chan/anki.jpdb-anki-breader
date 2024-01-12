import { componentStyles } from '@components/component-styles';
import { TabManager } from '@lib/tab-manager';
import { LitElement, TemplateResult, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';
import { when } from 'lit/directives/when.js';

import '@material/web/icon/icon.js';
import '@material/web/list/list.js';
import '@material/web/list/list-item.js';

@customElement('popup-tab-list')
export class PopupTabList extends LitElement {
  @property({ attribute: false }) private _tabs: chrome.tabs.Tab[] = [];

  public static styles = [
    componentStyles,
    css`
      md-list-item[active] {
        background-color: rgba(1, 1, 1, 0.05);
      }
    `,
  ];
  private tabManager = new TabManager();

  constructor() {
    super();

    void this.tabManager.fetchTabs().then((tabs) => (this._tabs = tabs));
  }

  public render(): TemplateResult {
    return html`<md-list>
      ${map(
        this._tabs,
        (tab) =>
          html`<md-list-item
            ?active="${tab.active}"
            type="button"
            @click="${(): Promise<void> => this.onTabClicked(tab.id)}"
          >
            ${when(
              tab.favIconUrl?.length,
              () => html`<img slot="start" class="icon" src="${tab.favIconUrl}" />`,
              () => html`<md-icon slot="start" class="icon">abc</md-icon>`,
            )}<span class="truncate">${tab.title}</span></md-list-item
          >`,
      )}
    </md-list>`;
  }

  private async onTabClicked(tabId: number): Promise<void> {
    await this.tabManager.navigateToTab(tabId);
    // @TODO: Inject CSS and JS into the tab.

    // @note the following code should be part of the parsing API. Here for future reference.
    /* await chrome.scripting.insertCSS({
        target: { tabId },
        css: 'body { background-color: red; }',
      });
     */

    window.close();
  }
}
