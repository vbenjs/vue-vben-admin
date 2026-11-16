import type { ClassValue } from 'clsx';

import { clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * 主题自定义 @utility 的 tailwind-merge 冲突注册表。
 *
 * 源头是 internal/tailwind-config/src/theme.css 中的 @utility 定义。
 * 每个类只登记一次；复合类使用独立组，通过 conflictingClassGroups
 * 移除属性被它完整覆盖的前置类。原子类不反向删除复合类，以保留
 * display 被覆盖后仍有意义的对齐、方向等属性。
 *
 * 例如 cn('flex-col-center', 'hidden md:flex') 必须保留复合类，
 * 才能在 md 断点恢复 display:flex 时继续使用列方向和居中布局。
 * 登记规则见 docs/src/guide/project/tailwindcss.md。
 */
const customUtilityClassGroups = {
  'flex-center': ['flex-center'],
  'flex-col-center': ['flex-col-center'],
};

const twMerge = extendTailwindMerge<keyof typeof customUtilityClassGroups>({
  extend: {
    classGroups: customUtilityClassGroups,
    conflictingClassGroups: {
      'flex-center': ['display', 'align-items', 'justify-content'],
      'flex-col-center': [
        'display',
        'flex-direction',
        'align-items',
        'justify-content',
        'flex-center',
      ],
    },
  },
});

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export { cn, customUtilityClassGroups };
