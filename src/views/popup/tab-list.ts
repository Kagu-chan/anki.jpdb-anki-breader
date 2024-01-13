import { componentStyles } from '@components/component-styles';
import { TabsElement } from '@components/tabs-element';
import { TemplateResult, css, html, customElement, map, when } from '@lib/lit';

import '@material/web/icon/icon.js';
import '@material/web/list/list.js';
import '@material/web/list/list-item.js';

@customElement('popup-tab-list')
export class PopupTabList extends TabsElement {
  public static styles = [
    componentStyles,
    css`
      md-list-item[active] {
        background-color: rgba(1, 1, 1, 0.05);
      }
    `,
  ];

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
    await this._tabManager.navigateToTab(tabId);
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
