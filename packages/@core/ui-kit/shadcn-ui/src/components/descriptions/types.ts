import type { Component, CSSProperties } from 'vue';

/** 响应式断点，与 antdv-next 保持一致 */
export type DescriptionsBreakpoint =
  | 'lg'
  | 'md'
  | 'sm'
  | 'xl'
  | 'xs'
  | 'xxl'
  | 'xxxl';

/** 当前命中的断点集合 */
export type ScreenMap = Partial<Record<DescriptionsBreakpoint, boolean>>;

export type DescriptionsLayout = 'horizontal' | 'vertical';

export type DescriptionsSize = 'large' | 'middle' | 'small';

/** 列数，可为固定数字或按断点配置 */
export type DescriptionsColumn =
  | number
  | Partial<Record<DescriptionsBreakpoint, number>>;

/** 单项跨列，支持固定数字、'filled'（占满当前行剩余）或按断点配置 */
export type DescriptionsItemSpan =
  | 'filled'
  | number
  | Partial<Record<DescriptionsBreakpoint, number>>;

/** 可渲染内容：字符串/数字/渲染函数/组件 */
export type DescriptionsRenderNode = (() => any) | Component | number | string;

export interface DescriptionsItemType {
  /** 内容 */
  content?: DescriptionsRenderNode;
  /** 内容样式 */
  contentStyle?: CSSProperties;
  /** 唯一 key */
  key?: number | string;
  /** 标签 */
  label?: DescriptionsRenderNode;
  /** 标签样式 */
  labelStyle?: CSSProperties;
  /** 跨列 */
  span?: DescriptionsItemSpan;
}

export interface DescriptionsProps {
  /** 是否展示边框 */
  bordered?: boolean;
  class?: any;
  /** 是否显示冒号（仅非 bordered 的水平布局生效） */
  colon?: boolean;
  /** 一行的列数 */
  column?: DescriptionsColumn;
  /** 统一的内容样式 */
  contentStyle?: CSSProperties;
  /** 操作区域，位于标题右侧 */
  extra?: string;
  /** 数据驱动的列表项；不传则读取默认插槽中的 VbenDescriptionsItem */
  items?: DescriptionsItemType[];
  /** 统一的标签样式 */
  labelStyle?: CSSProperties;
  /** 布局方式 */
  layout?: DescriptionsLayout;
  /** 尺寸 */
  size?: DescriptionsSize;
  /** 标题 */
  title?: string;
}

export interface DescriptionsItemProps {
  content?: DescriptionsRenderNode;
  contentStyle?: CSSProperties;
  label?: DescriptionsRenderNode;
  labelStyle?: CSSProperties;
  span?: DescriptionsItemSpan;
}

/** 归一化后的内部项，span 已解析为数字 */
export interface InternalDescriptionsItem {
  _index?: number;
  class?: string;
  content?: DescriptionsRenderNode;
  contentStyle?: CSSProperties;
  filled?: boolean;
  key?: number | string;
  label?: DescriptionsRenderNode;
  labelStyle?: CSSProperties;
  span?: number;
  style?: CSSProperties;
}
