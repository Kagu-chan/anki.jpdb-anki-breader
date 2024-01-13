import { componentStyles } from '@components/component-styles';
import { LitElement, TemplateResult, html, customElement, property } from '@lib/lit';

import '@components/md/card/card';
import '@material/web/button/text-button.js';
import '@material/web/icon/icon.js';

@customElement('settings-section')
export class SettingsSection extends LitElement {
  @property({ type: String }) public title: string;
  @property({ type: String }) public icon: string;
  @property({ type: Boolean }) public allowSave: boolean;

  public static styles = [componentStyles];

  public render(): TemplateResult {
    return html` <md-card collapsible actionsBorder>
      <div slot="title">${this.title}</div>
      ${this._isImage(this.icon)
        ? html`<img class="icon" slot="icon" src="${this.icon}" />`
        : html`<md-icon class="icon" slot="icon">${this.icon}</md-icon>`}
      <slot></slot>
      <md-text-button
        slot="actions-end"
        ?disabled="${!this.allowSave}"
        @click="${(): boolean => this.dispatchEvent(new Event('save', { bubbles: true }))}"
        >Save<md-icon slot="icon">save</md-icon></md-text-button
      >
    </md-card>`;
  }

  private _isImage(icon: string): boolean {
    return !icon.match(/^[a-z_]+$/);
  }
}
