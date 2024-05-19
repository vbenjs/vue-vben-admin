import type { SupportLocale } from '@vben-core/typings';

type ImportLocaleFn = () => Promise<{ default: Record<string, string> }>;

interface LocaleSetupOptions {
  /**
   * Default language
   * @default zh-CN
   */
  defaultLocale?: SupportLocale;
}

export type { ImportLocaleFn, LocaleSetupOptions, SupportLocale };
