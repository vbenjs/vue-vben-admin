import type { AppLocale } from './index';

import '@vben-core/typings';

declare module '@vben-core/typings' {
  // Declaration merging adds the keys inferred from this application's menu.
  // oxlint-disable-next-line typescript/no-empty-object-type
  interface SupportedLanguages extends Record<AppLocale, string> {}
}
