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
  /hsla?\(\s*(\+?-?\d+(?:\.\d+)?(?:e\d+)?[dgrt])\s*,\s*(\+?-?\d+(?:\.\d+)?%)\s*,\s*(\+?-?\d+(?:\.\d+)?%)(?:\s*,\s*(\+?-?\d+(?:\.\d+)?(?:e-\d+)?%?))?\s*\)/i;
// const MATCHER =
//   /hsla?\(\s*(\+?-?\d*(?:\.\d*)?(?:e\+)?\d*(?:deg|rad|grad|turn)?)\s*,\s*(\+?-?\d*(?:\.\d*)?(?:e\+)?\d*%)\s*,\s*(\+?-?\d*(?:\.\d*)?(?:e\+)?\d*%)\s*(?:(,\s*\+?-?\s*(?:\d*(?:\.\d*)?(?:e-\d*)?%?)?)\s*)?\)/i;
const MATCHER_SPACE =
  /hsla?\(\s*(\+?-?\d*(?:\.\d*)?(?:e\+)?\d*(?:deg|rad|grad|turn)?)\s*(\+?-?\d*(?:\.\d*)?(?:e\+)?\d*%)\s*(\+?-?\d*(?:\.\d*)?(?:e\+)?\d*%)\s*(?:(\/\s*\+?-?\s*(?:\d*(?:\.\d*)?(?:e-\d*)?%?)?)\s*)?\)/i;

const aStr = (a?: string) => (a ? a.replace(/^(,|\/)\s*/, '').trim() : a);
export default function hslMatcher(
  hsl: string = '',
): HSLAObjectStringColor | undefined {
  const match = MATCHER.exec(hsl) || MATCHER_SPACE.exec(hsl);
  if (match) {
    const [_, h, s, l, a] = match;
    if (a && /^(:?(\/|,)\s*-?\+?)$/.test(a.trim())) return;
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

  if (/\s*\d*turn\s*$/.test(hueStr)) {
    h = Number(hueStr.replace(/turn\s*$/i, '')) * 360;
  } else if (/\s*\d*grad\s*$/.test(hueStr)) {
    h = gradsToDegrees(hueStr.replace(/grad\s*$/i, ''));
  } else if (/\s*\d*rad\s*$/.test(hueStr)) {
    h = radiansToDegrees(Number(hueStr.replace(/rad\s*$/i, '')));
  }

  if (
    /^(([+-])?\d*|([+-])?\d*?.\d*(?:(e\+)\d*)?)$/.test(
      hueStr.replace(/deg$/i, ''),
    )
  ) {
    h = Number(hueStr.replace(/deg$/i, ''));
  }
  if (h > 360) h = 360;
  if (h < 0) h = 0;
  if (/^(([+-])?\d*|([+-])?\d*?.\d*(?:(e\+)\d*)?)%$/.test(sStr)) {
    s = Number(sStr.replace(/%$/, ''));
  }
  if (s > 100) s = 100;
  if (s < 0) s = 0;
  if (/^(([+-])?\d*|([+-])?\d*?.\d*(?:(e\+)\d*)?)%$/.test(lStr)) {
    l = Number(lStr.replace(/%$/, ''));
  }
  if (l > 100) l = 100;
  if (l < 0) l = 0;

  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

  // rounding
  const toFixed = (n: number) => Number(n.toFixed(0));

  /**
   * https://drafts.csswg.org/css-color/#typedef-alpha-value
   * Opacity in CSS is typically represented using the <alpha-value> syntax,
   * for example in the opacity property or as the alpha component in a color function.
   * Represented as a <number>, the useful range of the value is 0 (representing full transparency) to 1 (representing full opacity).
   * It can also be written as a <percentage>, which computes to the equivalent <number> (0% to 0, 100% to 1).
   * Unless otherwise specified, an <alpha-value> component defaults to 100% when omitted.
   * Values outside the range [0,1] are not invalid, but are clamped to that range when computed.
   */
  if (alphaStr && /^\+?-?\d*(E-\d*|.\d*%?)?$/.test(alphaStr)) {
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

function hlsStringToRGBSting(color: string): string {
  return new TinyColor(hlsStringToRGB(`hsl(${color})`)).toRgbString();
}

export {
  convertToHsl,
  convertToHslCssVar,
  hlsStringToRGB,
  hlsStringToRGBSting,
  isValidColor,
  TinyColor,
};
