import { LitElement, TemplateResult, html } from 'lit';
import { customElement } from 'lit/decorators.js';

import '@material/web/button/text-button.js';
import '@material/web/switch/switch.js';

@customElement('sidebar-parser')
export class Header extends LitElement {
  public render(): TemplateResult {
    return html`
      <label>
        <md-switch
          icon
          show-only-selected-icon
          @change="${(e: MouseEvent): void => this.onParseChanged(e)}"
        ></md-switch>
        Parse
      </label>
    `;
  }

  private onParseChanged(event: MouseEvent): void {
    const { target } = event;

    // eslint-disable-next-line no-console
    console.log(target);
  }
}
