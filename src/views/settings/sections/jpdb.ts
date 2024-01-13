import { MdTextPassword } from '@components/md/text/password';
import { LitElement, TemplateResult, customElement, html, property, query, state } from '@lib/lit';
import jpdbIcon from './jpdb.png';

import '@components/md/text/password';
import './section';

@customElement('settings-section-jpdb')
export class SettingsSectionJPDB extends LitElement {
  @property({ type: String }) public apiKey?: string = '';

  @state() private _hasError: boolean = false;
  @state() private _hasChanges: boolean = false;
  @state() private _isValidating: boolean = false;

  @query("[name='jpdb-api-key']") private _apiKey?: MdTextPassword;

  public render(): TemplateResult {
    return html`<settings-section
      title="JPDB"
      icon="${jpdbIcon}"
      .allowSave="${this._hasChanges && !this._hasError && !this._isValidating}"
      @save="${(): void => this.onSave()}"
    >
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
}
