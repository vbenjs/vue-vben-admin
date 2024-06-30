import type { SupportedLanguagesType } from '@vben-core/typings';

type ImportLocaleFn = () => Promise<{ default: Record<string, string> }>;

interface LocaleSetupOptions {
  /**
   * Default language
   * @default zh-CN
   */
  defaultLocale?: SupportedLanguagesType;
  /**
   * Load third-party library messages
   * @param lang
   * @returns
   */
  loadThirdPartyMessage?: (lang: SupportedLanguagesType) => Promise<void>;
}

export type { ImportLocaleFn, LocaleSetupOptions, SupportedLanguagesType };
