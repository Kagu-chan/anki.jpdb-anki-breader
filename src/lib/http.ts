class HTTP {
    private static _instance: HTTP;

    public static instance(): HTTP {
        if (!this._instance) {
            this._instance = new this();
        }

        return this._instance;
    }

    private constructor() {}

    async post<TIn extends object = any, TOut extends object = any>(url: string, body: TIn): Promise<TOut> {
        return fetch(url, {
            method: 'POST',
            body: JSON.stringify(body),
        }).then(response => response.json() as TOut);
    }
}

export default HTTP.instance();
