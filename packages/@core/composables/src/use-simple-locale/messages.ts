export type Locale = string;

export const messages: Record<string, Record<string, string>> = {
  'en-US': {
    cancel: 'Cancel',
    collapse: 'Collapse',
    confirm: 'Confirm',
    expand: 'Expand',
    prompt: 'Prompt',
    reset: 'Reset',
    submit: 'Submit',
    toggleSidebar: 'Toggle sidebar',
    confirmTitle: 'Please Confirm',
  },
  'zh-CN': {
    cancel: '取消',
    collapse: '收起',
    confirm: '确认',
    expand: '展开',
    prompt: '提示',
    reset: '重置',
    submit: '提交',
    toggleSidebar: '切换侧边栏',
    confirmTitle: '请确认',
  },
};

export const getMessages = (locale: Locale) =>
  messages[locale] ?? messages['en-US'] ?? {};
