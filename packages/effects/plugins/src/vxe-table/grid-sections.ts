import type { CSSProperties, StyleValue } from 'vue';

import type { ClassType } from '@vben/types';

import type { GridSectionOptions, SeparatorOptions } from './types';

import { cn } from '@vben/utils';

/**
 * 分段模式(default 即原有通栏色带外观)
 */
export type SegmentedMode = 'card' | 'default' | 'zone';

/**
 * 通栏扩展量变量:由组件按 VxeGrid 根节点实际内边距写入,
 * 分别测量左右内边距,分隔条以对应的负 margin 消费
 */
export const GRID_SEPARATOR_BLEED_LEFT_VAR = '--vben-grid-separator-bleed-left';
export const GRID_SEPARATOR_BLEED_RIGHT_VAR =
  '--vben-grid-separator-bleed-right';

/**
 * 双卡间距变量,消费方为表单壳层内的分隔区
 */
export const GRID_SECTION_GAP_VAR = '--vben-grid-section-gap';

/**
 * 下段(body wrapper)表面变量,消费方见 style.css
 */
export const GRID_BODY_BACKGROUND_VAR = '--vben-grid-body-background';
export const GRID_BODY_RADIUS_VAR = '--vben-grid-body-radius';
export const GRID_FULLSCREEN_BACKGROUND_VAR = '--vben-grid-fullscreen-bg';

const DEFAULT_GAP = '0.5rem';

export function resolveSegmentedMode(
  segmented: 'card' | 'zone' | false | undefined,
): SegmentedMode {
  if (segmented === 'card' || segmented === 'zone') {
    return segmented;
  }
  return 'default';
}

/**
 * 分隔条显隐:false/true 直接决定;对象有 show 用 show;
 * 否则使用模式默认值(仅默认形态显示;zone 的深色面板边缘与
 * card 的双卡布局自身已构成分隔,叠加 hairline 会与表格头
 * 自带边线形成双线,故默认隐藏)
 */
export function resolveSeparatorVisible(
  separator: boolean | SeparatorOptions | undefined,
  mode: SegmentedMode,
): boolean {
  if (separator === false) {
    return false;
  }
  if (separator === true) {
    return true;
  }
  if (separator && separator.show !== undefined) {
    return separator.show;
  }
  return mode === 'default';
}

/**
 * 通栏扩展:显式 fullBleed 优先,否则仅默认模式开启
 */
export function resolveSeparatorFullBleed(
  separator: boolean | SeparatorOptions | undefined,
  mode: SegmentedMode,
): boolean {
  if (
    separator &&
    typeof separator === 'object' &&
    separator.fullBleed !== undefined
  ) {
    return separator.fullBleed;
  }
  return mode === 'default';
}

/**
 * 分隔条 class:预设 → 用户 class(cn 合并,同名工具类以用户为准)。
 * 分隔条自身不带上下外边距,留白由表面管理,不依赖字段尾部 padding。
 */
export function resolveSeparatorStripClass(
  separator: boolean | SeparatorOptions | undefined,
  mode: SegmentedMode,
): string {
  const userClass =
    separator && typeof separator === 'object' ? separator.class : undefined;

  const preset =
    mode === 'default' ? 'bg-background-deep h-2' : 'h-px bg-border';
  return cn(preset, userClass);
}

/**
 * 分隔条 style:通栏扩展 → backgroundColor → 用户 style(数组依次合成)
 */
export function resolveSeparatorStyle(
  separator: boolean | SeparatorOptions | undefined,
  bleedEnabled: boolean,
): StyleValue | undefined {
  const styles: StyleValue[] = [];

  if (bleedEnabled) {
    styles.push({
      marginLeft: `calc(var(${GRID_SEPARATOR_BLEED_LEFT_VAR}, 0px) * -1)`,
      marginRight: `calc(var(${GRID_SEPARATOR_BLEED_RIGHT_VAR}, 0px) * -1)`,
    });
  }

  if (separator && typeof separator === 'object') {
    if (separator.backgroundColor) {
      styles.push({ backgroundColor: separator.backgroundColor });
    }
    if (separator.style) {
      styles.push(separator.style);
    }
  }

  if (styles.length === 0) {
    return undefined;
  }
  return styles.length === 1 ? styles[0] : styles;
}

/**
 * 表单表面 class:模式预设 → formClass。
 * 默认形态的上/左右留白由 grid 提供,表面只补底部;zone/card
 * 面板四周统一 8px。字段行间距独立管理,不再叠加尾部 padding。
 */
export function resolveSurfaceClass(
  mode: SegmentedMode,
  formClass?: ClassType,
): string {
  let preset: string;
  if (mode === 'card') {
    preset = 'bg-card rounded-[var(--radius)] p-2';
  } else if (mode === 'zone') {
    preset = 'bg-background-deep rounded-[var(--radius)] p-2';
  } else {
    preset = 'pb-2';
  }
  return cn(preset, formClass);
}

/**
 * 表单表面显式样式(sectionOptions.form,最后应用)
 */
export function resolveSurfaceStyle(
  sectionOptions?: GridSectionOptions,
): CSSProperties | undefined {
  if (!sectionOptions?.form) {
    return undefined;
  }
  const style: CSSProperties = {};
  if (sectionOptions.form.backgroundColor !== undefined) {
    style.backgroundColor = sectionOptions.form.backgroundColor;
  }
  if (sectionOptions.form.borderRadius !== undefined) {
    style.borderRadius = sectionOptions.form.borderRadius;
  }
  return Object.keys(style).length > 0 ? style : undefined;
}

/**
 * 双卡间距:CSS 长度,默认 0.5rem,不接受负数
 */
export function resolveSectionGap(gap?: string): string {
  const value = gap?.trim();
  if (value && !value.startsWith('-')) {
    return value;
  }
  if (value) {
    console.warn(
      '[Vben Vxe Table]: Invalid sectionOptions.gap, fallback to default:',
      DEFAULT_GAP,
    );
  }
  return DEFAULT_GAP;
}

/**
 * 是否需要下段表面适配(zone/card 或显式 body 配置),
 * 决定 data-vben-grid-sectioned 标记与布局契约校验是否生效
 */
export function isBodySectioned(
  mode: SegmentedMode,
  sectionOptions?: GridSectionOptions,
): boolean {
  return mode !== 'default' || !!sectionOptions?.body;
}

/**
 * 绑定在 VxeGrid 根节点上的分段 CSS 变量
 */
export function resolveGridSectionVars(
  mode: SegmentedMode,
  sectionOptions?: GridSectionOptions,
): CSSProperties {
  const vars: CSSProperties = {};

  if (mode === 'card') {
    vars[GRID_BODY_BACKGROUND_VAR] =
      sectionOptions?.body?.backgroundColor ?? 'hsl(var(--card))';
    vars[GRID_BODY_RADIUS_VAR] =
      sectionOptions?.body?.borderRadius ?? 'var(--radius)';
    vars[GRID_FULLSCREEN_BACKGROUND_VAR] =
      sectionOptions?.fullscreenBackgroundColor ??
      'hsl(var(--background-deep))';
    vars[GRID_SECTION_GAP_VAR] = resolveSectionGap(sectionOptions?.gap);
  } else if (sectionOptions?.body) {
    if (sectionOptions.body.backgroundColor !== undefined) {
      vars[GRID_BODY_BACKGROUND_VAR] = sectionOptions.body.backgroundColor;
    }
    if (sectionOptions.body.borderRadius !== undefined) {
      vars[GRID_BODY_RADIUS_VAR] = sectionOptions.body.borderRadius;
    }
  }

  return vars;
}

const SECTION_BODY_KEYS = new Set([
  'Bottom',
  'Pager',
  'Table',
  'Toolbar',
  'Top',
]);

/**
 * vxe 默认布局(grid.js defaultLayouts);layouts 缺省时等效于它
 */
const VXE_DEFAULT_HEAD_KEYS = ['Form'];
const VXE_DEFAULT_BODY_KEYS = ['Toolbar', 'Top', 'Table', 'Bottom', 'Pager'];

/**
 * 分段布局契约校验(zone/card 或显式 body 配置生效时调用)。
 *
 * 归一化规则与 vxe computeCurrLayoutConf 一致:嵌套数组取
 * head/body/footer 三段,扁平数组视为仅 body;缺省时等效 vxe 默认布局。
 * 要求:header 只包含 Form;body 包含唯一的 Table,其余仅允许
 * Toolbar/Top/Bottom/Pager;footer 为空。
 * 返回问题描述列表,为空即通过。
 */
export function validateSectionLayouts(layouts: unknown): string[] {
  const problems: string[] = [];

  let headKeys: string[] = VXE_DEFAULT_HEAD_KEYS;
  let bodyKeys: string[] = VXE_DEFAULT_BODY_KEYS;
  let footKeys: string[] = [];

  if (Array.isArray(layouts) && layouts.length > 0) {
    if (Array.isArray(layouts[0])) {
      headKeys = layouts[0] as string[];
      // body/footer 槽位可能被配成非数组(畸形配置),守卫而不是抛错
      if (Array.isArray(layouts[1])) {
        bodyKeys = layouts[1];
      } else {
        problems.push(
          `the body layout must be an array, got ${typeof layouts[1]}`,
        );
      }
      if (Array.isArray(layouts[2])) {
        footKeys = layouts[2];
      } else if (layouts[2] !== undefined) {
        problems.push(
          `the footer layout must be an array, got ${typeof layouts[2]}`,
        );
      }
    } else {
      // 扁平数组视为仅 body(header 为空,校验会报告缺少 Form)
      headKeys = [];
      bodyKeys = layouts as string[];
    }
  }

  if (headKeys.length !== 1 || headKeys[0] !== 'Form') {
    problems.push(
      `the header layout must be exactly ["Form"], got [${headKeys.join(', ')}]`,
    );
  }

  const tableCount = bodyKeys.filter((key) => key === 'Table').length;
  if (tableCount !== 1) {
    problems.push(
      `the body layout must contain exactly one "Table", got ${tableCount}`,
    );
  }

  const invalidBodyKeys = bodyKeys.filter((key) => !SECTION_BODY_KEYS.has(key));
  if (invalidBodyKeys.length > 0) {
    problems.push(
      `the body layout only allows Toolbar/Top/Table/Bottom/Pager, found [${invalidBodyKeys.join(', ')}]`,
    );
  }

  if (footKeys.length > 0) {
    problems.push(
      `the footer layout must be empty, got [${footKeys.join(', ')}]`,
    );
  }

  return problems;
}
