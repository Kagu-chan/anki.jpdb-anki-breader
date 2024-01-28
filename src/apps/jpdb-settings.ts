import { JPDBApiKeyRequest, JPDBApiKeyResponse } from 'src/typings/jpdb';

chrome.runtime.onMessage.addListener(
  (
    request: JPDBApiKeyRequest,
    sender,
    sendResponse: (response: JPDBApiKeyResponse) => void,
  ): boolean => {
    if (request.action === 'copy-api-key') {
      const apiKey = (
        Array.from(document.querySelectorAll('td')).find(
          (node: HTMLElement) => node.innerText === 'API key',
        ).nextSibling as HTMLElement
      ).innerText;

      sendResponse({ apiKey });

      return true;
    }

    return false;
  },
);
