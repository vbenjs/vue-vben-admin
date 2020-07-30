import client from 'webpack-theme-color-replacer/client';
import generate from '@ant-design/colors/lib/generate';
import { useMessage } from '@/hooks/core/useMessage';
import { primaryColor } from 'config/glob/lessModifyVars';
function getAntSerials(color: string): string[] {
  const lightens: string[] = new Array(9).fill(0).map((t, i) => {
    return client.varyColor.lighten(color, i / 10);
  });
  const colorPalettes = generate(color);
  return lightens.concat(colorPalettes);
}
function changeColor(newColor: string) {
  const options = {
    newColors: getAntSerials(newColor),
    // while router is not `hash` mode, it needs absolute path
    changeUrl(cssUrl) {
      return `./${cssUrl}`;
    },
  };
  return client.changer.changeColor(options, Promise);
}

export const updateTheme = (newPrimaryColor: string) => {
  const { createMessage } = useMessage();
  changeColor(newPrimaryColor).catch(() => {
    createMessage.error('主题切换失败');
  });
};

function toggleClass(flag: boolean, clsName: string) {
  const body = document.body;
  let { className } = body;
  className = className.replace(clsName, '');
  document.body.className = flag ? `${className} ${clsName} ` : className;
}
export const updateColorWeak = (colorWeak: boolean) => {
  toggleClass(colorWeak, 'color-weak');
};

export const updateGrayMode = (gray: boolean) => {
  toggleClass(gray, 'gray-mode');
};

// 预设主题色
export const preDefineColors = [
  primaryColor,
  '#1AB394',
  '#42b983',
  '#0096d9',
  '#f5222d',
  '#faad14',
  '#0396FF',
  '#F6416C',
  '#2F54EB',
  '#7367f0',
  '#00ced1',
];
