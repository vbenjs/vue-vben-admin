import { generate } from '@ant-design/colors';

import { convertToHslCssVar } from './convert';

export * from '@ant-design/colors';

interface Opts {
  backgroundColor?: string;
  theme?: 'dark' | 'default';
}

interface ColorItem {
  alias?: string;
  color: string;
  name: string;
}

function generatorColorVariables(colorItems: ColorItem[], opts?: Opts) {
  const colorVariables: Record<string, string> = {};

  colorItems.forEach(({ alias, color, name }) => {
    if (color) {
      const colors = generate(color, opts);
      let mainColor = colors[5];
      colors.forEach((colorValue, colorIndex) => {
        const hslColor = convertToHslCssVar(colorValue);
        colorVariables[`--${name}-${colorIndex + 1}00`] = hslColor;
        if (alias) {
          colorVariables[`--${alias}-${colorIndex + 1}00`] = hslColor;
        }

        if (colorIndex === 5) {
          mainColor = hslColor;
        }
      });
      if (alias) {
        colorVariables[`--${alias}`] = mainColor;
      }
    }
  });

  return colorVariables;
}

export { generatorColorVariables };
