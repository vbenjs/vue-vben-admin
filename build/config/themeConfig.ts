import { generate } from '@ant-design/colors';

export const primaryColor = '#0960bd';

export const darkMode = 'light';

type Fn = (...arg: any) => any;

export interface GenerateColorsParams {
  mixLighten: Fn;
  mixDarken: Fn;
  tinycolor: any;
  color?: string;
}

export function generateAntColors(color: string) {
  return generate(color, {
    theme: 'default',
  });
}

export function getThemeColors(color?: string) {
  const tc = color || primaryColor;
  const colors = generateAntColors(tc);
  const primary = colors[5];
  const modeColors = generateAntColors(primary);

  return [...colors, ...modeColors];
}

export function generateColors({
  color = primaryColor,
  mixLighten,
  mixDarken,
  tinycolor,
}: GenerateColorsParams) {
  const arr = new Array(19).fill(0);
  const lightens = arr.map((_t, i) => {
    return mixLighten(color, i / 5);
  });

  const darkens = arr.map((_t, i) => {
    return mixDarken(color, i / 5);
  });

  const alphaColors = arr.map((_t, i) => {
    return tinycolor(color)
      .setAlpha(i / 20)
      .toRgbString();
  });

  const tinycolorLightens = arr
    .map((_t, i) => {
      return tinycolor(color)
        .lighten(i * 5)
        .toHexString();
    })
    .filter((item) => item !== '#ffffff');

  const tinycolorDarkens = arr
    .map((_t, i) => {
      return tinycolor(color)
        .darken(i * 5)
        .toHexString();
    })
    .filter((item) => item !== '#000000');
  return [...lightens, ...darkens, ...alphaColors, ...tinycolorDarkens, ...tinycolorLightens];
}
