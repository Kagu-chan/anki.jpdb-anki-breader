import { TemplateResult, customElement, html, query, state } from '@lib/lit';
import { MdIconButton } from '@material/web/iconbutton/icon-button';
import { MdText } from './text';

import '@material/web/iconbutton/icon-button.js';
import '@material/web/icon/icon.js';

@customElement('md-text-password')
export class MdTextPassword extends MdText {
  @state() public type: string = 'password';
  @state() protected _reveal: boolean = false;

  @query('md-icon-button') protected _iconButton?: MdIconButton;

  protected _trailingSlot: TemplateResult = html`<md-icon-button
    toggle
    ?selected="${this._reveal}"
    @change="${(): void => this.onRevealChange()}"
  >
    <md-icon>visibility</md-icon>
    <md-icon slot="selected">visibility_off</md-icon>
  </md-icon-button>`;

  protected onRevealChange(): void {
    this._reveal = this._iconButton?.selected;

    this.type = this._reveal ? 'text' : 'password';
  }
}
