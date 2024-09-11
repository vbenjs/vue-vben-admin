import type { Directive } from 'vue';
import { RoleEnum } from '@/enums/roleEnum';

declare module 'vue' {
  export interface ComponentCustomProperties {
    vLoading: Directive<Element, boolean>;
    vAuth: Directive<Element, string | string[] | RoleEnum[]>;
  }
}

export {};
