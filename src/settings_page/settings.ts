import { Anki } from '../background/anki.js';
import { Config, loadConfig, migrateSchema, saveConfig } from '../background/config.js';
import { requestUpdateConfig } from '../content/background_comms.js';
import { Popup } from '../content/popup.js';
import { showError } from '../content/toast.js';
import { JpdbWordData } from '../content/word.js';
import { jsxCreateElement } from '../jsx.js';
import { assert, nonNull, wrap } from '../util.js';
import { defineCustomElements, SettingElement } from './elements.js';

// Custom element definitions

// Common behavior shared for all settings elements

const POPUP_EXAMPLE_DATA: JpdbWordData = {
    context: '',
    contextOffset: 0,
    token: {
        start: 0,
        end: 0,
        length: 0,
        rubies: [],
        card: {
            vid: 1386060,
            sid: 1337383451,
            rid: 0,
            spelling: '設定',
            reading: 'せってい',
            pitchAccent: ['LHHHH'],
            meanings: [
                {
                    partOfSpeech: ['n', 'vs'],
                    glosses: [
                        'establishment',
                        'creation',
                        'posing (a problem)',
                        'setting (movie, novel, etc.)',
                        'scene',
                    ],
                },
                {
                    partOfSpeech: ['n', 'vs'],
                    glosses: ['options setting', 'preference settings', 'configuration', 'setup'],
                },
            ],
            state: ['locked', 'new'],
            frequencyRank: 2400,
        },
    },
};

let hasUnsavedChanges = false;

export function markUnsavedChanges() {
    document.body.classList.add('has-unsaved-changes');
    hasUnsavedChanges = true;
}

export function unmarkUnsavedChanges() {
    document.body.classList.remove('has-unsaved-changes');
    hasUnsavedChanges = false;
}

addEventListener(
    'beforeunload',
    event => {
        if (hasUnsavedChanges) {
            event.preventDefault();
            event.returnValue = '';
        }
    },
    { capture: true },
);

try {
    const config = loadConfig();
    const anki = new Anki();

    defineCustomElements();

    const popup = Popup.getDemoMode(nonNull(document.querySelector('#preview')), config);
    popup.setData(POPUP_EXAMPLE_DATA);
    popup.fadeIn();

    nonNull(document.querySelector('#export')).addEventListener('click', async () => {
        try {
            const a = document.createElement('a');
            a.download = 'jpdbreader-settings.json';
            a.href = `data:application/json,${encodeURIComponent(JSON.stringify(config, null, 4))}`;
            a.click();
        } catch (error) {
            showError(error);
        }
    });

    const inputFilePicker = nonNull(document.querySelector('#import-file-picker')) as HTMLInputElement;
    inputFilePicker.addEventListener('change', async () => {
        try {
            const files = inputFilePicker.files;
            console.log(files);

            if (files === null || files.length === 0) return;

            const fileContents: string = await wrap(new FileReader(), (reader, resolve, reject) => {
                reader.onload = () => {
                    assert(typeof reader.result === 'string', 'File Reader returned incorrect result type');
                    resolve(reader.result);
                };
                reader.onerror = () => reject({ message: 'Error occurred while reading file' });
                reader.readAsText(files[0]);
            });

            try {
                const data = JSON.parse(fileContents) as Config;
                migrateSchema(data);
                Object.assign(config, data);

                for (const elem of document.querySelectorAll('[name]')) {
                    (elem as any).value = (config as any)[(elem as any).name] ?? null;
                }

                markUnsavedChanges();
            } catch (error) {
                alert(`Could not import config: ${error.message}`);
            }
        } catch (error) {
            showError(error);
        }
    });

    nonNull(document.querySelector('#import')).addEventListener('click', () => {
        inputFilePicker.click();
    });

    nonNull(document.querySelector('[name="customPopupCSS"]')).addEventListener('input', event => {
        const newCSS = (event.target as HTMLInputElement).value;
        popup.updateStyle(newCSS);
    });

    for (const elem of document.querySelectorAll('[name]')) {
        (elem as any).value = (config as any)[(elem as any).name] ?? null;
    }

    const ankiEl = nonNull<HTMLInputElement | null>(document.querySelector('[name="ankiConnectUrl"]'));
    const checkAnki = (target: HTMLInputElement) => {
        const addOption = (n: string, t: HTMLSelectElement) => {
            t.appendChild(jsxCreateElement('option', { value: n }, n));
        };
        const newUrl = target.value;
        anki.testUrl(newUrl)
            .then(() => {
                target.classList.remove('error');
                target.classList.add('connected');

                return anki.deckNames(newUrl);
            })
            .then((names: string[]) => {
                document.querySelectorAll('setting-deck select').forEach((c: HTMLSelectElement) => {
                    const activeOption = config[c.name as keyof typeof config] as string;

                    c.replaceChildren();

                    addOption('', c);

                    names.forEach(n => addOption(n, c));

                    c.value = activeOption;
                });
            })
            .catch(() => {
                target.classList.remove('connected');
                target.classList.add('error');
            });
    };

    ankiEl.addEventListener('change', () => {
        checkAnki(ankiEl);
    });
    checkAnki(ankiEl);

    document.querySelectorAll('setting-deck select').forEach((e: HTMLSelectElement) => {
        e.addEventListener('input', () => {
            popup.updateCfg(
                Object.assign(config, {
                    [e.name]: e.value,
                }),
            );
        });
    });

    const saveButton = nonNull(document.querySelector('input[type=submit]'));
    saveButton.addEventListener('click', async event => {
        event.preventDefault();
        try {
            for (const name of Object.keys(config)) {
                const elem = document.querySelector(`[name="${name}"]`);
                if (elem !== null) {
                    const newValue = (elem as SettingElement).value;
                    (config as any)[name] = newValue;
                }
            }
            saveConfig(config);
            await requestUpdateConfig();

            unmarkUnsavedChanges();
        } catch (error) {
            showError(error);
        }
    });
} catch (error) {
    showError(error);
}
