import { openSidebar } from '@lib/sidebar';
import { LitElement, TemplateResult, html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';
import { when } from 'lit/directives/when.js';

import '@material/web/icon/icon.js';
import '@material/web/iconbutton/icon-button.js';
import '@material/web/menu/menu.js';
import '@material/web/menu/menu-item.js';

@customElement('sidebar-header')
export class Header extends LitElement {
  @property() public activeTab: Partial<chrome.tabs.Tab> | undefined;
  @property() public tabs: Partial<chrome.tabs.Tab>[] = [];
  @query('#tab-selector-menu') private tabSelectorMenu?: HTMLElement;

  constructor() {
    super();

    this.collectTabData();
    this.listenToTabChanges();
  }

  public render(): TemplateResult {
    return html`
        ${when(
          this.activeTab?.favIconUrl?.length,
          () => html`<img src="${this.activeTab?.favIconUrl}" />`,
          () => html`<md-icon>abc</md-icon>`,
        )}

        <span style="position: relative">
          <md-icon-button id="tab-selector-anchor" aria-label="Change active tab" @click="${(this.tabSelectorMenu.open =
            !this.tabSelectorMenu.open)}">
            <md-icon>menu</md-icon>
          </md-icon-button>
          <md-menu id="tab-selector-menu" anchor="tab-selector-anchor">
            ${map(
              this.tabs,
              (tab) =>
                html`<md-menu-item
                  ?disabled=${tab.active}
                  @click="${(): Promise<void> => this.onParseClicked(tab.id)}"
                >
                  <div slot="headline">
                    ${when(
                      tab.favIconUrl?.length,
                      () => html`<img src="${tab.favIconUrl}" />`,
                      () => html`<md-icon>abc</md-icon>`,
                    )}
                    ${tab.title}
                  </div>
                </md-menu-item>`,
            )}
          </md-menu>
        </span>

        <div class="mdl-tooltip" for="tab-selector">Change active tab</div>

        <ul
          class="mdl-menu mdl-menu--bottom-right mdl-js-menu mdl-js-ripple-effect"
          for="tab-selector"
        >
          
        </ul>
        <md-icon-button aria-label="Settings" @click="${(): void => openSidebar('settings')}">
          <md-icon>settings</md-icon>
        </md-icon-button>
      </div>
      <div class="mdl-card__title">
        <h2 class="mdl-card__title-text">${this.activeTab?.title}</h2>
      </div>`;
  }

  private collectTabData(): void {
    if (chrome?.tabs) {
      chrome.tabs.query({ currentWindow: true }, (tabs) => {
        this.tabs = tabs;
        this.activeTab = tabs.find((tab) => tab.active);
      });
    }
  }

  private listenToTabChanges(): void {
    chrome.tabs.onUpdated.addListener(() => {
      this.collectTabData();
    });
  }

  private async onParseClicked(tabId?: number): Promise<void> {
    if (tabId) {
      await chrome.tabs.update(tabId, { active: true, highlighted: true });
      await chrome.scripting.insertCSS({
        target: { tabId },
        css: 'body { background-color: red; }',
      });
      // await chrome.scripting.executeScript({
      //   target: { tabId },
      //   files: ['content.js'],
      // });
    }
  }
}
