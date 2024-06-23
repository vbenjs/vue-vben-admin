import type { SupportedLanguagesType } from './types';

interface Language {
  key: SupportedLanguagesType;
  text: string;
}

export const COLOR_PRIMARY_RESETS = [
  'hsl(211 91% 39%)',
  'hsl(212 100% 45%)',
  'hsl(181 84% 32%)',
  'hsl(161 90% 43%)',
  'hsl(231 98% 65%)',
  'hsl(245 82% 67%)',
  'hsl(347 77% 60%)',
];

export const SUPPORT_LANGUAGES: Language[] = [
  {
    key: 'zh-CN',
    text: '简体中文',
  },
  {
    key: 'en-US',
    text: 'English',
  },
];
