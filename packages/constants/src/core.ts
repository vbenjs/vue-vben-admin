/**
 * @zh_CN 登录页面 url 地址
 */
export const LOGIN_PATH = '/auth/login';

export interface LanguageOption {
  label: string;
  value: string;
}

/**
 * 支持的语言（默认值，可在运行时通过 setSupportLanguages 覆盖）
 */
export const SUPPORT_LANGUAGES: LanguageOption[] = [
  {
    label: '简体中文',
    value: 'zh-CN',
  },
  {
    label: 'English',
    value: 'en-US',
  },
];

// --- 动态语言列表管理 ---
type LanguageListListener = (languages: LanguageOption[]) => void;
let currentLanguages: LanguageOption[] = [...SUPPORT_LANGUAGES];
const listeners: LanguageListListener[] = [];

/**
 * 获取当前动态语言列表
 */
export function getSupportLanguages(): LanguageOption[] {
  return currentLanguages;
}

/**
 * 更新语言列表并通知所有监听器
 */
export function setSupportLanguages(languages: LanguageOption[]) {
  currentLanguages = [...languages];
  for (const listener of listeners) {
    listener(currentLanguages);
  }
}

/**
 * 订阅语言列表变化，返回取消订阅函数
 */
export function onSupportLanguagesChange(listener: LanguageListListener) {
  listeners.push(listener);
  // 订阅时立即回调当前值，便于消费方初始化
  listener(currentLanguages);
  return () => {
    const index = listeners.indexOf(listener);
    if (index !== -1) listeners.splice(index, 1);
  };
}
