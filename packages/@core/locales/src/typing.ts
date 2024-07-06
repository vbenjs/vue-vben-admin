import type { SupportedLanguagesType } from '@vben-core/typings';

type ImportLocaleFn = () => Promise<{ default: Record<string, string> }>;

type LoadMessageFn = (
  lang: SupportedLanguagesType,
) => Promise<Record<string, string>>;

interface LocaleSetupOptions {
  /**
   * Default language
   * @default zh-CN
   */
  defaultLocale?: SupportedLanguagesType;
  /**
   * Load message function
   * @param lang
   * @returns
   */
  loadMessages?: LoadMessageFn;
}

export type {
  ImportLocaleFn,
  LoadMessageFn,
  LocaleSetupOptions,
  SupportedLanguagesType,
};
