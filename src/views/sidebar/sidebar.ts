import { componentStyles } from '@components/component-styles';
import { customElement, LitElement, TemplateResult, html } from '@lib/lit';

import '@material/web/icon/icon.js';
import '@material/web/iconbutton/icon-button.js';
import '@material/web/menu/menu.js';
import '@material/web/menu/menu-item.js';

import '@components/settings-button';

import './icon';
import './tab-menu';
import './title';

@customElement('sidebar-view')
export class SidebarView extends LitElement {
  public static styles = [componentStyles];
  public render(): TemplateResult {
    return html`<div class="container">
      <div class="row flex">
        <sidebar-icon></sidebar-icon>
        <div>
          <sidebar-tab-menu></sidebar-tab-menu>
          <settings-button></settings-button>
        </div>
      </div>
      <div class="row"><sidebar-title></sidebar-title></div>
    </div>`;
  }
}
