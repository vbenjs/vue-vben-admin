import type {
  VxeGridListeners,
  VxeGridPropTypes,
  VxeGridProps as VxeTableGridProps,
  VxeUIExport,
} from 'vxe-table';

import type { CSSProperties, Ref, StyleValue } from 'vue';

import type { ClassType, DeepPartial } from '@vben/types';

import type {
  BaseFormComponentType,
  FormValues,
  VbenFormProps,
} from '@vben-core/form-ui';

import type { VxeGridApi } from './api';
import type { ViewedRowOptions } from './viewed-row';

import { useVbenForm } from '@vben-core/form-ui';

export interface VxePaginationInfo {
  currentPage: number;
  pageSize: number;
  total: number;
}

interface ToolbarConfigOptions extends VxeGridPropTypes.ToolbarConfig {
  /** 是否显示切换搜索表单的按钮 */
  search?: boolean;
}

export type VxeTableGridColumns<T = any> = VxeTableGridOptions<T>['columns'];

export interface VxeTableGridOptions<T = any> extends VxeTableGridProps<T> {
  /** 工具栏配置 */
  toolbarConfig?: ToolbarConfigOptions;
}

/**
 * 分段表面的可定制样式(仅背景与圆角;垂直 padding/border/margin 不在
 * VXE 的高度排除算法内,刻意不开放)。长度必须是 CSS 长度字符串
 * (如 '12px'):数字会原样写入 CSS 变量,自定义属性不追加单位,
 * 无单位的非零圆角会被浏览器丢弃
 */
export interface GridSurfaceStyle {
  backgroundColor?: string;
  borderRadius?: string;
}

export interface GridSectionOptions {
  /**
   * 上段(表单表面)显式表面配置,优先于模式预设与 formClass
   */
  form?: GridSurfaceStyle;
  /**
   * 下段(VXE body wrapper)显式表面配置,优先于模式默认值
   */
  body?: GridSurfaceStyle;
  /**
   * 双卡间距;CSS 长度,默认 0.5rem,不接受负数
   */
  gap?: string;
  /**
   * 双卡全屏时的根节点背景,默认 hsl(var(--background-deep))
   */
  fullscreenBackgroundColor?: CSSProperties['backgroundColor'];
}

export interface SeparatorOptions {
  show?: boolean;
  backgroundColor?: string;
  /**
   * 分隔条 class,按"预设 class → 用户 class"合并
   */
  class?: ClassType;
  /**
   * 分隔条 style,按"backgroundColor → 用户 style"合成
   */
  style?: StyleValue;
  /**
   * 是否扩展到 Grid 内边距外沿(通栏);默认模式为 true,其他模式为 false
   */
  fullBleed?: boolean;
}

export interface VxeGridProps<
  T extends Record<string, any> = any,
  D extends BaseFormComponentType = BaseFormComponentType,
  P extends Record<string, any> = Record<string, never>,
  TFormValues extends FormValues = FormValues,
  TSubmitValues extends FormValues = TFormValues,
> {
  /**
   * 数据
   */
  tableData?: any[];
  /**
   * 标题
   */
  tableTitle?: string;
  /**
   * 标题帮助
   */
  tableTitleHelp?: string;
  /**
   * 组件class
   */
  class?: ClassType;
  /**
   * vxe-grid class
   */
  gridClass?: ClassType;
  /**
   * vxe-grid 配置
   */
  gridOptions?: DeepPartial<VxeTableGridOptions<T>>;
  /**
   * vxe-grid 事件
   */
  gridEvents?: DeepPartial<VxeGridListeners<T>>;
  /**
   * 表单配置
   */
  formOptions?: VbenFormProps<D, P, TFormValues, TSubmitValues>;
  /**
   * 显示搜索表单
   */
  showSearchForm?: boolean;
  /**
   * 搜索表单与表格主体之间的分隔条
   */
  separator?: boolean | SeparatorOptions;
  /**
   * 分段模式:
   * - false / 缺省: 通栏色带(默认外观)
   * - zone: 单卡双区,上段为卡内圆角面板
   * - card: 双独立卡片,上/下段各为独立圆角卡片
   */
  segmented?: 'card' | 'zone' | false;
  /**
   * 分段表面配置(两段背景/圆角、双卡间距、全屏底色)
   */
  sectionOptions?: GridSectionOptions;
  /**
   * 表单外层表面 class,用于 padding/背景/圆角,也作用于自定义 form slot。
   * 与 formOptions.wrapperClass(字段栅格)、commonConfig.formItemClass
   * (字段)、actionWrapperClass(按钮组)作用于不同节点,优先于模式预设。
   */
  formClass?: ClassType;
  /**
   * 已读行功能
   */
  viewedRowOptions?: boolean | ViewedRowOptions<T>;
}

export type ExtendedVxeGridApi<
  D extends Record<string, any> = any,
  F extends BaseFormComponentType = BaseFormComponentType,
  P extends Record<string, any> = Record<string, never>,
  TFormValues extends FormValues = FormValues,
  TSubmitValues extends FormValues = TFormValues,
> = VxeGridApi<D, F, P, TFormValues, TSubmitValues> & {
  useStore: <S = NoInfer<VxeGridProps<D, F, P, TFormValues, TSubmitValues>>>(
    selector?: (
      state: NoInfer<VxeGridProps<D, F, P, TFormValues, TSubmitValues>>,
    ) => S,
  ) => Readonly<Ref<S>>;
};

export interface SetupVxeTable {
  configVxeTable: (ui: VxeUIExport) => void;
  useVbenForm?: typeof useVbenForm;
}
