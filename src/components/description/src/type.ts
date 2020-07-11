import { VNode } from 'vue';
import { CollapseContainerOptions } from '@/components/container/index';

export interface DescItem {
  field: string;
  label: string;
  // 和并列
  span?: number;
  show?: () => boolean;
  // render
  render?: (i: any) => VNode | undefined | Element;
}

export interface DescOptions {
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
  setProps(descProps: Partial<DescOptions>): void;
}
export type GetDescFn = (descInstance: DescInstance) => void;
/**
 * @description:
 */
export type UseDescReturnType = [GetDescFn, DescInstance];
