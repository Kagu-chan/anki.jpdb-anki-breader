import { MdTextPassword } from '@components/md/text/password';
import {
  LitElement,
  TemplateResult,
  css,
  customElement,
  html,
  property,
  query,
  state,
  when,
} from '@lib/lit';
import { TabManager } from '@lib/tab-manager';
import { JPDBApiKeyResponse } from '@typings/jpdb';
import jpdbIcon from './jpdb.png';

import '@components/md/text/password';
import '@material/web/button/text-button.js';
import '@material/web/iconbutton/icon-button.js';
import '@material/web/icon/icon.js';

@customElement('settings-section-jpdb')
export class SettingsSectionJPDB extends LitElement {
  @property({ type: String }) public apiKey?: string = '';

  @state() private _hasError: boolean = false;
  @state() private _hasChanges: boolean = false;
  @state() private _isValidating: boolean = false;
  @state() private _isJpdbSettingsOpen: boolean = false;

  @query("[name='jpdb-api-key']") private _apiKey?: MdTextPassword;

  public static styles = [
    css`
      :host {
        --md-text-button-container-height: 24px;
      }
    `,
  ];

  private JPDB_SETTINGS_URL = 'https://jpdb.io/settings';

  constructor() {
    super();

    const setTabOpenState = (tab: chrome.tabs.Tab): void => {
      this._isJpdbSettingsOpen = tab.url === this.JPDB_SETTINGS_URL;
    };

    void TabManager.instance.fetchActiveTab().then(setTabOpenState);
    TabManager.instance.onTabUpdate(setTabOpenState);
  }

  public render(): TemplateResult {
    return html`<settings-section
      title="JPDB"
      icon="${jpdbIcon}"
      .allowSave="${this._hasChanges && !this._hasError && !this._isValidating}"
      @save="${(): void => this.onSave()}"
    >
      ${when(
        this._isJpdbSettingsOpen,
        () =>
          html`<md-text-button class="small"
            aria-label="Copy API Key"
            slot="extra-icon"
            @click=${this.onCopyApiKey}
            ><md-icon slot="icon">edit</md-icon>Copy</md-text
          >`,
        () =>
          html`<md-icon-button
            aria-label="Open JPDB Settings"
            slot="extra-icon"
            @click=${this.onNavigateToJPDB}
            ><md-icon>open_in_browser</md-icon></md-icon-button
          >`,
      )}
      <md-text-password
        name="jpdb-api-key"
        label="API Key"
        required
        showValidate
        .value="${this.apiKey}"
        .validateAsync="${async (value: string): Promise<string | undefined> =>
          await this.testApiKey(value)}"
        @valueChanged="${(): void => this.onValueChange()}"
        @stateChanged="${(): void => this.onStateChanged()}"
      ></md-text-password>
    </settings-section>`;
    // TODO add jpdb options in case one does not use anki
  }

  protected onSave(): void {
    // TODO: implement
  }

  protected onValueChange(): void {
    this.apiKey = this._apiKey?.value ?? '';
  }

  protected onStateChanged(): void {
    this._hasError = !this._apiKey?.isValid;
    this._hasChanges = this._apiKey?.changed ?? false;
    this._isValidating = this._apiKey?.validating ?? false;
  }

  protected async testApiKey(_value: string): Promise<string | undefined> {
    // TODO implement actual API Key validation
    return await new Promise((resolve) => {
      setTimeout(() => {
        // resolve(undefined);
        resolve('Could not connect to JPDB with this API Key');
      }, 3000);
    });
  }

  protected async onCopyApiKey(): Promise<void> {
    const response: JPDBApiKeyResponse = await TabManager.instance.sendEvent({
      action: 'copy-api-key',
    });

    if (response.apiKey) {
      this.apiKey = response.apiKey;
    }
  }

  protected async onNavigateToJPDB(): Promise<void> {
    const [tab] = await TabManager.instance.findTabsByURL(
      this.JPDB_SETTINGS_URL.replace('https', '*'),
    );

    if (tab) {
      return await TabManager.instance.navigateToTab(tab.id);
    }
    await TabManager.instance.navigateActiveTabTo(this.JPDB_SETTINGS_URL);
  }
}
