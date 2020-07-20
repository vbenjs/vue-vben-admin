import { ColEx, ComponentType } from './index';
import { VNode, Ref } from 'compatible-vue';
import { Button } from 'ant-design-vue';
import {
  WrappedFormUtils,
  FieldDecoratorOptions,
  ValidationRule,
} from 'ant-design-vue/types/form/form';
import { FormItem } from './formItem';

export interface PropsHelp {
  placeholder?: string;
  allowClear?: boolean;
  disabled?: boolean;
  size?: 'large' | 'default' | 'small';
  value?: any;
}
export interface RenderCallbackParams {
  schema: FormSchema;
  values: any;
  form: WrappedFormUtils;
}

export interface ValidateResult<T> {
  err: Error[];
  values: any;
}
export interface ComponentOn {
  [key: string]: Function;
}
export interface FormSchema {
  // 字段名
  field: string;
  // 标签名
  label: string;

  // label宽度,有传的话 itemProps配置的 labelCol 和WrapperCol会失效
  labelWidth?: string | number;

  // 禁用调有formModel全局设置的labelWidth,自己手动设置 labelCol和wrapperCol
  disabledLabelWidth?: boolean;

  // 组件
  component?: ComponentType;

  isAdvanced?: false;

  // 组件参数
  componentProps?: any;

  // 组件事件
  componentOn?: ComponentOn;

  // // 是否必填
  // required?: boolean;

  // 校验规则
  rules?: ValidationRule[];
  // 校验信息是否加入label
  rulesMessageJoinLabel?: boolean;

  // 参考formModelItem
  itemProps?: Partial<FormItem>;

  // formModelItem外层的col配置
  colProps?: Partial<ColEx>;

  // 默认值
  defaultValue?: any;

  // 配合详情组件
  span?: number;
  // 渲染form-item标签内的内容
  render?: (renderCallbackParams: RenderCallbackParams) => VNode | VNode[] | string;

  // 渲染 col内容,需要外层包裹 form-item
  renderColContent?: (renderCallbackParams: RenderCallbackParams) => VNode | VNode[];

  renderComponentContent?:
    | ((renderCallbackParams: RenderCallbackParams) => VNode | VNode[])
    | string;

  // 自定义slot, 在 from-item内
  slot?: string;

  // 自定义slot,类似renderColContent
  colSlot?: string;
  // 配置
  fieldDecoratorOptions?: FieldDecoratorOptions;

  show?: boolean | ((renderCallbackParams: RenderCallbackParams) => boolean);

  dynamicDisabled?: boolean | ((renderCallbackParams: RenderCallbackParams) => boolean);

  dynamicRules?: (renderCallbackParams: RenderCallbackParams) => ValidationRule[];
}
export interface AllItemProps {
  // 当设置了改属性后,form下所有label都会使用这个宽度
  labelWidth?: string | number;

  // 以下为默认props
  wrapperCol: ColEx;

  colon: boolean;

  labelAlign: 'left' | 'right';

  labelCol: ColEx;
}

export interface ActionButtonOption extends Button {
  text?: string;
  on?: ComponentOn;
}
export type FieldMapToTime = [string, [string, string], string?][];

export interface FormProps extends AllItemProps {
  form: WrappedFormUtils;
  // 表单配置规则
  schemas: FormSchema[];
  // 紧凑模式,用于搜索表单
  compact: boolean;
  size: 'default' | 'small' | 'large';
  // 是否禁用
  disabled?: boolean;
  /**
   * @description: 时间区间字段映射成多个
   */
  fieldMapToTime?: FieldMapToTime;

  // 自动设置placeholder
  autoSetPlaceHolder: boolean;
  // 校验信息是否加入label
  rulesMessageJoinLabel?: boolean;
  // 是否显示收起展开按钮
  showAdvancedButton?: boolean;
  // 超过指定行数自动收起
  autoAdvancedLine?: number;
  // 是否显示操作按钮
  showActionButtonGroup: boolean;
  // 操作列配置
  actionColOptions: Partial<ColEx>;
  // 显示重置按钮
  showResetButton: boolean;
  // 重置按钮配置
  resetButtonOptions: Partial<ActionButtonOption>;

  // 显示确认按钮
  showSubmitButton: boolean;
  // 确认按钮配置
  submitButtonOptions: Partial<ActionButtonOption>;

  resetFunc: () => Promise<void>;
  submitFunc: () => Promise<void>;
  transformDateFunc: (date: any) => string;
  // 以下为默认props
  hideRequiredMark: boolean;

  layout: 'horizontal' | 'inline' | 'vertical';

  selfUpdate: boolean;
}

/**
 * @description: 表单实例
 */
export interface FormInstance extends Partial<WrappedFormUtils> {
  validateFieldsAndScroll<T>(): Promise<ValidateResult<T>>;
  validateFields<T>(): Promise<ValidateResult<T>>;
  setFieldsValue<T>(values: T): void;
  resetFields(): Promise<any>;
  getFieldsValue: () => { [field: string]: any };
  updateSchema(data: Partial<FormSchema> | Partial<FormSchema>[]): void;
  setProps(formProps: Partial<FormProps>): void;
  removeSchemaByFiled(field: string | string[]): void;
  appendSchemaByField(schema: FormSchema, prefixField?: string): void;
}
export type GetFormFn = (formInstance: FormInstance) => void;
/**
 * @description:
 */
export type UseFormReturnType = [
  GetFormFn,
  FormInstance & {
    formRef: Ref<FormInstance>;
    useTableForm: (beforeFn?: <T>(data: T) => T) => { query: () => void };
  }
];
