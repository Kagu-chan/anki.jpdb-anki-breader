import { TabElement } from '@components/tab-element';
import { TemplateResult, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('sidebar-title')
export class SidebarTitle extends TabElement {
  public render(): TemplateResult {
    return html`<h3 class="title">${this._tab?.title}</h3>`;
  }
}
