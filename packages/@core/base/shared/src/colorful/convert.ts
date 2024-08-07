import { TinyColor } from '@ctrl/tinycolor';
/**
 * 将颜色转换为HSL格式。
 *
 * HSL是一种颜色模型，包括色相(Hue)、饱和度(Saturation)和亮度(Lightness)三个部分。
 * 这个函数使用TinyColor库将输入的颜色转换为HSL格式，并返回一个字符串。
 *
 * @param {string} color 输入的颜色，可以是任何TinyColor支持的颜色格式。
 * @returns {string} HSL格式的颜色字符串。
 */
function convertToHsl(color: string): string {
  const { a, h, l, s } = new TinyColor(color).toHsl();
  const hsl = `hsl(${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%)`;
  return a < 1 ? `${hsl} ${a}` : hsl;
}

/**
 * 将颜色转换为HSL CSS变量。
 *
 * 这个函数与convertToHsl函数类似，但是返回的字符串格式稍有不同，
 * 以便可以作为CSS变量使用。
 *
 * @param {string} color 输入的颜色，可以是任何TinyColor支持的颜色格式。
 * @returns {string} 可以作为CSS变量使用的HSL格式的颜色字符串。
 */
function convertToHslCssVar(color: string): string {
  const { a, h, l, s } = new TinyColor(color).toHsl();
  const hsl = `${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  return a < 1 ? `${hsl} / ${a}` : hsl;
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
  return new TinyColor(color).isValid;
}
/**
 * 将HLS字符串转换为RGB颜色字符串
 *
 * 本函数接收一个表示HLS值的字符串，移除其中的度量单位，
 * 并将其转换为TinyColor对象，以便进行颜色处理如果转换后的颜色无效，
 * 则直接返回原始字符串；否则，返回转换后的RGB颜色字符串
 *
 * @param str 表示HLS颜色值的字符串，可能包含度量单位如'deg'、'grad'、'rad'或'turn'
 * @returns 如果颜色值有效，则返回对应的RGB颜色字符串；如果无效，则返回原始字符串
 */
function hlsStringToRGBString(str: string): string {
  // 创建TinyColor对象，用于处理颜色转换
  // 移除HLS字符串中的度量单位，以便正确解析
  const color = new TinyColor(
    `hsl(${str.replaceAll(/deg|grad|rad|turn/g, '')})`,
  );
  // 检查颜色是否有效，如果无效则直接返回原始字符串
  if (!color.isValid) {
    return str;
  }
  // 返回转换后的RGB颜色字符串
  return color.toRgbString();
}

export {
  convertToHsl,
  convertToHslCssVar,
  hlsStringToRGBString,
  isValidColor,
  TinyColor,
};
