import {
  LitElement,
  TemplateResult,
  css,
  customElement,
  fires,
  html,
  nothing,
  property,
  query,
  state,
  when,
} from '@lib/lit';
import { MdOutlinedTextField } from '@material/web/textfield/outlined-text-field.js';
import { Subject, debounceTime, tap } from 'rxjs';

import '@material/web/progress/circular-progress.js';
import '@material/web/textfield/outlined-text-field.js';

@customElement('md-text')
export class MdText extends LitElement {
  @fires() @property({ type: String, reflect: true }) public value: string;
  @property({ type: String }) public id: string;
  @property({ type: String }) public name: string;
  @property({ type: String }) public label: string;
  @property({ type: String }) public type: string = 'text';
  @property({ type: Boolean }) public disabled?: boolean;
  @property({ type: Boolean }) public required?: boolean;
  @property({ type: Boolean }) public showValidate?: boolean;
  @property({ type: Function }) public validate?: (value: string) => string | undefined;
  @property({ type: Function }) public validateAsync?: (
    value: string,
  ) => Promise<string | undefined>;

  @fires('state') @state() protected _changed: boolean = false;
  @fires('state') @state() protected _isValid: boolean = true;
  @fires('state') @state() protected _isValidating: boolean = false;
  @state() protected _isValidatingAsync: boolean = false;
  @state() protected _errorText: string = '';

  @query('md-outlined-text-field') protected _textField?: MdOutlinedTextField;

  public get changed(): boolean {
    return this._changed;
  }

  public get isValid(): boolean {
    return this._isValid;
  }

  public get validating(): boolean {
    return this._isValidating;
  }

  public get errorText(): string {
    return this._errorText;
  }

  public static styles = [
    css`
      :host {
        --md-circular-progress-size: 40px;
      }
    `,
  ];

  protected _initialValue: string;
  protected _leadingSlot: TemplateResult;
  protected _trailingSlot: TemplateResult;

  protected _changeSubject: Subject<void> = new Subject<void>();

  public render(): TemplateResult {
    return html`
      <md-outlined-text-field
        style="width: 100%"
        .id="${this.id ?? nothing}"
        .name="${this.name ?? nothing}"
        .label="${this.label ?? this.name ?? nothing}"
        .value="${this.value}"
        .type="${this.type}"
        .errorText="${this._errorText ?? nothing}"
        ?required="${this.required}"
        ?disabled="${this.disabled}"
        ?error="${!this._isValid}"
        @input="${(): void => this.onInput()}"
        @change="${(): void => this.onChange()}"
        >${this._leadingSlot
          ? html`<span slot="leading-icon">${this._leadingSlot}</span>`
          : nothing}
        <span slot="trailing-icon">
          ${when(
            this.showValidate && this._isValidatingAsync,
            () => html`<md-circular-progress indeterminate></md-circular-progress>`,
          )}${this._trailingSlot ?? nothing}</span
        >
      </md-outlined-text-field>
    `;
  }

  public connectedCallback(): void {
    super.connectedCallback();

    this._changeSubject
      .pipe(
        tap(() => {
          this._isValidating = true;
        }),
        debounceTime(this.validateAsync ? 250 : 100),
      )
      .subscribe(() => {
        this.updateValue();
      });
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();

    this._changeSubject.unsubscribe();
  }

  public firstUpdated(): void {
    this._initialValue = this.value;

    this.onblur = (): void => {
      this._changeSubject.next();
    };
  }

  public setValue(value: string): void {
    this.value = value;

    this._changeSubject.next();
  }

  protected onInput(): void {
    this._changeSubject.next();
  }
  protected onChange(): void {
    this._changeSubject.next();
  }

  protected updateValue(): void {
    const setValidState = (errorText: string): void => {
      this._isValid = errorText === '';
      this._errorText = errorText;
      this._isValidating = false;
      this._isValidatingAsync = false;

      this._textField?.setCustomValidity(errorText);
    };

    this.value = this._textField?.value;
    this._changed = this.value !== this._initialValue;

    if (this.required && !this.value) {
      return setValidState('This field is required');
    }

    if (this.validate) {
      const errorText = this.validate(this.value);

      if (errorText?.length) {
        return setValidState(errorText);
      }
    }

    if (this.validateAsync) {
      this._isValidatingAsync = true;

      return void this.validateAsync(this.value).then((errorText) => {
        setValidState(errorText ?? '');
      });
    }

    setValidState('');
  }
}
