/**
 * 更新 CSS 变量的函数
 * @param variables 要更新的 CSS 变量与其新值的映射
 * @param id 内联样式表的 id，便于复用与覆盖
 * @param selector CSS 变量挂载的选择器，默认 `:root`。
 *  对于像 TDesign 这种将变量定义在 `:root[theme-mode='dark']` 等更高优先级选择器下的组件库，
 *  需要传入相同（或更高）优先级的选择器才能正确覆盖。
 */
function updateCSSVariables(
  variables: { [key: string]: string },
  id = '__vben-styles__',
  selector = ':root',
): void {
  // 历史实现用 setTimeout 延迟插入创建的样式标签，若同一宏任务内被连续调用
  // （如初始化偏好后又恢复用户偏好），querySelector 尚找不到未插入的标签，
  // 会重复创建同 id 标签：运行时只更新第一个，而级联获胜的却是第二个（旧值），
  // 导致主题色切换后部分组件不生效、刷新页面才恢复。
  // 这里改为同步插入消除并发窗口，并顺带清理历史遗留的重复标签。
  const existingStyles = document.querySelectorAll<HTMLElement>(`#${id}`);
  existingStyles.forEach((element, index) => {
    if (index > 0) {
      element.remove();
    }
  });

  let styleElement = existingStyles[0] ?? null;

  if (!styleElement) {
    styleElement = document.createElement('style');
    styleElement.id = id;
    document.head.append(styleElement);
  }

  // 构建要更新的 CSS 变量的样式文本
  let cssText = `${selector} {`;
  for (const key in variables) {
    if (Object.prototype.hasOwnProperty.call(variables, key)) {
      cssText += `${key}: ${variables[key]};`;
    }
  }
  cssText += '}';

  // 将样式文本赋值给内联样式表
  styleElement.textContent = cssText;
}

export { updateCSSVariables };
