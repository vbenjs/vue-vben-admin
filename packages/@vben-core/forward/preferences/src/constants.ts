import type { LocaleSupportType } from './types';

interface Language {
  key: LocaleSupportType;
  text: string;
}

export const COLOR_PRIMARY_RESETS = [
  'hsl(211 91% 39%)',
  'hsl(212 100% 45%)',
  'hsl(181 84% 32%)',
  'hsl(230 99% 66%)',
  'hsl(245 82% 67%)',
  'hsl(340 100% 68%)',
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
