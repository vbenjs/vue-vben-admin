declare interface Fn<T = any> {
  (...arg: T[]): T;
}

// 任意对象
declare interface IObj<T = any> {
  [key: string]: T;
  [key: number]: T;
}

declare function parseInt(s: string | number, radix?: number): number;
declare function parseFloat(string: string | number): number;

declare type Dictionary<T> = Record<string, T>;

declare type Nullable<T> = T | null;

declare type RefInstanceType<T> = {
  $: T;
} | null;

declare type RefType<T> = T | null;

declare type CustomizedHTMLElement<T> = HTMLElement & T;

declare type Indexable<T> = {
  [key: string]: T;
};

declare type KeyString<T = any> = {
  [key: string]: T;
};

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? RecursivePartial<U>[]
    : T[P] extends object
    ? RecursivePartial<T[P]>
    : T[P];
};

type SelectOptions = {
  label: string;
  value: any;
}[];

type EmitType = (event: string, ...args: any[]) => void;

type TargetContext = '_self' | '_blank';
