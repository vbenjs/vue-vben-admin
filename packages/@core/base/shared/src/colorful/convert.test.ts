import { describe, expect, it } from 'vitest';

import { convertToHsl, convertToHslCssVar, isValidColor } from './convert';

describe('color conversion functions', () => {
  it('should correctly convert color to HSL format', () => {
    const color = '#ff0000';
    const expectedHsl = 'hsl(0 100% 50%)';
    expect(convertToHsl(color)).toEqual(expectedHsl);
  });

  it('should correctly convert color with alpha to HSL format', () => {
    const color = 'rgba(255, 0, 0, 0.5)';
    const expectedHsl = 'hsl(0 100% 50%) 0.5';
    expect(convertToHsl(color)).toEqual(expectedHsl);
  });

  it('should correctly convert color to HSL CSS variable format', () => {
    const color = '#ff0000';
    const expectedHsl = '0 100% 50%';
    expect(convertToHslCssVar(color)).toEqual(expectedHsl);
  });

  it('should correctly convert color with alpha to HSL CSS variable format', () => {
    const color = 'rgba(255, 0, 0, 0.5)';
    const expectedHsl = '0 100% 50% / 0.5';
    expect(convertToHslCssVar(color)).toEqual(expectedHsl);
  });
});

describe('isValidColor', () => {
  it('isValidColor function', () => {
    // 测试有效颜色
    expect(isValidColor('blue')).toBe(true);
    expect(isValidColor('#000000')).toBe(true);

    // 测试无效颜色
    expect(isValidColor('invalid color')).toBe(false);
    expect(isValidColor()).toBe(false);
  });
});
