import { componentStyles } from '@components/component-styles';
import { customElement, LitElement, TemplateResult, html, unsafeCSS } from '@lib/lit';
import { openSidebar } from '@lib/sidebar';
import popupStyles from './popup.scss';

import '@material/web/button/text-button';
import '@material/web/divider/divider.js';
import '@material/web/icon/icon.js';
import '@material/web/list/list.js';
import '@material/web/list/list-item.js';

import '@components/settings-button';

import './tab-list';

@customElement('popup-view')
export class PopupView extends LitElement {
  public static styles = [unsafeCSS(popupStyles), componentStyles];

  public render(): TemplateResult {
    return html`<div class="container">
      <popup-tab-list></popup-tab-list>
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
