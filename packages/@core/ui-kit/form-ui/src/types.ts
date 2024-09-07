import type { VbenButtonProps } from '@vben-core/shadcn-ui';
import type { Field, FormContext, GenericObject } from 'vee-validate';
import type { ZodTypeAny } from 'zod';

import type { FormApi } from './form-api';

import type { Component, Ref } from 'vue';

export type FormLayout = 'horizontal' | 'vertical';

export type BaseComponentType =
  | 'VbenCheckbox'
  | 'VbenInput'
  | 'VbenInputPassword'
  | 'VbenPinInput'
  | 'VbenSelect';

type Breakpoints = '' | '2xl:' | '3xl:' | 'lg:' | 'md:' | 'sm:' | 'xl:';

export type GridClassType =
  | `${Breakpoints}grid-cols-${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10}`
  | (Record<never, never> & string);

export interface FormCommonConfig {
  // 所有表单项的控件样式,可以控制表单项大小
  controlClass?: string;
  /**
   * 所有表单项的禁用状态
   * @default false
   */
  disabled?: boolean;
  /**
   * 所有表单项的控件样式,可以控制表单项大小
   * @default "h-8"
   */
  formFieldProps?: Partial<typeof Field>;
  /**
   * 所有表单项的栅格布局
   * @default ""
   */
  gridItemClass?: string;
  /**
   * 隐藏所有表单项label
   * @default false
   */
  hideLabel?: boolean;
  /**
   * 是否隐藏必填标记
   * @default false
   */
  hideRequiredMark?: boolean;
  /**
   * 所有表单项的label样式
   * @default "w-[100px]"
   */
  labelClass?: string;
  /**
   * 所有表单项的label宽度
   */
  labelWidth?: number;
  /**
   * 所有表单项的wrapper样式
   */
  wrapperClass?: string;
}

export interface FormShape {
  /** 默认值 */
  default?: any;
  /** 字段名 */
  fieldName: string;
  /** 是否必填 */
  required?: boolean;
  rules?: ZodTypeAny;
}

export type MaybeComponentPropKey =
  | 'options'
  | 'placeholder'
  | 'title'
  | (Record<never, never> & string);

export type MaybeComponentProps = { [K in MaybeComponentPropKey]?: any };

export type FormActions = FormContext<GenericObject>;

type FormItemDependenciesCondition<T = boolean | PromiseLike<boolean>> = (
  value: Partial<Record<string, any>>,
  actions: FormActions,
) => T;

type FormItemDependenciesConditionWithRules = (
  value: Partial<Record<string, any>>,
  actions: FormActions,
) => PromiseLike<ZodTypeAny> | ZodTypeAny;

type FormItemDependenciesConditionWithProps = (
  value: Partial<Record<string, any>>,
  actions: FormActions,
) => MaybeComponentProps | PromiseLike<MaybeComponentProps>;

export interface FormItemDependencies {
  /**
   * 组件参数
   * @returns 组件参数
   */
  componentProps?: FormItemDependenciesConditionWithProps;
  /**
   * 是否禁用
   * @returns 是否禁用
   */
  disabled?: FormItemDependenciesCondition;
  /**
   * 是否渲染（删除dom）
   * @returns 是否渲染
   */
  if?: FormItemDependenciesCondition;
  /**
   * 是否必填
   * @returns 是否必填
   */
  required?: FormItemDependenciesCondition;

  /**
   * 字段规则
   */
  rules?: FormItemDependenciesConditionWithRules;
  /**
   * 是否隐藏(Css)
   * @returns 是否隐藏
   */
  show?: FormItemDependenciesCondition;
  /**
   * 任意触发都会执行
   */
  trigger?: FormItemDependenciesCondition<void>;
  /**
   * 触发字段
   */
  triggerFields: string[];
}

type ComponentProps =
  | ((
      value: Partial<Record<string, any>>,
      actions: FormActions,
    ) => MaybeComponentProps)
  | MaybeComponentProps;

type RenderComponentContentType = (
  value: Partial<Record<string, any>>,
  api: FormActions,
) => Record<string, any>;

export type HandleSubmitFn = (
  values: Record<string, any>,
) => Promise<void> | void;

export type HandleResetFn = (
  values: Record<string, any>,
) => Promise<void> | void;

export interface FormSchema<T extends BaseComponentType = BaseComponentType>
  extends FormCommonConfig {
  /** 组件 */
  component: Component | T;
  /** 组件参数 */
  componentProps?: ComponentProps;
  /** 依赖 */
  dependencies?: FormItemDependencies;
  /** 描述 */
  description?: string;
  /** 字段名 */
  fieldName: string;
  /** 帮助信息 */
  help?: string;
  /** 表单项 */
  label?: string;
  // 自定义组件内部渲染
  renderComponentContent?: RenderComponentContentType;
  /** 字段规则 */
  rules?: ZodTypeAny;
  /** 后缀 */
  suffix?: () => Component | string;
}

export interface FormFieldProps extends FormSchema {
  required?: boolean;
}

export interface FormRenderProps {
  /**
   * 折叠时保持行数
   * @default 1
   */
  collapsedRows?: number;
  /**
   * 表单项通用后备配置，当子项目没配置时使用这里的配置，子项目配置优先级高于此配置
   */
  commonConfig?: FormCommonConfig;
  /**
   * 组件v-model事件绑定
   */
  componentBindEventMap?: Partial<Record<BaseComponentType, string>>;
  /**
   * 组件集合
   */
  componentMap: Record<BaseComponentType, Component>;
  /**
   * 是否可以展开/折叠
   */
  expandable?: boolean;
  /**
   * 表单实例
   */
  form?: FormContext<GenericObject>;
  /**
   * 表单栅格布局
   * @default "grid-cols-1"
   */
  gridClass?: GridClassType;
  /**
   * 是否展开，在expandable=true下生效
   */
  isExpand?: boolean;
  /**
   * 表单项布局
   */
  layout?: FormLayout;
  /**
   * 表单定义
   */
  schema?: FormSchema[];
}

export interface ActionButtonOptions extends VbenButtonProps {
  show?: boolean;
  text?: string;
}

export interface VbenFormProps
  extends Omit<
    FormRenderProps,
    'componentBindEventMap' | 'componentMap' | 'form'
  > {
  /**
   * 表单操作区域class
   */
  actionWrapperClass?: any;
  /**
   * 表单重置回调
   */
  handleReset?: HandleResetFn;
  /**
   * 表单提交回调
   */
  handleSubmit?: HandleSubmitFn;

  /**
   * 重置按钮参数
   */
  resetButtonOptions?: ActionButtonOptions;

  /**
   * 是否显示默认操作按钮
   */
  showDefaultActions?: boolean;

  /**
   * 提交按钮参数
   */
  submitButtonOptions?: ActionButtonOptions;
}

export type ExtendedFormApi = {
  useStore: <T = NoInfer<VbenFormProps>>(
    selector?: (state: NoInfer<VbenFormProps>) => T,
  ) => Readonly<Ref<T>>;
} & FormApi;
