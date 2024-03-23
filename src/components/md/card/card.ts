import {
  LitElement,
  TemplateResult,
  customElement,
  html,
  property,
  toggleSlots,
  unsafeCSS,
} from '@lib/lit';
import cardStyles from './card.scss';

@toggleSlots(['title', 'icon'], 'title')
@toggleSlots(['actions-start', 'actions', 'actions-end'], 'actions')
@customElement('md-card')
export class MdCard extends LitElement {
  @property({ type: Boolean }) public collapsible: boolean = false;
  @property({ type: Boolean }) public expanded: boolean = false;

  @property({ type: Boolean }) public actionsBorder: boolean = false;

  public static styles = [unsafeCSS(cardStyles)];

  public render(): TemplateResult {
    // TODO: Make collapsible plus stateful
    return html`<div class="md-card" ?collapsible="${this.collapsible}">
      <div class="title">
        <div class="title-contents"><slot name="title"></slot></div>
        <slot name="icon"></slot>
      </div>
      <div class="content"><slot></slot></div>
      <div class="actions" ?border=${this.actionsBorder}>
        <slot name="actions-start"></slot>
        <div class="grow">
          <slot name="actions"></slot>
        </div>
        <slot name="actions-end"></slot>
      </div>
    </div>`;
  }
}
