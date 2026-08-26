import type { SupportedLanguagesType } from '@vben-core/typings';

/**
 * @zh_CN 登录页面 url 地址
 */
export const LOGIN_PATH = '/auth/login';

/**
 * 语言选项；value 默认为 string 以支持运行时注册自定义语言（见 setSupportLanguages）
 */
export interface LanguageOption<TValue extends string = string> {
  label: string;
  value: TValue;
}

/**
 * 支持的语言（默认值，可在运行时通过 setSupportLanguages 覆盖）。
 * value 约束到 SupportedLanguagesType，应用通过模块增强扩展语言后，
 * 默认列表同样接受新语言，拼写错误会在编译期报错
 */
export const SUPPORT_LANGUAGES: LanguageOption<SupportedLanguagesType>[] = [
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

// 深拷贝语言列表，外部拿到的永远是独立快照，
// 避免绕过 setSupportLanguages 直接修改注册表内部状态
function cloneLanguages(languages: LanguageOption[]): LanguageOption[] {
  return languages.map((language) => ({ ...language }));
}

let currentLanguages: LanguageOption[] = cloneLanguages(SUPPORT_LANGUAGES);
const listeners: LanguageListListener[] = [];

/**
 * 获取当前动态语言列表
 */
export function getSupportLanguages(): LanguageOption[] {
  return cloneLanguages(currentLanguages);
}

/**
 * 更新语言列表并通知所有监听器
 */
export function setSupportLanguages(languages: LanguageOption[]) {
  // 先固化本次快照，即使监听器回调中嵌套调用 setSupportLanguages，
  // 后续监听器收到的仍是本次更新的列表
  const nextLanguages = cloneLanguages(languages);
  currentLanguages = nextLanguages;
  // 迭代监听器快照，避免监听器在回调中取消订阅导致跳过后续监听器
  for (const listener of [...listeners]) {
    listener(cloneLanguages(nextLanguages));
  }
}

/**
 * 订阅语言列表变化，返回取消订阅函数
 */
export function onSupportLanguagesChange(listener: LanguageListListener) {
  listeners.push(listener);
  // 订阅时立即回调当前值，便于消费方初始化
  listener(cloneLanguages(currentLanguages));
  return () => {
    const index = listeners.indexOf(listener);
    if (index !== -1) listeners.splice(index, 1);
  };
}
