import { componentStyles } from '@components/component-styles';
import { TabElement } from '@components/tab-element';
import { customElement, TemplateResult, html, when } from '@lib/lit';

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
