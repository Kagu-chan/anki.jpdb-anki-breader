import anki from '../../lib/anki.js';
import config from '../../lib/config.js';
import jpdb from '../../lib/jpdb.js';
import { defineCustomElements } from './components.js';
// import config from '../../lib/config/config.js';

defineCustomElements();

class Settings {
    private static _instance: Settings;

    public static instance(): Settings {
        if (!this._instance) {
            this._instance = new this();
        }

        return this._instance;
    }
    private constructor() {
        this.setupListeners();
        this.setupMainView();
    }

    private hasUnsavedChanges: boolean = false;

    private setupListeners(): void {
        addEventListener(
            'beforeunload',
            event => {
                if (this.hasUnsavedChanges) {
                    event.preventDefault();
                    event.returnValue = '';
                }
            },
            { capture: true },
        );

        config.listen(['update', 'reset'], 'ankiConnectUrl', this.initAnki);
        config.listen(['load'], 'ankiConnectUrl', this.initAnki, true);

        config.listen(['update', 'reset'], 'apiToken', this.initJpdb);
        config.listen(['load'], 'apiToken', this.initJpdb, true);
    }

    private setupMainView(): void {
        // Promise.all([this.initAnki()]);
    }

    private async initAnki(): Promise<void> {
        const connected = await anki.testConnection();

        if (connected) {
            await anki.deckList().then(console.log);
        }
    }

    private async initJpdb(): Promise<void> {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const connected = await jpdb.testConnection();
    }
}

export default Settings.instance();
