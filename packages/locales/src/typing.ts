import type { SupportedLanguagesType } from '@vben-core/typings';

type ImportLocaleFn = () => Promise<{ default: Record<string, string> }>;

interface LocaleSetupOptions {
  /**
   * Default language
   * @default zh-CN
   */
  defaultLocale?: SupportedLanguagesType;
}

export type { ImportLocaleFn, LocaleSetupOptions, SupportedLanguagesType };
