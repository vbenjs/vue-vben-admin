import type { ZodType } from 'zod';

import type { Component, HtmlHTMLAttributes, Ref } from 'vue';

import type { VbenButtonProps } from '@vben-core/shadcn-ui';
import type { ClassType, MaybeComputedRef } from '@vben-core/typings';

import type { FormApi } from './form-api';

export type FormValues = Record<string, any>;

export interface FormCodec<
  TFormValues extends FormValues = FormValues,
  TSubmitValues extends FormValues = TFormValues,
> {
  /** 将提交值转换为表单组件值。 */
  decode: (values: Readonly<TSubmitValues>) => TFormValues;
  /** 将表单组件值转换为提交值。 */
  encode: (values: Readonly<TFormValues>) => TSubmitValues;
}

export type FormFieldName<TValues extends FormValues = FormValues> =
  | Extract<keyof TValues, string>
  | (Record<never, never> & string);

export type FormFieldValue<
  TValues extends FormValues,
  TFieldName extends string,
> = TFieldName extends keyof TValues ? TValues[TFieldName] : unknown;

export type FormLayout = 'horizontal' | 'inline' | 'vertical';

export type BaseFormComponentType =
  | 'DefaultButton'
  | 'PrimaryButton'
  | 'VbenCheckbox'
  | 'VbenFormFieldArray'
  | 'VbenInput'
  | 'VbenInputPassword'
  | 'VbenPinInput'
  | 'VbenSelect'
  | (Record<never, never> & string);

type Breakpoints = '2xl:' | '3xl:' | '' | 'lg:' | 'md:' | 'sm:' | 'xl:';

type GridCols = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;

export type WrapperClassType =
  | `${Breakpoints}grid-cols-${GridCols}`
  | (Record<never, never> & string);

export type FormItemClassType =
  | `${Breakpoints}cols-end-${'auto' | GridCols}`
  | `${Breakpoints}cols-span-${'auto' | 'full' | GridCols}`
  | `${Breakpoints}cols-start-${'auto' | GridCols}`
  | (Record<never, never> & string)
  | WrapperClassType;

export interface FormFieldOptions {
  asyncDebounceMs?: number;
  validateOn?: readonly FormValidationTrigger[];
}

export type FormValidationTrigger = 'blur' | 'change';

export interface FormShape {
  /** 默认值 */
  default?: any;
  /** 字段名 */
  fieldName: string;
  /** 是否必填 */
  required?: boolean;
  rules?: ZodType;
}

export interface FormRuntimeField<TValue = unknown> {
  handleBlur: () => void;
  handleChange: (value: TValue) => void;
  state: {
    meta: {
      errors: unknown[];
      isDirty: boolean;
      isTouched: boolean;
      isValid: boolean;
    };
    value: TValue;
  };
}

export interface FormComponentField<
  TValue = unknown,
  TFieldName extends string = string,
> {
  modelValue: TValue;
  name: TFieldName;
  onBlur: () => void;
  onChange: (value: TValue) => void;
  onInput: (value: TValue) => void;
  'onUpdate:modelValue': (value: TValue) => void;
}

export type MaybeComponentPropKey =
  | 'options'
  | 'placeholder'
  | 'title'
  | keyof HtmlHTMLAttributes
  | (Record<never, never> & string);

export type MaybeComponentProps = { [K in MaybeComponentPropKey]?: any };

export interface FormMeta {
  dirty: boolean;
  submitting: boolean;
  valid: boolean;
  validating: boolean;
}

export interface FormRuntimeState<TValues extends FormValues = FormValues> {
  errors: Record<string, string>;
  meta: FormMeta;
  values: TValues;
}

export interface FormValidationResult {
  errors: Record<string, string>;
  valid: boolean;
}

export interface FormValueSnapshot<
  TFormValues extends FormValues = FormValues,
  TSubmitValues extends FormValues = TFormValues,
> {
  rawValues: Readonly<TFormValues>;
  values: TSubmitValues;
}

export interface FormResetState<TValues extends FormValues = FormValues> {
  values?: Partial<TValues>;
}

export interface FormResetOptions {
  force?: boolean;
  keepDefaultValues?: boolean;
}

export interface FormContextApi<TValues extends FormValues = FormValues> {
  clearValidation: (
    fieldNames?: FormFieldName<TValues> | FormFieldName<TValues>[],
  ) => void;
  readonly errors: Record<string, string>;
  readonly fieldComponent: Component;
  getFieldError: (fieldName: string) => string | undefined;
  getFieldValue: <TFieldName extends FormFieldName<TValues>>(
    fieldName: TFieldName,
  ) => FormFieldValue<TValues, TFieldName>;
  handleSubmit: (
    callback?: (values: TValues) => Promise<void> | void,
  ) => (event?: Event) => Promise<void>;
  isFieldValid: (fieldName: string) => boolean;
  readonly meta: FormMeta;
  pushFieldValue: (fieldName: string, value: any) => void;
  removeFieldValue: (fieldName: string, index: number) => Promise<void>;
  reset: (
    state?: FormResetState<TValues>,
    options?: FormResetOptions,
  ) => Promise<void>;
  /** @deprecated Use `reset` instead. */
  resetForm: (
    state?: FormResetState<TValues>,
    options?: FormResetOptions,
  ) => Promise<void>;
  setFieldError: (fieldName: string, error?: string) => void;
  setFieldValue: <TFieldName extends FormFieldName<TValues>>(
    fieldName: TFieldName,
    value: FormFieldValue<TValues, NoInfer<TFieldName>>,
    shouldValidate?: boolean,
  ) => Promise<void>;
  setValues: (
    values: Partial<TValues>,
    shouldValidate?: boolean,
  ) => Promise<void>;
  submit: () => Promise<void>;
  /** @deprecated Use `submit` instead. */
  submitForm: () => Promise<void>;
  useFieldError: (fieldName: string) => Readonly<Ref<string | undefined>>;
  useFieldValue: <TFieldName extends FormFieldName<TValues>>(
    fieldName: TFieldName,
  ) => Readonly<Ref<FormFieldValue<TValues, TFieldName>>>;
  useFieldValues: <TFieldName extends FormFieldName<TValues>>(
    fieldNames: readonly TFieldName[],
  ) => Readonly<Ref<FormFieldValue<TValues, TFieldName>[]>>;
  useSelector: <T>(
    selector: (state: FormRuntimeState<TValues>) => T,
  ) => Readonly<Ref<T>>;
  useValues: () => Readonly<Ref<TValues>>;
  validate: () => Promise<FormValidationResult>;
  validateField: (fieldName: string) => Promise<FormValidationResult>;
  readonly values: TValues;
}

/** @deprecated Use `FormContextApi` instead. */
export type FormActions<TValues extends FormValues = FormValues> =
  FormContextApi<TValues>;

type ReservedFormSlotName =
  | 'default'
  | 'expand-after'
  | 'expand-before'
  | 'reset-before'
  | 'submit-before';

type KnownFormFieldName<TValues extends FormValues> =
  string extends Extract<keyof TValues, string>
    ? never
    : Exclude<Extract<keyof TValues, string>, ReservedFormSlotName>;

export interface VbenFormActionSlotProps<
  TValues extends FormValues = FormValues,
  T extends BaseFormComponentType = BaseFormComponentType,
  P extends Record<string, any> = Record<never, never>,
  TSubmitValues extends FormValues = TValues,
> {
  formApi: ExtendedFormApi<TValues, T, P, TSubmitValues>;
  values: TValues;
}

export interface VbenFormDefaultSlotProps<
  TValues extends FormValues = FormValues,
  T extends BaseFormComponentType = BaseFormComponentType,
  P extends Record<string, any> = Record<never, never>,
  TSubmitValues extends FormValues = TValues,
> extends VbenFormActionSlotProps<TValues, T, P, TSubmitValues> {
  shapes: FormShape[];
}

export interface VbenFormFieldSlotProps<
  TValues extends FormValues = FormValues,
  TFieldName extends KnownFormFieldName<TValues> = KnownFormFieldName<TValues>,
  T extends BaseFormComponentType = BaseFormComponentType,
  P extends Record<string, any> = Record<never, never>,
  TSubmitValues extends FormValues = TValues,
> extends VbenFormActionSlotProps<TValues, T, P, TSubmitValues> {
  componentField: FormComponentField<TValues[TFieldName], TFieldName>;
  disabled: boolean;
  field: FormRuntimeField<TValues[TFieldName]>;
  isInValid: boolean;
  modelValue: TValues[TFieldName];
  name: TFieldName;
}

type VbenFormFieldSlots<
  TValues extends FormValues,
  T extends BaseFormComponentType,
  P extends Record<string, any>,
  TSubmitValues extends FormValues,
> =
  string extends Extract<keyof TValues, string>
    ? Record<string, ((props: any) => any) | undefined>
    : {
        [TFieldName in KnownFormFieldName<TValues>]?: (
          props: VbenFormFieldSlotProps<
            TValues,
            TFieldName,
            T,
            P,
            TSubmitValues
          >,
        ) => any;
      };

export type VbenFormSlots<
  TValues extends FormValues = FormValues,
  T extends BaseFormComponentType = BaseFormComponentType,
  P extends Record<string, any> = Record<never, never>,
  TSubmitValues extends FormValues = TValues,
> = VbenFormFieldSlots<TValues, T, P, TSubmitValues> & {
  default?: (
    props: VbenFormDefaultSlotProps<TValues, T, P, TSubmitValues>,
  ) => any;
  'expand-after'?: (
    props: VbenFormActionSlotProps<TValues, T, P, TSubmitValues>,
  ) => any;
  'expand-before'?: (
    props: VbenFormActionSlotProps<TValues, T, P, TSubmitValues>,
  ) => any;
  'reset-before'?: (
    props: VbenFormActionSlotProps<TValues, T, P, TSubmitValues>,
  ) => any;
  'submit-before'?: (
    props: VbenFormActionSlotProps<TValues, T, P, TSubmitValues>,
  ) => any;
};

export type VbenFormComponent<
  TValues extends FormValues = FormValues,
  T extends BaseFormComponentType = BaseFormComponentType,
  P extends Record<string, any> = Record<never, never>,
  TSubmitValues extends FormValues = TValues,
> = new () => {
  $props: VbenFormProps<T, P, TValues, TSubmitValues>;
  $slots: VbenFormSlots<TValues, T, P, TSubmitValues>;
};

export interface FormSchemaContext<TValues extends FormValues = FormValues> {
  /** 数组字段名，例如 contacts */
  arrayField?: string;
  /** 当前真实字段名，例如 contacts[0].name */
  fieldName?: string;
  /** 原始 schema 字段名，例如 name */
  originalFieldName?: string;
  /** 表单完整值 */
  rootValues?: TValues;
  /** 当前行数据 */
  row?: Record<string, any>;
  /** 当前行索引 */
  rowIndex?: number;
  /** 当前行路径，例如 contacts[0] */
  rowPath?: string;
}

export type CustomRenderType = (() => Component | string) | string;

// 动态渲染参数
export type CustomParamsRenderType<TValues extends FormValues = FormValues> =
  | ((ctx: FormSchemaContext<TValues>) => Component | string)
  | string;

export type FormSchemaRuleType =
  | 'required'
  | 'selectRequired'
  | null
  | (Record<never, never> & string)
  | ZodType;

type FormItemDependenciesCondition<
  TValues extends FormValues,
  TResult = boolean | PromiseLike<boolean>,
> = (
  value: Partial<TValues>,
  actions: FormActions<TValues>,
  controller: ExtendedFormApi<TValues>, // 在 dependencies 里提供访问extendApi的能力
  ctx?: FormSchemaContext<TValues>,
) => TResult;

type FormItemDependenciesConditionWithRules<TValues extends FormValues> = (
  value: Partial<TValues>,
  actions: FormActions<TValues>,
  controller: ExtendedFormApi<TValues>, // 在 dependencies 里提供访问extendApi的能力
  ctx?: FormSchemaContext<TValues>,
) => FormSchemaRuleType | PromiseLike<FormSchemaRuleType>;

type FormItemDependenciesConditionWithProps<TValues extends FormValues> = (
  value: Partial<TValues>,
  actions: FormActions<TValues>,
  controller: ExtendedFormApi<TValues>, // 在 dependencies 里提供访问extendApi的能力
  ctx?: FormSchemaContext<TValues>,
) => MaybeComponentProps | PromiseLike<MaybeComponentProps>;

interface FormItemDependenciesBase {
  /**
   * 触发字段
   */
  triggerFields: string[];
}

export interface FormDependenciesResolveContext<
  TValues extends FormValues = FormValues,
> {
  actions: FormActions<TValues>;
  controller: ExtendedFormApi<TValues>;
  schema: FormSchemaContext<TValues>;
  values: Readonly<TValues>;
}

export interface FormDependenciesResolvedState {
  componentProps?: MaybeComponentProps;
  disabled?: boolean;
  help?: CustomRenderType;
  if?: boolean;
  renderComponentContent?: Record<string, any>;
  required?: boolean;
  rules?: FormSchemaRuleType;
  show?: boolean;
}

export interface FormItemDependenciesLegacy<
  TValues extends FormValues = FormValues,
> extends FormItemDependenciesBase {
  /**
   * 组件参数
   * @returns 组件参数
   * @deprecated Use `dependencies.resolve` instead.
   */
  componentProps?: FormItemDependenciesConditionWithProps<TValues>;
  /**
   * 是否禁用
   * @returns 是否禁用
   * @deprecated Use `dependencies.resolve` instead.
   */
  disabled?: boolean | FormItemDependenciesCondition<TValues>;
  /**
   * 是否渲染（删除dom）
   * @returns 是否渲染
   * @deprecated Use `dependencies.resolve` instead.
   */
  if?: boolean | FormItemDependenciesCondition<TValues>;
  /**
   * 是否必填
   * @returns 是否必填
   * @deprecated Use `dependencies.resolve` instead.
   */
  required?: FormItemDependenciesCondition<TValues>;
  resolve?: never;
  /**
   * 字段规则
   * @deprecated Use `dependencies.resolve` instead.
   */
  rules?: FormItemDependenciesConditionWithRules<TValues>;
  /**
   * 是否隐藏(Css)
   * @returns 是否隐藏
   * @deprecated Use `dependencies.resolve` instead.
   */
  show?: boolean | FormItemDependenciesCondition<TValues>;
  /**
   * 任意触发都会执行
   * @deprecated Use `dependencies.resolve` instead.
   */
  trigger?: FormItemDependenciesCondition<TValues, void>;
}

export interface FormItemDependenciesResolve<
  TValues extends FormValues = FormValues,
> extends FormItemDependenciesBase {
  componentProps?: never;
  disabled?: never;
  if?: never;
  required?: never;
  resolve: (
    context: FormDependenciesResolveContext<TValues>,
  ) =>
    | FormDependenciesResolvedState
    | PromiseLike<FormDependenciesResolvedState | undefined>
    | undefined;
  rules?: never;
  show?: never;
  trigger?: never;
}

export type FormItemDependencies<TValues extends FormValues = FormValues> =
  | FormItemDependenciesLegacy<TValues>
  | FormItemDependenciesResolve<TValues>;

type ComponentProps<TValues extends FormValues = FormValues> =
  | ((ctx: FormSchemaContext<TValues>) => MaybeComponentProps)
  | MaybeComponentProps;

export interface FormCommonConfig<TValues extends FormValues = FormValues> {
  /**
   * 是否启用 change 事件兼容回退。
   * 仅当组件不发送 update:*、只发送 change 时启用。
   * @default false
   */
  changeEventFallback?: boolean;
  /**
   * 是否可折叠的
   * @default false
   */
  collapsible?: boolean;
  /**
   * 在Label后显示一个冒号
   */
  colon?: boolean;
  /**
   * 所有表单项的props
   */
  componentProps?: ComponentProps<TValues>;
  /**
   * 所有表单项的控件样式
   */
  controlClass?: string;
  /**
   * 默认折叠
   * @default false
   */
  defaultCollapsed?: boolean;
  /**
   * 所有表单项的禁用状态
   * @default false
   */
  disabled?: boolean;
  /**
   * 所有表单项的空状态值,默认都是undefined，naive-ui的空状态值是null
   */
  emptyStateValue?: null | undefined;
  /**
   * 所有表单项的控件样式
   * @default {}
   */
  formFieldProps?: FormFieldOptions;
  /**
   * 所有表单项的栅格布局，支持函数形式
   * @default ""
   */
  formItemClass?: (() => string) | string;
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
   * @default ""
   */
  labelClass?: string;
  /**
   * 所有表单项的label宽度
   */
  labelWidth?: number;
  /**
   * 所有表单项的model属性名
   * @default "modelValue"
   */
  modelPropName?: string;
  /**
   * 所有表单项的wrapper样式
   */
  wrapperClass?: string;
}

type RenderComponentContentType<TValues extends FormValues = FormValues> = (
  ctx: FormSchemaContext<TValues>,
) => Record<string, any>;

type MappedComponentProps<P, TValues extends FormValues = FormValues> =
  | ((ctx: FormSchemaContext<TValues>) => P & Record<string, any>)
  | (P & Record<string, any>);

/**
 * 格式化 `getValues()` 输出中的当前字段值。
 * - 返回 `undefined`：保留当前字段已被移除的状态，通常配合 `setValue(key, nextValue)`
 *   把一个字段拆分写入到其他字段，例如 `startTime` / `endTime`
 * - 返回其他值：会将当前字段恢复/写回为该返回值
 * - `setValue` 回调签名为 `(key, nextValue) => void`
 * @deprecated Use the form-level `codec` instead.
 */
export type FormValueFormat<TValues extends FormValues = FormValues> = (
  value: any,
  setValue: (fieldName: string, value: any) => void,
  values: TValues,
  ctx?: FormSchemaContext<TValues>,
) => any;

interface FormSchemaBody<TValues extends FormValues = FormValues> extends Omit<
  FormCommonConfig<TValues>,
  'componentProps'
> {
  /** 默认值 */
  defaultValue?: any;
  /** 依赖 */
  dependencies?: FormItemDependencies<TValues>;
  /** 描述 */
  description?: CustomRenderType;
  /** 字段名 */
  fieldName: string;
  /** 帮助信息 */
  help?: CustomParamsRenderType<TValues>;
  /** 是否隐藏表单项 */
  hide?: boolean;
  /** 表单项 */
  label?: CustomRenderType;
  // 自定义组件内部渲染
  renderComponentContent?: RenderComponentContentType<TValues>;
  /** 字段规则 */
  rules?: FormSchemaRuleType;
  /** 后缀 */
  suffix?: CustomRenderType;
  /**
   * 获取表单值时格式化当前字段。
   * - 返回值不为 `undefined` 时，会回写到当前 fieldName
   * - 返回值为 `undefined` 时，可通过 setValue 写入一个或多个目标字段
   * @deprecated Use the form-level `codec` instead.
   */
  valueFormat?: FormValueFormat<TValues>;
}

type FormSchemaDiscriminated<
  T extends BaseFormComponentType,
  P extends Record<string, any>,
  TValues extends FormValues,
> = {
  [K in Extract<keyof P, T>]: {
    /** 组件 */
    component: K;
    /** 组件参数 */
    componentProps?: MappedComponentProps<P[K], TValues>;
  } & FormSchemaBody<TValues>;
}[Extract<keyof P, T>];

type FormSchemaFallback<
  T extends BaseFormComponentType,
  TValues extends FormValues,
> = {
  /** 组件 */
  component: Component | T;
  /** 组件参数 */
  componentProps?: ComponentProps<TValues>;
} & FormSchemaBody<TValues>;

type FormArraySchema<
  T extends BaseFormComponentType,
  P extends Record<string, any>,
  TValues extends FormValues,
> = {
  /** 内置数组编辑器参数 */
  arrayProps?: Omit<
    VbenFormFieldArrayProps<T, P, TValues>,
    'disabled' | 'globalCommonConfig' | 'name' | 'schema'
  >;
  /** 数组子字段定义 */
  children: FormSchema<T, P, TValues>[];
  /** 兼容显式指定内置数组编辑器 */
  component?: Component | T;
  /** 兼容通过 componentProps 传递数组编辑器参数 */
  componentProps?: ComponentProps<TValues>;
  /** 数组字段标记 */
  type: 'array';
} & FormSchemaBody<TValues>;

export type FormSchema<
  T extends BaseFormComponentType = BaseFormComponentType,
  P extends Record<string, any> = Record<never, never>,
  TValues extends FormValues = FormValues,
> =
  | FormArraySchema<T, P, TValues>
  | FormSchemaDiscriminated<T, P, TValues>
  | FormSchemaFallback<T, TValues>;

/**
 * 数组编辑器（VbenFormFieldArray）的组件参数
 */
export interface VbenFormFieldArrayProps<
  T extends BaseFormComponentType = BaseFormComponentType,
  P extends Record<string, any> = Record<never, never>,
  TValues extends FormValues = FormValues,
> {
  /** 操作列表头文案 */
  actionText?: string;
  /** 「添加」按钮文案 */
  addButtonText?: string;
  /** 子字段通用配置 */
  commonConfig?: FormCommonConfig<TValues>;
  /** 新增一行时生成的默认数据；缺省时按列定义的 fieldName 生成空对象 */
  createRow?: () => Record<string, any>;
  disabled?: boolean;
  /** 空数据文案 */
  emptyText?: string;
  /** 子字段全局通用配置 */
  globalCommonConfig?: FormCommonConfig<TValues>;
  /** 最多行数 */
  max?: number;
  /** 最少行数 */
  min?: number;
  /** 数组字段路径，由外层 FormField 透传 */
  name?: string;
  /** 列定义，每一列是一个子字段（复用 FormSchema） */
  schema?: FormSchema<T, P, TValues>[];
  /** 是否显示序号列 */
  showIndex?: boolean;
}

export type HandleSubmitFn<
  TFormValues extends FormValues = FormValues,
  TSubmitValues extends FormValues = TFormValues,
> = (
  values: NoInfer<TSubmitValues>,
  rawValues: Readonly<TFormValues>,
) => Promise<void> | void;

export type HandleResetFn<TSubmitValues extends FormValues = FormValues> = (
  values: TSubmitValues,
) => Promise<void> | void;

/** @deprecated Use the form-level `codec` instead. */
export type FieldMappingTimeItem = [
  string,
  [string, string],
  (
    | ((value: any, fieldName: string) => any)
    | [string, string]
    | null
    | string
  )?,
];

/** @deprecated Use the form-level `codec` instead. */
export type FieldMappingTime = FieldMappingTimeItem[];

/** @deprecated Use the form-level `codec` instead. */
export type ArrayToStringFields = Array<
  | [string[], string?] // 嵌套数组格式，可选分隔符
  | string // 单个字段，使用默认分隔符
  | string[] // 简单数组格式，最后一个元素可以是分隔符
>;

export interface FormFieldProps<
  T extends BaseFormComponentType = BaseFormComponentType,
  TValues extends FormValues = FormValues,
> extends FormSchemaBody<TValues> {
  /** 组件 */
  component: Component | T;
  /** 组件参数 */
  componentProps?: ComponentProps<TValues>;
}

export interface FormRenderProps<
  T extends BaseFormComponentType = BaseFormComponentType,
  P extends Record<string, any> = Record<never, never>,
  TValues extends FormValues = FormValues,
> {
  /**
   * 表单字段数组映射字符串配置 默认使用","
   * @deprecated Use the form-level `codec` instead.
   */
  arrayToStringFields?: ArrayToStringFields;
  /**
   * 是否折叠，在showCollapseButton=true下生效
   * true:折叠 false:展开
   */
  collapsed?: boolean;
  /**
   * 折叠时保持行数
   * @default 1
   */
  collapsedRows?: number;
  /**
   * 是否触发resize事件
   * @default false
   */
  collapseTriggerResize?: boolean;
  /**
   * 表单项通用后备配置，当子项目没配置时使用这里的配置，子项目配置优先级高于此配置
   */
  commonConfig?: FormCommonConfig<TValues>;
  /**
   * 紧凑模式（移除表单每一项底部为校验信息预留的空间）
   */
  compact?: boolean;
  /**
   * 组件v-model事件绑定
   */
  componentBindEventMap?: Partial<Record<BaseFormComponentType, string>>;
  /**
   * 组件集合
   */
  componentMap: Record<BaseFormComponentType, Component>;
  /**
   * 表单字段映射到时间格式
   * @deprecated Use the form-level `codec` instead.
   */
  fieldMappingTime?: FieldMappingTime;
  /**
   * 表单实例
   */
  form?: FormActions<TValues>;
  /**
   * 表单项布局
   */
  layout?: FormLayout;
  /**
   * 表单定义
   */
  schema?: FormSchema<T, P, TValues>[];

  /**
   * 是否显示展开/折叠
   */
  showCollapseButton?: boolean;
  /**
   * 格式化日期
   */

  /**
   * 表单栅格布局
   * @default "grid-cols-1"
   */
  wrapperClass?: WrapperClassType;
}

export interface ActionButtonOptions extends VbenButtonProps {
  [key: string]: any;
  content?: MaybeComputedRef<string>;
  show?: boolean;
}

export interface VbenFormProps<
  T extends BaseFormComponentType = BaseFormComponentType,
  P extends Record<string, any> = Record<never, never>,
  TValues extends FormValues = FormValues,
  TSubmitValues extends FormValues = TValues,
> extends Omit<
  FormRenderProps<T, P, TValues>,
  'componentBindEventMap' | 'componentMap' | 'form'
> {
  /**
   * 操作按钮是否反转（提交按钮前置）
   */
  actionButtonsReverse?: boolean;
  /**
   * 操作按钮组的样式
   * newLine: 在新行显示。rowEnd: 在行内显示，靠右对齐（默认）。inline: 使用grid默认样式
   */
  actionLayout?: 'inline' | 'newLine' | 'rowEnd';
  /**
   * 操作按钮组显示位置，默认靠右显示
   */
  actionPosition?: 'center' | 'left' | 'right';
  /**
   * 表单操作区域class
   */
  actionWrapperClass?: ClassType;
  /**
   * 表单字段数组映射字符串配置 默认使用","
   * @deprecated Use the form-level `codec` instead.
   */
  arrayToStringFields?: ArrayToStringFields;

  /**
   * submitOnChange改变时防抖时间 | 默认300ms
   */
  changeDebouncedTime?: number;
  /** 表单组件值与提交值之间的双向编解码器。 */
  codec?: FormCodec<TValues, TSubmitValues>;
  /**
   * 表单字段映射
   * @deprecated Use the form-level `codec` instead.
   */
  fieldMappingTime?: FieldMappingTime;
  /**
   * 表单收起展开状态变化回调
   */
  handleCollapsedChange?: (collapsed: boolean) => void;
  /**
   * 表单重置回调
   */
  handleReset?: HandleResetFn<NoInfer<TSubmitValues>>;
  /**
   * 表单提交回调
   */
  handleSubmit?: HandleSubmitFn<TValues, TSubmitValues>;
  /**
   * 表单值变化回调
   */
  handleValuesChange?: (
    values: Readonly<TValues>,
    fieldsChanged: string[],
    getFormattedValues: () => TSubmitValues,
  ) => void;

  /**
   * 重置按钮参数
   */
  resetButtonOptions?: ActionButtonOptions;

  /**
   * 验证失败时是否自动滚动到第一个错误字段
   * @default false
   */
  scrollToFirstError?: boolean;

  /**
   * 是否显示默认操作按钮
   * @default true
   */
  showDefaultActions?: boolean;

  /**
   * 提交按钮参数
   */
  submitButtonOptions?: ActionButtonOptions;

  /**
   * 是否在字段值改变时提交表单
   * @default false
   */
  submitOnChange?: boolean;

  /**
   * 是否在回车时提交表单
   * @default false
   */
  submitOnEnter?: boolean;
}

export type ExtendedFormApi<
  TValues extends FormValues = FormValues,
  T extends BaseFormComponentType = BaseFormComponentType,
  P extends Record<string, any> = Record<never, never>,
  TSubmitValues extends FormValues = TValues,
> = FormApi<TValues, T, P, TSubmitValues> & {
  useStore: <TResult = NoInfer<VbenFormProps<T, P, TValues, TSubmitValues>>>(
    selector?: (
      state: NoInfer<VbenFormProps<T, P, TValues, TSubmitValues>>,
    ) => TResult,
  ) => Readonly<Ref<TResult>>;
};

export interface VbenFormAdapterOptions<
  T extends BaseFormComponentType = BaseFormComponentType,
> {
  config?: {
    baseModelPropName?: string;
    /**
     * 是否启用 change 事件兼容回退。
     * 仅用于只发送 change 的兼容组件。
     * @default false
     */
    changeEventFallback?: boolean;
    emptyStateValue?: null | undefined;
    modelPropNameMap?: Partial<Record<T, string>>;
  };
  /** @deprecated Use `rules` instead. */
  defineRules?: Partial<Record<string, FormRuleValidator>>;
  rules?: Partial<Record<string, FormRuleValidator>>;
}

export interface FormRuleContext {
  field: {
    label?: string;
    name: string;
  };
  label?: string;
  name: string;
}

export type FormRuleValidator = (
  value: any,
  params: any,
  context: FormRuleContext,
) => boolean | Promise<boolean | string> | string;
