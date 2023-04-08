export type Nullable<T> = T | null;

export type RefElement = Nullable<HTMLElement>;

export type CustomizedHTMLElement<T> = HTMLElement & T;

export type TimeoutHandle = ReturnType<typeof global.setTimeout>;
