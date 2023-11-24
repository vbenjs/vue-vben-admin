import { setCssVar } from './util';
import { addClass, hasClass, removeClass } from '@/utils/domUtils';

export type CustomColorType = {
  name: string;
  light: string;
  dark: string;
};

/**
 * 自定义颜色列表
 * 需先在 src/design/color.less 内定义变量和 light 颜色
 */
export const customColorList: CustomColorType[] = [
  {
    name: '--text-color',
    light: 'rgba(0, 0, 0, 0.85)',
    dark: '#c9d1d9',
  },
  {
    name: '--border-color',
    light: '#eee',
    dark: '#303030',
  },
  {
    name: '--component-background-color',
    light: '#fff',
    dark: '#151515',
  },
  {
    name: '--app-content-background-color',
    light: '#fafafa',
    dark: '#1e1e1e',
  },
  // custom example
  {
    name: '--custom-example-color',
    light: '#ff4d4f',
    dark: '#55D187',
  },
];

// 根据主题更新自定义颜色
export function updateCustomColor(mode: 'light' | 'dark') {
  customColorList.forEach((item) => {
    setCssVar(item.name, item[mode]);
  });
}

export async function updateDarkTheme(mode: string | null = 'light') {
  const htmlRoot = document.getElementById('htmlRoot');
  if (!htmlRoot) {
    return;
  }
  const hasDarkClass = hasClass(htmlRoot, 'dark');
  if (mode === 'dark') {
    htmlRoot.setAttribute('data-theme', 'dark');
    if (!hasDarkClass) {
      addClass(htmlRoot, 'dark');
    }
  } else {
    htmlRoot.setAttribute('data-theme', 'light');
    if (hasDarkClass) {
      removeClass(htmlRoot, 'dark');
    }
  }
  updateCustomColor(mode === 'dark' ? 'dark' : 'light');
}
