import { MdTextPassword } from '@components/md/text/password';
import { MdText } from '@components/md/text/text';
import { LitElement, TemplateResult, customElement, html, property, query, state } from '@lib/lit';
import ankiIcon from './anki.png';

@customElement('settings-section-anki')
export class SettingsSectionAnki extends LitElement {
  @property({ type: String }) public ankiUrl?: string = '';
  @property({ type: String }) public ankiApiKey?: string = '';

  @state() private _hasError: boolean = false;
  @state() private _hasChanges: boolean = false;
  @state() private _isValidating: boolean = false;

  @query("[name='anki-url']") private _ankiUrl?: MdText;
  @query("[name='anki-api-key']") private _apiKey?: MdTextPassword;

  // function compositeValidate(fields: this._ankiUrl, this._apiKey) => implement this somehow - wenn anki sagt "jo", dann ist beides korrekt. ansonsten prüfen was falsch ist und das zurückgeben, sodass ein ungültiger api key nicht als ungültige url angezeigt wird.

  public render(): TemplateResult {
    return html`<settings-section
      title="Anki"
      icon="${ankiIcon}"
      .allowSave="${this._hasChanges && !this._hasError && !this._isValidating}"
      @save="${(): void => this.onSave()}"
    >
      <md-text
        name="anki-url"
        label="Anki-Connect URL"
        required
        showValidate
        .value="${this.ankiUrl}"
        .validateAsync="${async (value: string): Promise<string | undefined> =>
          await this.testAnkiUrl(value)}"
        @valueChanged="${(): void => this.onValueChange()}"
        @stateChanged="${(): void => this.onStateChanged()}"
      ></md-text>
      <md-text-password
        name="anki-api-key"
        label="API Key"
        showValidate
        .value="${this.ankiApiKey}"
        .validateAsync="${async (value: string): Promise<string | undefined> =>
          await this.testAnkiApiKey(value)}"
        @valueChanged="${(): void => this.onValueChange()}"
        @stateChanged="${(): void => this.onStateChanged()}"
      ></md-text-password>
    </settings-section>`;
    // TODO: Extra Validation for anki? because optional api key.
    // Or they would just use the same validate fn and trigger revalidate on text field
  }

  protected onSave(): void {
    // TODO: implement
  }

  protected onValueChange(): void {
    this.ankiUrl = this._ankiUrl?.value ?? '';
    this.ankiApiKey = this._apiKey?.value ?? '';
  }

  protected onStateChanged(): void {
    this._hasError = [this._apiKey?.isValid, this._ankiUrl?.isValid].includes(false);
    this._hasChanges = [this._apiKey?.changed, this._ankiUrl?.changed].includes(true);
    this._isValidating = [this._apiKey?.changed, this._ankiUrl?.changed].includes(true);
  }

  protected async testAnkiUrl(_value: string): Promise<string | undefined> {
    // TODO implement actual Anki Connect validation
    return await new Promise((resolve) => {
      setTimeout(() => {
        // resolve(undefined);
        resolve('Could not connect to Anki with this URL');
      }, 3000);
    });
  }

  protected async testAnkiApiKey(_value: string): Promise<string | undefined> {
    // TODO implement actual Anki Connect validation
    return await new Promise((resolve) => {
      setTimeout(() => {
        // resolve(undefined);
        resolve('API Key is wrong');
      }, 3000);
    });
  }
}
