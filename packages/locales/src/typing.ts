export type { SupportedLanguagesType } from '@vben-core/typings';

export type LocaleMessages = Record<string, unknown>;
export type ImportLocaleFn = () => Promise<{ default: LocaleMessages }>;
export type LoadMessageFn = (
  lang: string,
) => Promise<LocaleMessages | undefined>;
export type ResourceLoader<T = unknown> = () => Promise<T>;

export interface LocaleUpdate {
  apply(): void;
  restore(): void;
}

export interface LocaleAdapter<T = unknown> {
  prepare(load: ResourceLoader<T>, lang: string): Promise<() => LocaleUpdate>;
}

export interface LocaleDefinition {
  label: string;
  resources?: Record<string, ResourceLoader>;
}

export interface LocaleSetupOptions {
  adapters?: Record<string, LocaleAdapter>;
  defaultLocale?: string;
  fallbackLocale?: string;
  initialLocale?: string;
  languages?: Record<string, LocaleDefinition>;
  loadMessages?: LoadMessageFn;
  missingWarn?: boolean;
  onLocaleChanged?: (locale: string) => Promise<void> | void;
}
