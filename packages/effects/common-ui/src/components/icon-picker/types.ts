import type { Component } from 'vue';

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
  /**
   * Input 组件定义（Input/NInput/ElInput），经 `:is` 渲染，取值经
   * v-model 与 modelValueProp 交互——传组件而非 h() VNode，VNode 会在
   * h() 时固化 props，与模板的动态绑定冲突。
   */
  inputComponent?: Component;
  /** 图标插槽名，预览图标将被渲染到此插槽中 */
  iconSlot?: string;
  /** input组件的值属性名称（如 antd 为 'value'、element 为 'model-value'）。组件自身的取值始终通过 v-model 交互 */
  modelValueProp?: string;
  /** 图标样式 */
  iconClass?: string;
  type?: 'icon' | 'input';
}
