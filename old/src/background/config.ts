import { DeckId } from '../types.js';

export type Keybind = { key: string; code: string; modifiers: string[] } | null;
// Common types shared across both content and background scripts

export const CURRENT_SCHEMA_VERSION = 1;

export type Config = {
    schemaVersion: number;

    apiToken: string | null;
    ankiConnectUrl: string | null;

    miningDeck: string | null;
    miningQuery: string | null;

    blacklistDeck: string | null;
    blacklistQuery: string | null;

    neverForgetDeck: string | null;
    neverForgetQuery: string | null;

    /**
     * @deprecated
     */
    miningDeckId: DeckId | null;
    /**
     * @deprecated
     */
    forqDeckId: DeckId | null;
    /**
     * @deprecated
     */
    blacklistDeckId: DeckId | null;
    /**
     * @deprecated
     */
    neverForgetDeckId: DeckId | null;

    contextWidth: number;
    /**
     * @deprecated
     */
    forqOnMine: boolean;

    customWordCSS: string;
    customPopupCSS: string;
    hideAllFurigana: boolean;

    showPopupOnHover: boolean;
    touchscreenSupport: boolean;
    disableFadeAnimation: boolean;

    showPopupKey: Keybind;
    addKey: Keybind;
    dialogKey: Keybind;
    blacklistKey: Keybind;
    neverForgetKey: Keybind;
    /**
     * @deprecated
     */
    nothingKey: Keybind;
    /**
     * @deprecated
     */
    somethingKey: Keybind;
    againKey: Keybind;
    hardKey: Keybind;
    goodKey: Keybind;
    easyKey: Keybind;
};

export const defaultConfig: Config = {
    schemaVersion: CURRENT_SCHEMA_VERSION,

    apiToken: null,
    ankiConnectUrl: 'http://127.0.0.1:8765',

    miningDeck: null,
    miningQuery: "deck:@deck 'field:Word:@query'",

    blacklistDeck: null,
    blacklistQuery: "deck:@deck 'field:Word:@query'",

    neverForgetDeck: null,
    neverForgetQuery: "'deck:@deck' 'field:Word:@query'",

    miningDeckId: null,
    forqDeckId: null,
    blacklistDeckId: null,
    neverForgetDeckId: null,
    forqOnMine: false,
    contextWidth: 1,

    customWordCSS: '',
    customPopupCSS: '',
    hideAllFurigana: false,

    showPopupOnHover: false,
    touchscreenSupport: false,
    disableFadeAnimation: false,

    showPopupKey: { key: 'Shift', code: 'ShiftLeft', modifiers: [] },
    addKey: null,
    dialogKey: null,
    blacklistKey: null,
    neverForgetKey: null,
    nothingKey: null,
    somethingKey: null,
    againKey: null,
    hardKey: null,
    goodKey: null,
    easyKey: null,
};

function localStorageGet(key: string, fallback: any = null): any {
    const data = localStorage.getItem(key);
    if (data === null) return fallback;

    try {
        return JSON.parse(data) ?? fallback;
    } catch {
        return fallback;
    }
}

function localStorageSet(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
}

export function migrateSchema(config: Config) {
    if (config.schemaVersion === 0) {
        // Keybinds changed from string to object
        // We don't have all the information required to turn them into objects
        // Just delete them and let users re-enter them
        for (const key of [
            'showPopupKey',
            'blacklistKey',
            'neverForgetKey',
            'againKey',
            'hardKey',
            'goodKey',
            'easyKey',
        ] as const) {
            config[key] = defaultConfig[key];
        }

        config.schemaVersion = 1;
    }
}

export function loadConfig(): Config {
    const config = Object.fromEntries(
        Object.entries(defaultConfig).map(([key, defaultValue]) => [key, localStorageGet(key, defaultValue)]),
    ) as Config;

    config.schemaVersion = localStorageGet('schemaVersion', 0);
    migrateSchema(config);

    // If the schema version is not the current version after applying all migrations, give up and refuse to load the config.
    // Use the default as a fallback.
    if (config.schemaVersion !== CURRENT_SCHEMA_VERSION) {
        return defaultConfig;
    }

    return config;
}

export function saveConfig(config: Config) {
    for (const [key, value] of Object.entries(config)) {
        localStorageSet(key, value);
    }
}
