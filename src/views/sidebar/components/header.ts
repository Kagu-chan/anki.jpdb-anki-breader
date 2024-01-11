import { LitElement, TemplateResult, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';
import { when } from 'lit/directives/when.js';
import { openSidebar } from '@/lib/sidebar';

@customElement('sidebar-header')
export class Header extends LitElement {
  @property() public activeTab: Partial<chrome.tabs.Tab> | undefined;
  @property() public tabs: Partial<chrome.tabs.Tab>[] = [];

  constructor() {
    super();

    this.collectTabData();
    this.listenToTabChanges();
  }

  public render(): TemplateResult {
    return html`<div class="mdl-card__title no-spacing pb-0">
        ${when(
          this.activeTab?.favIconUrl?.length,
          () => html`<img src="${this.activeTab?.favIconUrl}" />`,
          () => html`<i class="material-icons mdl-list__item-icon">abc</i>`,
        )}
        <div class="mdl-layout-spacer"></div>
        <button id="tab-selector" class="mdl-button mdl-js-button mdl-button--icon">
          <i class="material-icons">menu</i>
        </button>
        <div class="mdl-tooltip" for="tab-selector">Change active tab</div>
        <ul
          class="mdl-menu mdl-menu--bottom-right mdl-js-menu mdl-js-ripple-effect"
          for="tab-selector"
        >
          ${map(
            this.tabs,
            (tab) =>
              html`<li
                class="mdl-menu__item"
                ?disabled=${tab.active}
                @click="${(): Promise<void> => this.onParseClicked(tab.id)}"
              >
                ${when(
                  tab.favIconUrl?.length,
                  () => html`<img src="${tab.favIconUrl}" />`,
                  () => html`<i class="material-icons mdl-menu__item-icon">abc</i>`,
                )}
                ${tab.title}
              </li>`,
          )}
        </ul>
        <button
          @click="${(): void => openSidebar('settings')}"
          class="mdl-button mdl-js-button mdl-button--icon mdl-js-ripple-effect mdl-button--colored"
        >
          <i class="material-icons">settings</i>
        </button>
      </div>
      <div class="mdl-card__title">
        <h2 class="mdl-card__title-text">${this.activeTab?.title}</h2>
      </div>`;
  }

  protected createRenderRoot(): HTMLElement {
    return this;
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
