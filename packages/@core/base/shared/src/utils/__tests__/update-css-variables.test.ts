import { expect, it } from 'vitest';

import { updateCSSVariables } from '../update-css-variables';

it('updateCSSVariables should update CSS variables in :root selector', () => {
  // 模拟初始的内联样式表内容
  const initialStyleContent = ':root { --primaryColor: red; }';
  document.head.innerHTML = `<style id="custom-styles">${initialStyleContent}</style>`;

  // 要更新的CSS变量和它们的新值
  const updatedVariables = {
    fontSize: '16px',
    primaryColor: 'blue',
    secondaryColor: 'green',
  };

  // 调用函数来更新CSS变量
  updateCSSVariables(updatedVariables, 'custom-styles');

  // 获取更新后的样式内容
  const styleElement = document.querySelector('#custom-styles');
  const updatedStyleContent = styleElement ? styleElement.textContent : '';

  // 检查更新后的样式内容是否包含正确的更新值
  expect(
    updatedStyleContent?.includes('primaryColor: blue;') &&
      updatedStyleContent?.includes('secondaryColor: green;') &&
      updatedStyleContent?.includes('fontSize: 16px;'),
  ).toBe(true);
});

it('updateCSSVariables should support a custom selector', () => {
  document.head.innerHTML = `<style id="tdesign-styles"></style>`;

  // 使用自定义选择器（如 TDesign 的 theme-mode 选择器）更新 CSS 变量
  updateCSSVariables(
    { '--td-brand-color': 'rgb(0, 82, 217)' },
    'tdesign-styles',
    ":root[theme-mode='dark']",
  );

  const styleElement = document.querySelector('#tdesign-styles');
  const content = styleElement?.textContent ?? '';

  // 选择器与变量都应正确写入
  expect(content.startsWith(":root[theme-mode='dark'] {")).toBe(true);
  expect(content.includes('--td-brand-color: rgb(0, 82, 217);')).toBe(true);
});
