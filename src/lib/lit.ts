import { LitElement, TemplateResult } from 'lit';

export * from 'lit';
export * from 'lit/decorators.js';

export * from 'lit/directives/class-map.js';
export * from 'lit/directives/when.js';

/**
 * Makes a property fire an event when it changes.
 *
 * @param {string} [propName] - Optional rename of the property for the event name composition.
 * @param {string} [eventName] - Optional rename of the event name.
 * @returns
 */
export const fires =
  (propName?: string, eventName?: string): PropertyDecorator =>
  (target: LitElement, propertyKey: string): void => {
    const internalPropertyKey = `___internal${propertyKey}`;
    const initialCheckKey = `___initial${propertyKey}`;
    const propertyDescriptor = Object.getOwnPropertyDescriptor(target, propertyKey);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    const originalSet = propertyDescriptor?.set;

    Object.defineProperty(target, propertyKey, {
      set(
        this: {
          dispatchEvent: (event: Event) => boolean;
          [key: string]: unknown;
        },
        value: boolean,
      ) {
        if (!this[initialCheckKey]) {
          this[initialCheckKey] = true;
          this[internalPropertyKey] = value;

          return;
        }

        if (this[internalPropertyKey] === value) {
          return;
        }

        originalSet?.call(this, value);
        this[internalPropertyKey] = value;
        this.dispatchEvent(
          new Event(eventName ?? `${propName ?? propertyKey}Changed`, { bubbles: true }),
        );
      },
      get(this: Record<string, unknown>) {
        return this[internalPropertyKey];
      },
    });
  };

/**
 * Automatically sync the hidden class of given hideTarget to wether the named slots has at least one item combined or not

 * @param {string[]} names - the names of observed slots
 * @param {string} hideTarget - the class name of the element to hide
 * @returns 
 */
export function toggleSlots(names: string[], hideTarget: string): ClassDecorator {
  return (target: Function): void => {
    const proto = target.prototype as LitElement & { render: () => TemplateResult };
    const originalRender = proto.render;

    proto.render = function render(this: LitElement): TemplateResult {
      const result = originalRender.call(this) as TemplateResult;

      setTimeout(() => {
        const slots = names.map((name) =>
          this.shadowRoot.querySelector<HTMLSlotElement>(`slot[name="${name}"]`),
        );

        const hasAssignedNodes = (): boolean =>
          slots.some((slot) => slot.assignedNodes().length > 0);
        const updateSlotDependent = (): void => {
          const hidden = !hasAssignedNodes();

          this.shadowRoot.querySelector(`.${hideTarget}`)?.classList.toggle('hidden', hidden);
        };

        slots.forEach((slot) => {
          slot.onslotchange = (): void => updateSlotDependent();
        });
        updateSlotDependent();
      }, 0);

      return result;
    };
  };
}
