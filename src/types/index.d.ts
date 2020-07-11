import { Ref } from 'compatible-vue';
export type RefTyped<T> = T | Ref<T>;
export type RefElement = Element | Ref<Element | undefined>;
