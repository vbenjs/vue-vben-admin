import type { VbenPluginsOptions } from './types';

let globalPluginsOptions: null | VbenPluginsOptions = null;

export function providePluginsOptions(options: VbenPluginsOptions) {
  if (!globalPluginsOptions) {
    globalPluginsOptions = options;
    return;
  }

  globalPluginsOptions = {
    ...globalPluginsOptions,
    ...options,
    form:
      globalPluginsOptions.form && options.form
        ? { ...globalPluginsOptions.form, ...options.form }
        : globalPluginsOptions.form || options.form,
    modal:
      globalPluginsOptions.modal && options.modal
        ? { ...globalPluginsOptions.modal, ...options.modal }
        : globalPluginsOptions.modal || options.modal,
    message:
      globalPluginsOptions.message && options.message
        ? { ...globalPluginsOptions.message, ...options.message }
        : globalPluginsOptions.message || options.message,
    components: {
      ...globalPluginsOptions.components,
      ...options.components,
    },
  };
}

export function injectPluginsOptions() {
  return globalPluginsOptions;
}

export function resetPluginsOptions() {
  globalPluginsOptions = null;
}
