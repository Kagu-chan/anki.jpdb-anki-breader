import config from './config.js';

class State {
    private static _instance: State;

    public static instance(): State {
        if (!this._instance) {
            this._instance = new this();
        }

        return this._instance;
    }

    private _config: typeof config;

    private constructor() {
        this._config = new Proxy(config, {
            set(target: typeof config, p: string | symbol, newValue: any, receiver: any): boolean {
                Object.assign(target, { [p]: newValue });

                console.log(p, newValue);
                return true;
            },
        });
    }
}

export default State.instance();
