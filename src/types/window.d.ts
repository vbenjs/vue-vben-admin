import type { App } from 'vue';

declare global {
  declare interface Window {
    // Global vue app instance
    __APP__: App<Element>;
    __VERSION__: string;
  }
}
