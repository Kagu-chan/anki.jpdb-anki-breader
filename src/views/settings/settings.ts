import { componentStyles } from '@components/component-styles';
import { LitElement, TemplateResult, html, customElement } from '@lib/lit';
import { openSidebar } from '@lib/sidebar';

import '@material/web/divider/divider.js';
import '@material/web/iconbutton/icon-button.js';
import '@material/web/icon/icon.js';
import './sections/section';
import './sections/jpdb/jpdb';
import './sections/anki';

@customElement('settings-view')
export class SettingsView extends LitElement {
  public static styles = [componentStyles];

  public render(): TemplateResult {
    return html`<div class="container">
      <div class="row flex">
        <div><h3>Settings</h3></div>
        <div>
          <md-icon-button aria-label="Close Settings" @click="${(): void => openSidebar('sidebar')}"
            ><md-icon>close</md-icon></md-icon-button
          >
        </div>
      </div>
      <settings-section-jpdb></settings-section-jpdb>
      <settings-section-anki></settings-section-anki>
      <settings-section title="Deck Management" icon="subtitles">
        <div class="row">Deck Management (ANKI)</div>
      </settings-section>
      <settings-section title="Shortcuts" icon="keyboard">
        <div class="row">Stuff like shortcuts etc</div>
      </settings-section>
      <settings-section title="Styling" icon="styles">
        <div class="row">Styling and colors</div>
      </settings-section>
    </div>`;
  }
}
