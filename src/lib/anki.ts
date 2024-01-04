import { showError } from '../content/toast.js';
import config from './config.js';
import http from './http.js';
import {
    ActionFor,
    AnkiBodyFor,
    AnkiDeck,
    AnkiError,
    AnkiResponseFor,
    ArgsFor,
    DeckNamesAndIDs,
    ResponseFor,
} from './anki/anki-types.js';

class Anki {
    private static _instance: Anki;

    public static instance(): Anki {
        if (!this._instance) {
            this._instance = new this();
        }

        return this._instance;
    }

    private constructor() {}

    public async testConnection(): Promise<boolean> {
        if (!config.ankiConnectUrl?.length) {
            return false;
        }

        return !!(await this.invoke<DeckNamesAndIDs>('deckNamesAndIds', {}));
    }

    public async deckList(): Promise<AnkiDeck[]> {
        return this.invoke<DeckNamesAndIDs>('deckNamesAndIds', {}).then(list =>
            Object.entries(list!).map(([name, id]) => ({ id, name })),
        );
    }

    private async invoke<TAction>(
        action: ActionFor<TAction>,
        params: ArgsFor<TAction>,
    ): Promise<ResponseFor<TAction> | undefined> {
        const isErrorResponse = (val: AnkiResponseFor<TAction>): val is AnkiError => {
            return (
                'error' in val &&
                typeof val.error === 'string' &&
                val.error.length > 0 &&
                'response' in val &&
                val.response === null
            );
        };

        let result: AnkiResponseFor<TAction>;

        try {
            result = await http.post<AnkiBodyFor<TAction>, AnkiResponseFor<TAction>>(config.ankiConnectUrl!, {
                action,
                params,
            });

            if (isErrorResponse(result)) {
                throw result.error;
            }
        } catch (e) {
            showError(e);

            return undefined;
        }

        return result;
    }
}

export default Anki.instance();
