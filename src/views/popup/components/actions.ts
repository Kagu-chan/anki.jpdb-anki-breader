import { LitElement, TemplateResult, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { openSidebar } from '@/lib/sidebar';

@customElement('popup-actions')
export class Actions extends LitElement {
  public render(): TemplateResult {
    return html`<a
        @click="${(): void => openSidebar('sidebar', true)}"
        class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"
      >
        Open in Sidebar
      </a>
      <div class="mdl-layout-spacer"></div>
      <button
        @click="${(): void => openSidebar('settings', true)}"
        class="mdl-button mdl-js-button mdl-button--icon mdl-js-ripple-effect mdl-button--colored"
      >
        <i class="material-icons">settings</i>
      </button>`;
  }

  protected createRenderRoot(): HTMLElement {
    return this;
  }
}
