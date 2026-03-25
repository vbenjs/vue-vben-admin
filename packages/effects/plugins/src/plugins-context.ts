import type { VbenPluginsOptions } from "./types";

let globalPluginsOptions: VbenPluginsOptions | null = null;

export function providePluginsOptions(options: VbenPluginsOptions) {
  globalPluginsOptions = options;
}

export function injectPluginsOptions() {
  return globalPluginsOptions;
}

export function resetPluginsOptions() {
  globalPluginsOptions = null;
}
