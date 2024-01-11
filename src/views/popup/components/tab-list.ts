import { LitElement, TemplateResult, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';
import { when } from 'lit/directives/when.js';

@customElement('tab-list')
export class TabList extends LitElement {
  @property() public tabs: Partial<chrome.tabs.Tab>[] = [];

  constructor() {
    super();

    this.getWindowTabs();
  }

  public render(): TemplateResult {
    return html`<ul class="mdl-list">
      ${map(
        this.tabs,
        (tab) =>
          html`<li class="mdl-list__item">
            <span class="mdl-list__item-primary-content">
              <a
                class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"
                @click="${(): Promise<void> => this.onParseClicked(tab.id)}"
              >
                ${when(
                  tab.favIconUrl?.length,
                  () => html`<img src="${tab.favIconUrl}" />`,
                  () => html`<i class="material-icons mdl-list__item-icon">abc</i>`,
                )}
                ${tab.title}
              </a>
            </span>
          </li>`,
      )}
    </ul>`;
    // <i class="material-icons mdl-list__item-icon">person</i>
  }

  protected createRenderRoot(): HTMLElement {
    return this;
  }

  protected getWindowTabs(): void {
    if (chrome?.tabs) {
      chrome.tabs.query({ lastFocusedWindow: true }, (tabs) => {
        this.tabs = tabs.sort((a) => (a.active ? -1 : 1));
      });
    } else {
      this.tabs = [
        {
          title: 'Test tab 1',
          favIconUrl: 'https://www.google.com/favicon.ico',
        },
        {
          title: 'Test tab 2',
        },
        {
          title: 'Test tab 3',
          favIconUrl: 'https://www.google.com/favicon.ico',
        },
      ];
    }
  }

  protected async onParseClicked(tabId?: number): Promise<void> {
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

      window.close();
    }
  }
}
