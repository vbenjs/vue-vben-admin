export type Locale = 'en-US' | 'zh-CN';

export const messages: Record<Locale, Record<string, string>> = {
  'en-US': {
    cancel: 'Cancel',
    confirm: 'Confirm',
  },
  'zh-CN': {
    cancel: '取消',
    confirm: '确认',
  },
};

export const getMessages = (locale: Locale) => messages[locale];
