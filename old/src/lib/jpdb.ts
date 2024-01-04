import config from './config.js';

class JPDB {
    private static _instance: JPDB;

    public static instance(): JPDB {
        if (!this._instance) {
            this._instance = new this();
        }

        return this._instance;
    }

    private constructor() {}

    public async testConnection(): Promise<boolean> {
        if (!config.apiToken?.length) {
            return false;
        }

        return true;

        // return !!(await this.invoke<DeckNamesAndIDs>('deckNamesAndIds', {}));
    }
}

export default JPDB.instance();
