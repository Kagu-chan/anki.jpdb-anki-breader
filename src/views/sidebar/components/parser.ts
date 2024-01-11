import { LitElement, TemplateResult, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('sidebar-parser')
export class Header extends LitElement {
  @property() public activeTab: Partial<chrome.tabs.Tab> | undefined;
  @property() public tabs: Partial<chrome.tabs.Tab>[] = [];

  constructor() {
    super();

    this.collectTabData();
    this.listenToTabChanges();
  }

  public render(): TemplateResult {
    return html`<div class="mdl-card__supporting-text">
      <button
        @click="${(): void => this.parseCurrentPage()}"
        class="mdl-button mdl-js-button mdl-button--icon mdl-js-ripple-effect mdl-button--colored"
      >
        <i class="material-icons">density_small</i>
        Parse
      </button>
    </div>`;
  }

  protected createRenderRoot(): HTMLElement {
    return this;
  }

  private parseCurrentPage(): void {}

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

  // private async onParseClicked(tabId?: number): Promise<void> {
  //   if (tabId) {
  //     await chrome.tabs.update(tabId, { active: true, highlighted: true });
  //     await chrome.scripting.insertCSS({
  //       target: { tabId },
  //       css: 'body { background-color: red; }',
  //     });
  //     // await chrome.scripting.executeScript({
  //     //   target: { tabId },
  //     //   files: ['content.js'],
  //     // });
  //   }
  // }
}
