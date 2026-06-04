import type { VNode } from 'vue';

import type {
  DescriptionsBreakpoint,
  DescriptionsColumn,
  DescriptionsItemType,
  InternalDescriptionsItem,
  ScreenMap,
} from './types';

import { Comment, computed, Fragment } from 'vue';

import { useBreakpoints } from '@vueuse/core';

/** 默认列数映射 */
export const DEFAULT_COLUMN_MAP: Record<DescriptionsBreakpoint, number> = {
  lg: 3,
  md: 3,
  sm: 2,
  xl: 3,
  xs: 1,
  xxl: 3,
  xxxl: 4,
};

/** 由大到小的断点顺序，matchScreen 按此顺序取第一个命中的值 */
const RESPONSIVE_ARRAY: DescriptionsBreakpoint[] = [
  'xxxl',
  'xxl',
  'xl',
  'lg',
  'md',
  'sm',
  'xs',
];

/** 断点像素值 */
const BREAKPOINT_PX = {
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1600,
  xxxl: 2000,
};

/**
 * 在给定的断点配置中，按由大到小的顺序取第一个命中的值
 */
export function matchScreen(
  screens: ScreenMap,
  screenSizes?: Partial<Record<DescriptionsBreakpoint, number>>,
): number | undefined {
  if (!screenSizes) return undefined;
  for (const breakpoint of RESPONSIVE_ARRAY) {
    if (screens[breakpoint] && screenSizes[breakpoint] !== undefined) {
      return screenSizes[breakpoint];
    }
  }
  return undefined;
}

/**
 * 监听视口宽度，返回当前命中的断点集合
 */
export function useScreens() {
  const breakpoints = useBreakpoints(BREAKPOINT_PX);
  return computed<ScreenMap>(() => ({
    lg: breakpoints.lg.value,
    md: breakpoints.md.value,
    sm: breakpoints.sm.value,
    xl: breakpoints.xl.value,
    xs: !breakpoints.sm.value,
    xxl: breakpoints.xxl.value,
    xxxl: breakpoints.xxxl.value,
  }));
}

/**
 * 计算最终列数：固定数字直接返回，否则按断点解析
 */
export function resolveColumn(
  column: DescriptionsColumn | undefined,
  screens: ScreenMap,
): number {
  if (typeof column === 'number') return column;
  return matchScreen(screens, { ...DEFAULT_COLUMN_MAP, ...column }) ?? 3;
}

/**
 * 归一化列表项：将 span 解析为数字，'filled' 标记为 filled
 */
export function normalizeItems(
  items: DescriptionsItemType[],
  screens: ScreenMap,
): InternalDescriptionsItem[] {
  return items.map((item, index) => {
    const { span, ...rest } = item;
    if (span === 'filled') {
      return { ...rest, _index: index, filled: true };
    }
    return {
      ...rest,
      _index: index,
      span: typeof span === 'number' ? span : matchScreen(screens, span),
    };
  });
}

/**
 * 行装箱算法：根据列数与各项 span 将列表项拆分为多行，
 * 并补齐每行最后一项以占满列数。移植自 antdv-next useRow。
 */
export function calcRows(
  items: InternalDescriptionsItem[],
  column: number,
): InternalDescriptionsItem[][] {
  let rows: InternalDescriptionsItem[][] = [];
  let tmpRow: InternalDescriptionsItem[] = [];
  let count = 0;

  items.filter(Boolean).forEach((item) => {
    const { filled, ...rest } = item;
    // filled：占满当前行剩余，并立即换行
    if (filled) {
      tmpRow.push(rest);
      rows.push(tmpRow);
      tmpRow = [];
      count = 0;
      return;
    }

    const restSpan = column - count;
    count += item.span || 1;

    if (count >= column) {
      // 超出列数时，将当前项 span 收敛为剩余列数，避免溢出
      tmpRow.push(count > column ? { ...rest, span: restSpan } : rest);
      rows.push(tmpRow);
      tmpRow = [];
      count = 0;
    } else {
      tmpRow.push(rest);
    }
  });

  if (tmpRow.length > 0) rows.push(tmpRow);

  // 补齐：若一行总 span 不足列数，扩展最后一项
  rows = rows.map((row) => {
    const total = row.reduce((acc, item) => acc + (item.span || 1), 0);
    if (total < column) {
      const last = row[row.length - 1];
      if (last) {
        last.span = column - (total - (last.span || 1));
      }
    }
    return row;
  });

  return rows;
}

/** 标记组件类型为 DescriptionsItem，便于从插槽 vnode 中识别 */
export const DESCRIPTIONS_ITEM_NAME = 'VbenDescriptionsItem';

function isItemVNode(node: VNode): boolean {
  const type = node.type as any;
  return (
    !!type &&
    (type.__isDescriptionsItem === true || type.name === DESCRIPTIONS_ITEM_NAME)
  );
}

function flattenVNodes(nodes: VNode[]): VNode[] {
  const result: VNode[] = [];
  for (const node of nodes) {
    if (node.type === Fragment && Array.isArray(node.children)) {
      result.push(...flattenVNodes(node.children as VNode[]));
    } else if (node.type !== Comment) {
      result.push(node);
    }
  }
  return result;
}

/**
 * 从默认插槽的 vnode 中解析出列表项，支持
 * <VbenDescriptionsItem label="..." :span="2">content</VbenDescriptionsItem> 写法
 */
export function parseItemsFromSlot(nodes: VNode[]): DescriptionsItemType[] {
  return flattenVNodes(nodes)
    .filter((node) => isItemVNode(node))
    .map((node) => {
      const props = (node.props ?? {}) as Record<string, any>;
      const children = (node.children ?? {}) as Record<string, any>;
      const labelSlot =
        typeof children.label === 'function' ? children.label : undefined;
      const contentDefaultSlot =
        typeof children.default === 'function' ? children.default : undefined;
      const contentSlot =
        typeof children.content === 'function'
          ? children.content
          : contentDefaultSlot;
      return {
        class: props.class,
        content: contentSlot ?? props.content,
        contentStyle: props.contentStyle ?? props['content-style'],
        key: node.key ?? undefined,
        label: labelSlot ?? props.label,
        labelStyle: props.labelStyle ?? props['label-style'],
        span: props.span,
        style: props.style,
      } as DescriptionsItemType;
    });
}
