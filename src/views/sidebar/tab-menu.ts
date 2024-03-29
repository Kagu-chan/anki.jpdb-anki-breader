import { componentStyles } from '@components/component-styles';
import { TabsElement } from '@components/tabs-element';
import { customElement, query, TemplateResult, html, map, when } from '@lib/lit';
import { MdMenu } from '@material/web/menu/menu.js';

@customElement('sidebar-tab-menu')
export class SidebarTabMenu extends TabsElement {
  @query('#tab-menu-menu') private _menu!: MdMenu;

  public static styles = [componentStyles];

  public render(): TemplateResult {
    return html`
      <md-icon-button
        id="tab-menu-button"
        @click="${(): boolean => (this._menu.open = !this._menu.open)}"
        ><md-icon>menu</md-icon>
      </md-icon-button>
      <md-menu
        id="tab-menu-menu"
        anchor="tab-menu-button"
        anchor-corner="start-start"
        style="max-width: 300px"
        x-offset="-16"
        positioning="popover"
      >
        ${map(
          this._tabs,
          (tab) =>
            html`<md-menu-item
              style="max-width: -webkit-fill-available"
              ?disabled="${tab.active}"
              @click="${(): Promise<void> => this.onTabClicked(tab.id)}"
            >
              ${when(
                tab.favIconUrl?.length,
                () => html`<img slot="start" class="icon" src="${tab.favIconUrl}" />`,
                () => html`<md-icon slot="start" class="icon">abc</md-icon>`,
              )}<span class="truncate">${tab.title}</span></md-menu-item
            >`,
        )}
      </md-menu>
    `;
  }

  private async onTabClicked(tabId: number): Promise<void> {
    await this._tabManager.navigateToTab(tabId);
  }
}
