import { registerListener } from '@lib/messaging';

registerListener('copy-api-key', (): string => {
  return (
    Array.from(document.querySelectorAll('td')).find(
      (node: HTMLElement) => node.innerText === 'API key',
    ).nextSibling as HTMLElement
  ).innerText;
});
