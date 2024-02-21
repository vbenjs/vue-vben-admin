import type { DropMenu } from '../components/Dropdown';
import type { LocaleSetting, LocaleType } from '#/config';

export const LOCALE: { [key: string]: LocaleType } = {
  zh_TW: 'zh_TW',
  EN_US: 'en',
};

export const localeSetting: LocaleSetting = {
  showPicker: false,
  // Locale
  locale: LOCALE.zh_TW,
  // Default locale
  fallback: LOCALE.zh_TW,
  // available Locales
  availableLocales: [LOCALE.zh_TW, LOCALE.EN_US],
};

// locale list
export const localeList: DropMenu[] = [
  {
    text: '繁體中文',
    event: LOCALE.zh_TW,
  },
  {
    text: 'English',
    event: LOCALE.EN_US,
  },
];
