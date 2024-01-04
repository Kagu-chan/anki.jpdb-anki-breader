const ankiQuerySpecialCharacters = ['"', '*', '_', '\\', ':'];

export type AnkiExportMode = 'gui' | 'updateLast' | 'default';
export interface Fetcher {
    fetch: (url: string, body: any) => Promise<any>;
}

export class HttpFetcher implements Fetcher {
    async fetch<T = any>(url: string, body: any): Promise<T> {
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(body),
        });
        return (await response.json()) as T;
    }
}

export class Anki {
    constructor(private fetcher = new HttpFetcher()) {
        this.fetcher = fetcher;
    }

    async testUrl(newUrl: string | null): Promise<boolean> {
        const response = await this._executeAction('deckNames', null, newUrl);
        return !!response.result;
    }

    async deckNames(ankiUrl: string): Promise<string[]> {
        const response = await this._executeAction('deckNames', null, ankiUrl);
        return response.result;
    }

    async modelNames(ankiUrl: string) {
        const response = await this._executeAction('modelNames', null, ankiUrl);
        return response.result;
    }

    async modelFieldNames(ankiUrl: string, modelName: string) {
        const response = await this._executeAction('modelFieldNames', { modelName: modelName }, ankiUrl);
        return response.result;
    }

    async findNotesWithWord(_word: string) {
        // const response = await this._executeAction(
        //     'findNotes',
        //     { query: this.settingsProvider.wordField + ':' + this._escapeQuery(word) },
        //     ankiConnectUrl,
        // );
        // return response.result;
    }

    async findNotesWithWordGui(_word: string) {
        // const response = await this._executeAction(
        //     'guiBrowse',
        //     { query: this.settingsProvider.wordField + ':' + this._escapeQuery(word) },
        //     ankiConnectUrl,
        // );
        // return response.result;
    }

    private _escapeQuery(query: string) {
        let escaped = '';

        for (let i = 0; i < query.length; ++i) {
            const char = query[i];
            if (ankiQuerySpecialCharacters.includes(char)) {
                escaped += `\\${char}`;
            } else {
                escaped += char;
            }
        }

        return `"${escaped}"`;
    }

    async requestPermission(ankiUrl: string) {
        const response = await this._executeAction('requestPermission', null, ankiUrl);
        return response.result;
    }

    async export(
        _text: string | undefined,
        _definition: string | undefined,
        _word: string | undefined,
        _source: string | undefined,
        _url: string | undefined,
        _customFieldValues: { [key: string]: string },
        _tags: string[],
        _mode: AnkiExportMode,
    ) {
        // const fields = {};
        // this._appendField(fields, this.settingsProvider.sentenceField, text, true);
        // this._appendField(fields, this.settingsProvider.definitionField, definition, true);
        // this._appendField(fields, this.settingsProvider.wordField, word, false);
        // this._appendField(fields, this.settingsProvider.sourceField, source, false);
        // this._appendField(fields, this.settingsProvider.urlField, url, false);
        // if (customFieldValues) {
        //     for (const customFieldName of Object.keys(customFieldValues)) {
        //         this._appendField(
        //             fields,
        //             this.settingsProvider.customAnkiFields[customFieldName],
        //             customFieldValues[customFieldName],
        //             true,
        //         );
        //     }
        // }
        // const params: any = {
        //     note: {
        //         deckName: this.settingsProvider.deck,
        //         modelName: this.settingsProvider.noteType,
        //         tags: tags,
        //         options: {
        //             allowDuplicate: false,
        //             duplicateScope: 'deck',
        //             duplicateScopeOptions: {
        //                 deckName: this.settingsProvider.deck,
        //                 checkChildren: false,
        //             },
        //         },
        //     },
        // };
        // let recentNotes, lastNoteId, infoResponse;
        // params.note['fields'] = fields;
        // switch (mode) {
        //     case 'gui':
        //         return (await this._executeAction('guiAddCards', params, ankiConnectUrl)).result;
        //     case 'updateLast':
        //         recentNotes = (
        //             await this._executeAction('findNotes', { query: 'added:1' }, ankiConnectUrl)
        //         ).result.sort();
        //         if (recentNotes.length === 0) {
        //             throw new Error('Could not find note to update');
        //         }
        //         lastNoteId = recentNotes[recentNotes.length - 1];
        //         params.note['id'] = lastNoteId;
        //         infoResponse = await this._executeAction('notesInfo', { notes: [lastNoteId] });
        //         if (infoResponse.result.length > 0 && infoResponse.result[0].noteId === lastNoteId) {
        //             const info = infoResponse.result[0];
        //             if (
        //                 this.settingsProvider.sentenceField &&
        //                 info.fields &&
        //                 typeof info.fields[this.settingsProvider.sentenceField]?.value === 'string' &&
        //                 typeof params.note.fields[this.settingsProvider.sentenceField] === 'string'
        //             ) {
        //                 params.note.fields[this.settingsProvider.sentenceField] = this._inheritHtmlMarkup(
        //                     params.note.fields[this.settingsProvider.sentenceField],
        //                     info.fields[this.settingsProvider.sentenceField].value,
        //                 );
        //             }
        //             await this._executeAction('updateNoteFields', params, ankiConnectUrl);
        //             if (tags.length > 0) {
        //                 await this._executeAction(
        //                     'addTags',
        //                     { notes: [lastNoteId], tags: tags.join(' ') },
        //                     ankiConnectUrl,
        //                 );
        //             }
        //             if (!this.settingsProvider.wordField || !info.fields) {
        //                 return info.noteId;
        //             }
        //             const wordField = info.fields[this.settingsProvider.wordField];
        //             if (!wordField || !wordField.value) {
        //                 return info.noteId;
        //             }
        //             return wordField.value;
        //         }
        //         throw new Error('Could not update last card because the card info could not be fetched');
        //     case 'default':
        //         return (await this._executeAction('addNote', params, ankiConnectUrl)).result;
        //     default:
        //         throw new Error('Unknown export mode: ' + mode);
        // }
    }

    private _appendField(fields: any, fieldName: string | undefined, value: string | undefined, multiline: boolean) {
        if (!fieldName || !value) {
            return;
        }

        let newValue = multiline ? value.split('\n').join('<br>') : value;
        const existingValue = fields[fieldName];

        if (existingValue) {
            newValue = existingValue + '<br>' + newValue;
        }

        fields[fieldName] = newValue;
    }

    private _inheritHtmlMarkup(original: string, markedUp: string) {
        const htmlTagRegex = RegExp('<[^>]*>(.*?)</[^>]*>', 'ig');
        const markedUpWithoutBreaklines = markedUp.replace('<br>', '');
        let inherited = original;

        while (true) {
            const match = htmlTagRegex.exec(markedUpWithoutBreaklines);

            if (match === null || match.length < 2) {
                break;
            }

            inherited = inherited.replace(match[1], match[0]);
        }

        return inherited;
    }

    private async _executeAction<T = any>(action: string, params: any, url: string | null): Promise<T> {
        type AnkiResponse = { error: string };

        if (url === null) {
            throw new Error('Anki connect not configured!');
        }

        const body: any = {
            action: action,
            version: 6,
        };

        if (params) {
            body['params'] = params;
        }

        const json = await this.fetcher.fetch<T>(url as string, body);

        if ((json as AnkiResponse).error) {
            throw new Error((json as AnkiResponse).error);
        }

        return json;
    }
}
