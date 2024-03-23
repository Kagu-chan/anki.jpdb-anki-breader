import { componentStyles } from '@components/component-styles';
import { TabsElement } from '@components/tabs-element';
import { TemplateResult, html, customElement, map, when, unsafeCSS } from '@lib/lit';

import tabListStyles from './tab-list.scss';

@customElement('popup-tab-list')
export class PopupTabList extends TabsElement {
  public static styles = [componentStyles, unsafeCSS(tabListStyles)];

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
