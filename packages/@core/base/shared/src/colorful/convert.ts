import { FastColor } from '@ant-design/fast-color';

const Color = FastColor;

/**
 * 将颜色转换为HSL格式。
 *
 * HSL是一种颜色模型，包括色相(Hue)、饱和度(Saturation)和亮度(Lightness)三个部分。
 *
 * @param {string} color 输入的颜色。
 * @returns {string} HSL格式的颜色字符串。
 */
function convertToHsl(color: string): string {
  const { a, h, l, s } = new Color(color).toHsl();
  const hsl = `hsl(${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%)`;
  return a < 1 ? `${hsl} ${a}` : hsl;
}

/**
 * 将颜色转换为HSL CSS变量。
 *
 * 这个函数与convertToHsl函数类似，但是返回的字符串格式稍有不同，
 * 以便可以作为CSS变量使用。
 *
 * @param {string} color 输入的颜色。
 * @returns {string} 可以作为CSS变量使用的HSL格式的颜色字符串。
 */
function convertToHslCssVar(color: string): string {
  const { a, h, l, s } = new Color(color).toHsl();
  const hsl = `${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  return a < 1 ? `${hsl} / ${a}` : hsl;
}

function convertToRgb(color: string): string {
  return new Color(color).toRgbString();
}

/**
 * 检查颜色是否有效
 * @param {string} color - 待检查的颜色
 * 如果颜色有效返回true，否则返回false
 */
function isValidColor(color?: string) {
  if (!color) {
    return false;
  }
  // All FastColor objects are valid. So isValid is always true.
  return new Color(color).isValid;
}

export { Color, convertToHsl, convertToHslCssVar, convertToRgb, isValidColor };
