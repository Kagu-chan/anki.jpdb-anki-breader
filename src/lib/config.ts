import { IConfig } from './config/config.interface.js';
import { defaultConfig } from './config/default-config.js';
import { Keybind } from './config/keybind.js';

class Config implements IConfig {
    private static _instance: Config;

    public static instance(): Config {
        if (!this._instance) {
            this._instance = new Proxy(new this(), {
                set(target: Config, p: string, newValue: any): boolean {
                    Object.assign(target, { [p]: newValue });

                    this.emit(`update-${p}`, newValue);

                    return true;
                },
            });
        }

        return this._instance;
    }

    private constructor() {
        this.load();
    }

    public apiToken: string | null;

    public ankiConnectUrl: string | null;
    public ankiApiKey: string | null;

    public miningDeck: string | null;
    public miningQuery: string | null;

    public blacklistDeck: string | null;
    public blacklistQuery: string | null;

    public neverForgetDeck: string | null;
    public neverForgetQuery: string | null;

    public contextWidth: number;

    public customWordCSS: string;
    public customPopupCSS: string;
    public hideAllFurigana: boolean;

    public showPopupOnHover: boolean;
    public touchscreenSupport: boolean;
    public disableFadeAnimation: boolean;

    public showPopupKey: Keybind | null;
    public addKey: Keybind | null;
    public dialogKey: Keybind | null;
    public blacklistKey: Keybind | null;
    public neverForgetKey: Keybind | null;

    public againKey: Keybind | null;
    public hardKey: Keybind | null;
    public goodKey: Keybind | null;
    public easyKey: Keybind | null;

    private _listeners = new Map<string, ((...args: unknown[]) => void)[]>();
    private _pastEvents = new Map<string, unknown[]>();

    public listen<TArgs extends any[] = []>(
        eventTypes: ('update' | 'load' | 'reset')[],
        configKey: keyof IConfig,
        fn: (...args: TArgs) => void,
        buffered?: boolean,
    ): void {
        eventTypes.forEach(eventType => {
            const event = `${eventType}-${configKey}`;
            const ar: ((...args: unknown[]) => void)[] = this._listeners.get(event) ?? [];

            ar.push(fn);

            this._listeners.set(event, ar);

            if (buffered) {
                const buffer = this._pastEvents.get(event) ?? [];

                buffer.forEach(args => fn(...(args as TArgs)));
            }
        });
    }

    public setDefault(key: keyof IConfig): void {
        this.emit(`reset-${key}`, defaultConfig[key]);

        Object.assign(this, { [key]: defaultConfig[key] });
    }

    public isDefault(key: keyof IConfig): IConfig[keyof IConfig] {
        return this[key] === defaultConfig[key];
    }

    public load(): void {
        Object.entries(defaultConfig).map(([key, value]: [keyof IConfig, any]) => {
            this.emit(`load-${key}`, value);

            Object.assign(this, { [key]: this.localStorageGet(key, value) });
        });
    }

    public save(): void {
        Object.keys(defaultConfig).forEach((key: keyof IConfig) => {
            this.localStorageSet(key, this[key]);
        });
    }

    private localStorageGet<T extends IConfig[keyof IConfig]>(key: keyof IConfig, defautlValue: T): T {
        const data = localStorage.getItem(key);
        if (data === null) {
            return defautlValue;
        }

        try {
            return (JSON.parse(data) as T) ?? defautlValue;
        } catch {
            return defautlValue;
        }
    }

    private localStorageSet(key: string, value: any) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    private emit(event: string, ...args: unknown[]): void {
        this._listeners.get(event)?.forEach(fn => fn(...args));

        const buf = this._pastEvents.get(event) ?? [];
        buf.push(args);

        this._pastEvents.set(event, buf);
    }
}

export default Config.instance();
