import { componentStyles } from '@components/component-styles';
import { TabElement } from '@components/tab-element';
import { TemplateResult, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';

import '@material/web/icon/icon.js';

@customElement('sidebar-icon')
export class SidebarIcon extends TabElement {
  public static styles = [componentStyles];

  public render(): TemplateResult {
    return when(
      this._tab?.favIconUrl?.length,
      () => html`<img class="icon" src="${this._tab.favIconUrl}" />`,
      () => html`<md-icon class="icon">abc</md-icon>`,
    );
  }
}
