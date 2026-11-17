import { describe, expect, it, vi } from 'vitest';

import {
  GRID_SEPARATOR_BLEED_LEFT_VAR,
  GRID_SEPARATOR_BLEED_RIGHT_VAR,
  isBodySectioned,
  resolveGridSectionVars,
  resolveSectionGap,
  resolveSegmentedMode,
  resolveSeparatorFullBleed,
  resolveSeparatorStripClass,
  resolveSeparatorStyle,
  resolveSeparatorVisible,
  resolveSurfaceClass,
  resolveSurfaceStyle,
  validateSectionLayouts,
} from '../grid-sections';

describe('resolveSegmentedMode', () => {
  it.each([
    [undefined, 'default'],
    [false, 'default'],
    ['zone', 'zone'],
    ['card', 'card'],
  ])('maps %s to %s', (input, expected) => {
    expect(resolveSegmentedMode(input as any)).toBe(expected);
  });
});

describe('resolveSeparatorVisible', () => {
  it('boolean decides directly', () => {
    expect(resolveSeparatorVisible(false, 'default')).toBe(false);
    expect(resolveSeparatorVisible(true, 'card')).toBe(true);
  });

  it('object show wins over mode default', () => {
    expect(resolveSeparatorVisible({ show: false }, 'default')).toBe(false);
    expect(resolveSeparatorVisible({ show: true }, 'card')).toBe(true);
  });

  it('object without show falls back to mode default', () => {
    expect(resolveSeparatorVisible({}, 'default')).toBe(true);
    // zone 的面板色差与 card 的双卡布局自身已构成分隔,默认隐藏
    expect(resolveSeparatorVisible({}, 'zone')).toBe(false);
    expect(resolveSeparatorVisible({ class: 'h-px' }, 'card')).toBe(false);
    expect(resolveSeparatorVisible(undefined, 'card')).toBe(false);
  });
});

describe('resolveSeparatorFullBleed', () => {
  it('explicit fullBleed wins', () => {
    expect(resolveSeparatorFullBleed({ fullBleed: false }, 'default')).toBe(
      false,
    );
    expect(resolveSeparatorFullBleed({ fullBleed: true }, 'card')).toBe(true);
  });

  it('defaults to bleed only in default mode', () => {
    expect(resolveSeparatorFullBleed(undefined, 'default')).toBe(true);
    expect(resolveSeparatorFullBleed(undefined, 'zone')).toBe(false);
    expect(resolveSeparatorFullBleed({}, 'card')).toBe(false);
    expect(resolveSeparatorFullBleed(true, 'card')).toBe(false);
  });
});

describe('default band spacing (uniform 8px rhythm)', () => {
  it('band preset is flush and spacing belongs to the surfaces', () => {
    // 分隔条自身无外边距,面板内边距与字段行间距分别管理
    expect(resolveSeparatorStripClass(undefined, 'default')).toBe(
      'bg-background-deep h-2',
    );
    expect(resolveSeparatorStripClass(undefined, 'zone')).toBe(
      'h-px bg-border',
    );
  });

  it('default surface keeps its bottom padding when the separator is hidden', () => {
    expect(resolveSurfaceClass('default')).toBe('pb-2');
  });
});

describe('resolveSeparatorStripClass', () => {
  it('merges preset with user class', () => {
    const result = resolveSeparatorStripClass({ class: 'my-2 h-3' }, 'default');
    expect(result).toContain('bg-background-deep');
    // 用户同名工具类覆盖预设间距与高度
    expect(result).toContain('my-2');
    expect(result).toContain('h-3');
    expect(result).not.toContain('h-2');
  });

  it('uses hairline preset for zone', () => {
    expect(resolveSeparatorStripClass(undefined, 'zone')).toBe(
      'h-px bg-border',
    );
  });
});

describe('resolveSeparatorStyle', () => {
  it('returns undefined when nothing to apply', () => {
    expect(resolveSeparatorStyle(undefined, false)).toBeUndefined();
    expect(resolveSeparatorStyle({}, false)).toBeUndefined();
  });

  it('builds independent left and right bleed margins', () => {
    expect(resolveSeparatorStyle(undefined, true)).toEqual({
      marginLeft: `calc(var(${GRID_SEPARATOR_BLEED_LEFT_VAR}, 0px) * -1)`,
      marginRight: `calc(var(${GRID_SEPARATOR_BLEED_RIGHT_VAR}, 0px) * -1)`,
    });
  });

  it('composes bleed, backgroundColor and user style in order', () => {
    const result = resolveSeparatorStyle(
      { backgroundColor: 'red', style: { height: '2px' } },
      true,
    );
    expect(result).toEqual([
      {
        marginLeft: `calc(var(${GRID_SEPARATOR_BLEED_LEFT_VAR}, 0px) * -1)`,
        marginRight: `calc(var(${GRID_SEPARATOR_BLEED_RIGHT_VAR}, 0px) * -1)`,
      },
      { backgroundColor: 'red' },
      { height: '2px' },
    ]);
  });
});

describe('resolveSurfaceClass', () => {
  it('applies mode presets', () => {
    expect(resolveSurfaceClass('default')).toBe('pb-2');
    expect(resolveSurfaceClass('zone')).toContain('bg-background-deep');
    expect(resolveSurfaceClass('card')).toContain('bg-card');
    expect(resolveSurfaceClass('card')).toContain('rounded-[var(--radius)]');
  });

  it('user formClass overrides preset', () => {
    expect(resolveSurfaceClass('card', 'p-4')).not.toContain('p-2');
    expect(resolveSurfaceClass('card', 'p-4')).toContain('p-4');
  });
});

describe('resolveSurfaceStyle', () => {
  it('only picks backgroundColor and borderRadius', () => {
    expect(resolveSurfaceStyle({ form: { backgroundColor: 'blue' } })).toEqual({
      backgroundColor: 'blue',
    });
    expect(resolveSurfaceStyle({ form: { borderRadius: '8px' } })).toEqual({
      borderRadius: '8px',
    });
    expect(resolveSurfaceStyle({ form: {} })).toBeUndefined();
    expect(resolveSurfaceStyle(undefined)).toBeUndefined();
  });
});

describe('resolveSectionGap', () => {
  it('defaults to 0.5rem', () => {
    expect(resolveSectionGap(undefined)).toBe('0.5rem');
    expect(resolveSectionGap('  ')).toBe('0.5rem');
  });

  it('accepts custom css lengths', () => {
    expect(resolveSectionGap('12px')).toBe('12px');
    expect(resolveSectionGap('1rem')).toBe('1rem');
  });

  it('rejects negative values with a warning', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(resolveSectionGap('-4px')).toBe('0.5rem');
    expect(warn).toHaveBeenCalledTimes(1);
    warn.mockRestore();
  });
});

describe('isBodySectioned', () => {
  it('is active for zone/card or explicit body config', () => {
    expect(isBodySectioned('default')).toBe(false);
    expect(isBodySectioned('zone')).toBe(true);
    expect(isBodySectioned('card')).toBe(true);
    expect(isBodySectioned('default', { body: {} })).toBe(true);
  });
});

describe('resolveGridSectionVars', () => {
  it('card mode resolves full defaults', () => {
    const vars = resolveGridSectionVars('card');
    expect(vars['--vben-grid-body-background']).toBe('hsl(var(--card))');
    expect(vars['--vben-grid-body-radius']).toBe('var(--radius)');
    expect(vars['--vben-grid-fullscreen-bg']).toBe(
      'hsl(var(--background-deep))',
    );
    expect(vars['--vben-grid-section-gap']).toBe('0.5rem');
  });

  it('explicit body config overrides card defaults', () => {
    const vars = resolveGridSectionVars('card', {
      body: { backgroundColor: 'teal', borderRadius: '10px' },
      fullscreenBackgroundColor: 'black',
      gap: '12px',
    });
    expect(vars['--vben-grid-body-background']).toBe('teal');
    expect(vars['--vben-grid-body-radius']).toBe('10px');
    expect(vars['--vben-grid-fullscreen-bg']).toBe('black');
    expect(vars['--vben-grid-section-gap']).toBe('12px');
  });

  it('non-card modes only set body vars when explicitly configured', () => {
    expect(resolveGridSectionVars('zone')).toEqual({});
    expect(
      resolveGridSectionVars('default', { body: { backgroundColor: 'pink' } }),
    ).toEqual({ '--vben-grid-body-background': 'pink' });
  });
});

describe('validateSectionLayouts', () => {
  it('accepts the vxe default layouts', () => {
    expect(
      validateSectionLayouts([
        ['Form'],
        ['Toolbar', 'Top', 'Table', 'Bottom', 'Pager'],
      ]),
    ).toEqual([]);
  });

  it('accepts body reordering and trimming', () => {
    expect(validateSectionLayouts([['Form'], ['Table']])).toEqual([]);
    expect(
      validateSectionLayouts([['Form'], ['Pager', 'Table', 'Toolbar']]),
    ).toEqual([]);
  });

  it('normalizes flat arrays as body-only and reports missing header form', () => {
    const problems = validateSectionLayouts(['Toolbar', 'Table']);
    expect(problems).toHaveLength(1);
    expect(problems[0]).toContain('header layout must be exactly ["Form"]');
  });

  it('reports duplicated or missing Table', () => {
    expect(
      validateSectionLayouts([['Form'], ['Toolbar', 'Bottom']]),
    ).toContainEqual(expect.stringContaining('exactly one "Table"'));
    expect(
      validateSectionLayouts([['Form'], ['Table', 'Table']]),
    ).toContainEqual(expect.stringContaining('exactly one "Table"'));
  });

  it('reports disallowed body keys (including Form) and footer keys', () => {
    const problems = validateSectionLayouts([
      ['Form'],
      ['Table', 'Form'],
      ['Pager'],
    ]);
    expect(problems).toContainEqual(
      expect.stringContaining('only allows Toolbar/Top/Table/Bottom/Pager'),
    );
    expect(problems).toContainEqual(
      expect.stringContaining('footer layout must be empty'),
    );
  });

  it('accepts undefined layouts (vxe default)', () => {
    expect(validateSectionLayouts(undefined)).toEqual([]);
  });

  it('reports malformed nested slots instead of throwing', () => {
    // body 配成字符串:守卫报错,不抛 TypeError
    const problems = validateSectionLayouts([['Form'], 'Toolbar']);
    expect(problems).toContainEqual(
      expect.stringContaining('body layout must be an array, got string'),
    );
    // footer 配成对象:同样守卫
    const problems2 = validateSectionLayouts([
      ['Form'],
      ['Table'],
      { bad: true },
    ]);
    expect(problems2).toContainEqual(
      expect.stringContaining('footer layout must be an array, got object'),
    );
  });
});
