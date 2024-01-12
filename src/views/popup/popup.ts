import { componentStyles } from '@components/component-styles';
import { openSidebar } from '@lib/sidebar';
import { LitElement, TemplateResult, html, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';

import '@components/settings-button';
import '@material/web/button/text-button';
import '@material/web/icon/icon.js';
import '@material/web/divider/divider.js';

import './components/tab-list';

import popupStyles from './popup.scss';

@customElement('popup-view')
export class PopupView extends LitElement {
  public static styles = [unsafeCSS(popupStyles), componentStyles];

  public render(): TemplateResult {
    return html`<div class="container">
      <div class="tab-list">
        <popup-tab-list></popup-tab-list>
      </div>
      <md-divider></md-divider>
      <div class="actions flex p1">
        <md-text-button
          aria-label="Open sidebar"
          @click="${(): void => openSidebar('sidebar', true)}"
        >
          <md-icon slot="icon">view_sidebar</md-icon>
          Open sidebar
        </md-text-button>
        <settings-button close-window></settings-button>
      </div>
    </div>`;
  }
}
