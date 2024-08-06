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

interface RGBColor {
  b: number;
  g: number;
  r: number;
}

interface RGBAColor extends RGBColor {
  a: number;
}

interface HSLObjectStringColor {
  h: string;
  l: string;
  s: string;
}
interface HSLAObjectStringColor extends HSLObjectStringColor {
  a?: string;
}

const MATCHER =
  /hsla?\(\s*(\+?-?\d+(?:\.\d+)?(?:e\d+)?(?:deg|grad|rad|turn)?)\s*,\s*(\+?-?\d+(?:\.\d+)?%)\s*,\s*(\+?-?\d+(?:\.\d+)?%)(?:\s*,\s*(\+?-?\d+(?:\.\d+)?(?:e-\d+)?%?))?\s*\)/i;
const MATCHER_SPACE =
  // eslint-disable-next-line regexp/no-super-linear-backtracking
  /hsla?\(\s*(\+?-?\d+(?:\.\d+)?(?:e[+-]?\d+)?(?:deg|rad|grad|turn)?)\s*(?:(\+?-?\d+(?:\.\d+)?%)\s*)?(\+?-?\d+(?:\.\d+)?%?)?\s*(?:\/\s*(\+?-?\d+(?:\.\d+)?%)\s*)?\)/i;
const aStr = (a?: string) => (a ? a.replace(/^([,/])\s*/, '').trim() : a);
export default function hslMatcher(
  hsl: string = '',
): HSLAObjectStringColor | undefined {
  const match = MATCHER.exec(hsl) || MATCHER_SPACE.exec(hsl);
  if (match) {
    const [_, h, s, l, a] = match;
    if (a && /^:?[,/]\s*-?\+?$/.test(a.trim())) return;
    return {
      a: aStr(a),
      h,
      l,
      s,
    };
  }
}
function hlsStringToRGB(hls: string): RGBAColor | RGBColor | undefined {
  const obj = hslMatcher(hls);
  if (!obj) return;
  const { a: alphaStr, h: hueStr, l: lStr, s: sStr } = obj;
  let h = 0;
  let l = 0;
  let s = 0;
  const parseAngle = (
    str: string,
    unit: RegExp,
    toDegrees: (val: number) => number,
  ) => {
    return unit.test(str) ? toDegrees(Number(str.replace(unit, ''))) : 0;
  };
  h =
    parseAngle(hueStr, /\s*\d*turn\s*$/, (val) => val * 360) ||
    parseAngle(hueStr, /\s*\d*grad\s*$/, gradsToDegrees) ||
    parseAngle(hueStr, /\s*\d*rad\s*$/, radiansToDegrees) ||
    Number(hueStr.replace(/deg$/i, ''));
  h = Math.min(Math.max(h, 0), 360);
  s = Math.min(Math.max(Number(sStr.replace(/%$/, '')), 0), 100);
  l = Math.min(Math.max(Number(lStr.replace(/%$/, '')), 0), 100);
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const toFixed = (n: number) => Number(n.toFixed(0));
  if (alphaStr && /^\+?-?\d*(?:\.\d*)?(?:e[+-]?\d+|%)?$/i.test(alphaStr)) {
    const alpha = /%/.test(alphaStr)
      ? Number(alphaStr.replaceAll('%', '')) / 100
      : Number(alphaStr);
    return {
      a: alpha,
      b: toFixed(255 * f(4)),
      g: toFixed(255 * f(8)),
      r: toFixed(255 * f(0)),
    };
  }
  return {
    b: toFixed(255 * f(4)),
    g: toFixed(255 * f(8)),
    r: toFixed(255 * f(0)),
  };
}
/** Convert `grad` to `deg` */
function gradsToDegrees(input: number | string) {
  let grads = Number(input);

  grads = grads % 400;
  if (grads < 0) {
    grads += 400;
  }
  // or grads = grads < 0 ? 400 + grads : grads;
  const degrees = (grads / 400) * 360; // or let degrees = grads*0.9
  return degrees;
}

/** Convert `rad` to `deg` */
function radiansToDegrees(radians: number) {
  return Number((radians * (180 / Math.PI)).toFixed(0));
}

function hlsStringToRGBString(color: string): string {
  return new TinyColor(hlsStringToRGB(`hsl(${color})`)).toRgbString();
}

export {
  convertToHsl,
  convertToHslCssVar,
  hlsStringToRGB,
  hlsStringToRGBString,
  isValidColor,
  TinyColor,
};
