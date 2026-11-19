/**
 * 语言选项；value 默认为 string 以支持运行时注册自定义语言（见 setSupportLanguages）
 */
export interface LanguageOption<TValue extends string = string> {
  label: string;
  value: TValue;
}

/**
 * 支持的语言（默认值，可在运行时通过 setSupportLanguages 覆盖）。
 */
export const SUPPORT_LANGUAGES = [
  {
    label: '简体中文',
    value: 'zh-CN' as const,
  },
  {
    label: 'English',
    value: 'en-US' as const,
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
type ReplaceLanguages = (
  next: LanguageOption[],
  publish: () => void,
) => Promise<boolean>;
let replaceLanguages: ReplaceLanguages | undefined;
let explicitlySet = false;

function validate(languages: LanguageOption[]) {
  const ids = languages.map(({ value }) => value);
  if (
    ids.length === 0 ||
    ids.some((id) => !id.trim()) ||
    new Set(ids).size !== ids.length
  ) {
    throw new Error(
      'Expected a non-empty language list with unique locale IDs.',
    );
  }
}

/**
 * 获取当前动态语言列表
 */
export function getSupportLanguages(): LanguageOption[] {
  return cloneLanguages(currentLanguages);
}

/**
 * 更新语言列表并通知所有监听器
 */
function publishLanguages(languages: LanguageOption[]) {
  const nextLanguages = cloneLanguages(languages);
  currentLanguages = nextLanguages;
  // 迭代监听器快照，避免监听器在回调中取消订阅导致跳过后续监听器
  for (const listener of [...listeners]) {
    // A listener may replace the menu synchronously. Never deliver an older
    // snapshot after downstream listeners have already received the new one.
    if (currentLanguages !== nextLanguages) break;
    try {
      listener(cloneLanguages(nextLanguages));
    } catch (error) {
      console.error('Language list listener failed:', error);
    }
  }
}

/** Connect the locale switcher without making constants depend on Vue I18n. */
export function connectLanguageRegistry(
  defaults: LanguageOption[],
  replace: ReplaceLanguages,
) {
  validate(defaults);
  replaceLanguages = replace;
  if (!explicitlySet) publishLanguages(defaults);
  return () => {
    if (replaceLanguages === replace) replaceLanguages = undefined;
  };
}

export async function setSupportLanguages(
  languages: LanguageOption[],
): Promise<boolean> {
  validate(languages);
  const next = cloneLanguages(languages);
  const publish = () => {
    explicitlySet = true;
    publishLanguages(next);
  };
  if (replaceLanguages) return replaceLanguages(next, publish);
  publish();
  return true;
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
