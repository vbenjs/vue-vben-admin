import { Ref } from '@/setup/vue';
export type RefTyped<T> = T | Ref<T>;
export type RefElement = Element | Ref<Element | undefined>;
