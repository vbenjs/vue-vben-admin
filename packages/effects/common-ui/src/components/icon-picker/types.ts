import type { VNode } from 'vue';

export interface IconPickerProps {
  pageSize?: number;
  /** 图标集的名字 */
  prefix?: string;
  /** 是否自动请求API以获得图标集的数据.提供prefix时有效 */
  autoFetchApi?: boolean;
  /**
   * 图标列表
   */
  icons?: string[];
  /** Input组件 */
  inputComponent?: VNode;
  /** 图标插槽名，预览图标将被渲染到此插槽中 */
  iconSlot?: string;
  /** input组件的值属性名称 */
  modelValueProp?: string;
  /** 图标样式 */
  iconClass?: string;
  type?: 'icon' | 'input';
}
