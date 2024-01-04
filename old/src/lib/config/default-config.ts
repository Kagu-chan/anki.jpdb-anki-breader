import { IConfig } from './config.interface.js';

export const defaultConfig: IConfig = {
    ankiConnectUrl: 'http://127.0.0.1:8765',

    miningQuery: "deck:@deck 'field:Word:@query'",
    blacklistQuery: "deck:@deck 'field:Word:@query'",
    neverForgetQuery: "'deck:@deck' 'field:Word:@query'",

    contextWidth: 1,

    customWordCSS: '',
    customPopupCSS: '',
    hideAllFurigana: false,

    showPopupOnHover: false,
    touchscreenSupport: false,
    disableFadeAnimation: false,

    showPopupKey: { key: 'Shift', code: 'ShiftLeft', modifiers: [] },

    apiToken: null,
    ankiApiKey: null,

    miningDeck: null,
    blacklistDeck: null,
    neverForgetDeck: null,

    addKey: null,
    dialogKey: null,
    blacklistKey: null,
    neverForgetKey: null,

    againKey: null,
    hardKey: null,
    goodKey: null,
    easyKey: null,
};
