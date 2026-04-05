import type { Component } from 'vue';

import type { AnyPromiseFunction } from '@vben/types';

export type ApiComponentOptionsItem = {
  [name: string]: any;
  children?: ApiComponentOptionsItem[];
  disabled?: boolean;
  label?: string;
  value?: number | string;
};

export interface ApiComponentProps {
  /** 组件 */
  component: Component;
  /** 是否将value从数字转为string */
  numberToString?: boolean;
  /** 获取options数据的函数 */
  api?: (arg?: any) => Promise<ApiComponentOptionsItem[] | Record<string, any>>;
  /** 传递给api的参数 */
  params?: Record<string, any>;
  /** 从api返回的结果中提取options数组的字段名 */
  resultField?: string;
  /** label字段名 */
  labelField?: string;
  /** children字段名，需要层级数据的组件可用 */
  childrenField?: string;
  /** value字段名 */
  valueField?: string;
  /** disabled字段名 */
  disabledField?: string;
  /** 组件接收options数据的属性名 */
  optionsPropName?: string;
  /** 是否立即调用api */
  immediate?: boolean;
  /** 每次`visibleEvent`事件发生时都重新请求数据 */
  alwaysLoad?: boolean;
  /** 在api请求之前的回调函数 */
  beforeFetch?: AnyPromiseFunction<any, any>;
  /** 在api请求之前的判断是否允许请求的回调函数 */
  shouldFetch?: AnyPromiseFunction<any, boolean>;
  /** 在api请求之后的回调函数 */
  afterFetch?: AnyPromiseFunction<any, any>;
  /** 直接传入选项数据，也作为api返回空数据时的后备数据 */
  options?: ApiComponentOptionsItem[];
  /** 组件的插槽名称，用来显示一个"加载中"的图标 */
  loadingSlot?: string;
  /** 触发api请求的事件名 */
  visibleEvent?: string;
  /** 组件的v-model属性名，默认为modelValue。部分组件可能为value */
  modelPropName?: string;
  /**
   * 自动选择
   * - `first`：自动选择第一个选项
   * - `last`：自动选择最后一个选项
   * - `one`: 当请求的结果只有一个选项时，自动选择该选项
   * - 函数：自定义选择逻辑，函数的参数为请求的结果数组，返回值为选择的选项
   * - false：不自动选择(默认)
   */
  autoSelect?:
    | 'first'
    | 'last'
    | 'one'
    | ((item: ApiComponentOptionsItem[]) => ApiComponentOptionsItem)
    | false;
}

export type ApiComponentSharedProps = Omit<ApiComponentProps, 'component'>;
