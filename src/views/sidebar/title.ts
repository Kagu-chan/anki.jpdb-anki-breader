import { TabElement } from '@components/tab-element';
import { customElement, TemplateResult, html } from '@lib/lit';

@customElement('sidebar-title')
export class SidebarTitle extends TabElement {
  public render(): TemplateResult {
    return html`<h3 class="title">${this._tab?.title}</h3>`;
  }
}
