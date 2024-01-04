import { Keybind } from './keybind.js';

export interface IConfig {
    apiToken: string | null;
    ankiConnectUrl: string | null;
    ankiApiKey: string | null;

    miningDeck: string | null;
    miningQuery: string | null;

    blacklistDeck: string | null;
    blacklistQuery: string | null;

    neverForgetDeck: string | null;
    neverForgetQuery: string | null;

    contextWidth: number;

    customWordCSS: string;
    customPopupCSS: string;
    hideAllFurigana: boolean;

    showPopupOnHover: boolean;
    touchscreenSupport: boolean;
    disableFadeAnimation: boolean;

    showPopupKey: Keybind | null;
    addKey: Keybind | null;
    dialogKey: Keybind | null;
    blacklistKey: Keybind | null;
    neverForgetKey: Keybind | null;

    againKey: Keybind | null;
    hardKey: Keybind | null;
    goodKey: Keybind | null;
    easyKey: Keybind | null;
}
