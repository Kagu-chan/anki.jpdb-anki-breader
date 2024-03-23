import { customElement, html, LitElement, property, TemplateResult } from '@lib/lit';
import { openSidebar } from '@lib/sidebar';

import '@material/web/iconbutton/icon-button.js';
import '@material/web/icon/icon.js';

@customElement('settings-button')
export class SettingsButton extends LitElement {
  @property({ type: Boolean, attribute: 'close-window' }) public closeWindow?: boolean;

  public render(): TemplateResult {
    return html`<md-icon-button
      aria-label="Settings"
      @click="${(): void => openSidebar('settings', this.closeWindow)}"
      ><md-icon>settings</md-icon></md-icon-button
    >`;
  }
}
