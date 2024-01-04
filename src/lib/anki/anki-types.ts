export type AnkiError = {
    error: string;
    response: null;
};
export type AnkiBody<TActionName extends string, TArgs extends object> = {
    action: TActionName;
    params?: TArgs;
    key?: string;
    version?: 6;
};
export type AnkiRequest<TActionName extends string, TArgs extends object, TResponse extends object> = {
    request: AnkiBody<TActionName, TArgs>;
    response: TResponse;
};

export type ActionFor<TAction> = TAction extends AnkiRequest<infer A, any, any> ? A : never;
export type ArgsFor<TAction> = TAction extends AnkiRequest<any, infer A, any> ? A : never;
export type ResponseFor<TAction> = TAction extends AnkiRequest<any, any, infer R> ? R : never;
export type AnkiBodyFor<TAction> = AnkiBody<ActionFor<TAction>, ArgsFor<TAction>>;
export type AnkiResponseFor<TAction> = ResponseFor<TAction> | AnkiError;

type EmptyObject = Record<string, never>;

export type DeckNamesAndIDs = AnkiRequest<'deckNamesAndIds', EmptyObject, Record<string, number>>;
export type AnkiDeck = {
    id: number;
    name: string;
};
