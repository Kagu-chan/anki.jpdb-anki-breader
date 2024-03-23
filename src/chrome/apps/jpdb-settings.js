import { registerListener } from '@lib/messaging';

registerListener('copy-api-key', () => {
  return Array.from(document.querySelectorAll('td')).find((node) => node.innerText === 'API key')
    .nextSibling.innerText;
});
