import type { LocaleSupportType } from '@vben-core/typings';

type ImportLocaleFn = () => Promise<{ default: Record<string, string> }>;

interface LocaleSetupOptions {
  /**
   * Default language
   * @default zh-CN
   */
  defaultLocale?: LocaleSupportType;
}

export type { ImportLocaleFn, LocaleSetupOptions, LocaleSupportType };
