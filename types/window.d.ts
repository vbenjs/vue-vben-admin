import type { App } from 'vue';

declare global {
  declare const __DYNAMIC_IMPORT__: boolean;
  declare interface Window {
    // Global vue app instance
    __APP__: App<Element>;
  }
}
