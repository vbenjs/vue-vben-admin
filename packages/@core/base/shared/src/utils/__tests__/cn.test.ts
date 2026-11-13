import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import { cn, customUtilityClassGroups } from '../cn';

// 守卫测试读取 theme.css 源文件。shared 是纯浏览器包(tsconfig 无 node
// 类型),因此只用 readFileSync 这一个 node API,类型由同目录 node-fs.d.ts
// 的最小声明提供。注意不能用 import.meta.url 构造 URL:happy-dom 测试环
// 境下它是 http 协议,而 vitest 保证 import.meta.dirname 是真实文件路径。
// 相对路径:__tests__ → utils → src → shared → base → @core → packages → 根。
const themeCss = readFileSync(
  `${import.meta.dirname}/../../../../../../../internal/tailwind-config/src/theme.css`,
  'utf8',
);

describe('cn', () => {
  it('keeps unknown classes as-is', () => {
    expect(cn('some-custom-class', 'p-2')).toBe('some-custom-class p-2');
  });

  it('preserves compound properties when display is overridden', () => {
    expect(cn('flex-center', 'flex')).toBe('flex-center flex');
    expect(cn('flex-center', 'inline-flex')).toBe('flex-center inline-flex');
    expect(cn('flex-center', 'hidden')).toBe('flex-center hidden');
    expect(cn('flex-col-center', 'inline')).toBe('flex-col-center inline');
    expect(cn('flex-col-center', 'hidden md:flex')).toBe(
      'flex-col-center hidden md:flex',
    );
  });

  it('removes preceding atomic classes fully covered by a compound utility', () => {
    expect(cn('hidden', 'flex-center')).toBe('flex-center');
    expect(cn('inline-flex items-start justify-end', 'flex-center')).toBe(
      'flex-center',
    );
    expect(cn('flex-row items-start justify-end', 'flex-col-center')).toBe(
      'flex-col-center',
    );
  });

  it('preserves properties only partially covered by a later utility', () => {
    expect(cn('flex-center', 'items-start justify-end')).toBe(
      'flex-center items-start justify-end',
    );
    expect(cn('flex-col-center', 'flex-row')).toBe('flex-col-center flex-row');
    expect(cn('flex-row', 'flex-center')).toBe('flex-row flex-center');
    expect(cn('flex-col-center', 'flex-center')).toBe(
      'flex-col-center flex-center',
    );
    expect(cn('flex-center', 'flex-col-center')).toBe('flex-col-center');
  });

  it('resolves conflicts within the same variant and important scope', () => {
    expect(cn('md:hidden', 'md:flex-center')).toBe('md:flex-center');
    expect(cn('hidden', 'md:flex-center')).toBe('hidden md:flex-center');
    expect(cn('md:flex-col-center', 'md:hidden md:lg:flex')).toBe(
      'md:flex-col-center md:hidden md:lg:flex',
    );
    expect(cn('hidden!', 'flex-center!')).toBe('flex-center!');
    expect(cn('flex-col-center!', 'flex!')).toBe('flex-col-center! flex!');
    expect(cn('hidden!', 'flex-center')).toBe('hidden! flex-center');
  });

  it('keeps non-conflicting custom utilities', () => {
    expect(cn('flex-center', 'gap-2')).toBe('flex-center gap-2');
  });

  it('registers every custom @utility of theme.css exactly once', () => {
    const defined = [...themeCss.matchAll(/^@utility\s+([a-zA-Z0-9-]+)/gm)].map(
      (match) => match[1] as string,
    );
    const registered = Object.values(customUtilityClassGroups).flat();

    // 解析器本身要能找到定义,防止 theme.css 语法变化导致假绿
    expect(defined.length).toBeGreaterThan(0);

    // 禁止同组重复或跨组重复登记，避免后处理的组覆盖类名归属。
    expect(new Set(registered).size).toBe(registered.length);

    // 双向同步:theme.css 新增 @utility 必须登记;登记的条目不得失效遗留
    expect(defined.filter((name) => !registered.includes(name))).toEqual([]);
    expect(registered.filter((name) => !defined.includes(name))).toEqual([]);
  });
});
