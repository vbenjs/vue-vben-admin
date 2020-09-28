import type { VNode } from 'vue';
import type { CollapseContainerOptions } from '/@/components/Container/index';

export interface DescItem {
  // 最小宽度
  labelMinWidth?: number;

  contentMinWidth?: number;

  labelStyle?: any;

  field: string;
  label: string;
  // 和并列
  span?: number;
  show?: (...arg: any) => boolean;
  // render
  render?: (val: string, data: any) => VNode | undefined | Element | string | number;
}

export interface DescOptions {
  // 是否包含collapse组件
  useCollapse?: boolean;
  /**
   * item配置
   * @type DescItem
   */
  schema: DescItem[];
  /**
   * 数据
   * @type object
   */
  data: object;
  /**
   * 内置的CollapseContainer组件配置
   * @type CollapseContainerOptions
   */
  collapseOptions?: CollapseContainerOptions;
  /**
   * descriptions size type
   * @default 'default'
   * @type string
   */
  size?: 'default' | 'middle' | 'small';

  /**
   * custom prefixCls
   * @type string
   */
  prefixCls?: string;

  /**
   * whether descriptions have border
   * @default false
   * @type boolean
   */
  bordered?: boolean;

  /**
   * custom title
   * @type any
   */
  title?: any;

  /**
   * the number of descriptionsitem in one line
   * @default 3
   * @type number | object
   */
  column?: number | object;

  /**
   * descriptions layout
   * @default 'horizontal'
   * @type string
   */
  layout?: 'horizontal' | 'vertical';

  /**
   * whether have colon in descriptionsitem
   * @default true
   * @type boolean
   */
  colon?: boolean;
}

export interface DescInstance {
  setDescProps(descProps: Partial<DescOptions>): void;
}

export type Register = (descInstance: DescInstance) => void;
/**
 * @description:
 */
export type UseDescReturnType = [Register, DescInstance];
