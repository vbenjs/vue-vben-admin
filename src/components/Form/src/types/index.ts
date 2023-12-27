import type { Component, VNodeProps } from 'vue';

type ColSpanType = number | string;
export interface ColEx {
  style?: any;
  /**
   * raster number of cells to occupy, 0 corresponds to display: none
   * @default none (0)
   * @type ColSpanType
   */
  span?: ColSpanType;

  /**
   * raster order, used in flex layout mode
   * @default 0
   * @type ColSpanType
   */
  order?: ColSpanType;

  /**
   * the layout fill of flex
   * @default none
   * @type ColSpanType
   */
  flex?: ColSpanType;

  /**
   * the number of cells to offset Col from the left
   * @default 0
   * @type ColSpanType
   */
  offset?: ColSpanType;

  /**
   * the number of cells that raster is moved to the right
   * @default 0
   * @type ColSpanType
   */
  push?: ColSpanType;

  /**
   * the number of cells that raster is moved to the left
   * @default 0
   * @type ColSpanType
   */
  pull?: ColSpanType;

  /**
   * <576px and also default setting, could be a span value or an object containing above props
   * @type { span: ColSpanType, offset: ColSpanType } | ColSpanType
   */
  xs?: { span: ColSpanType; offset: ColSpanType } | ColSpanType;

  /**
   * ≥576px, could be a span value or an object containing above props
   * @type { span: ColSpanType, offset: ColSpanType } | ColSpanType
   */
  sm?: { span: ColSpanType; offset: ColSpanType } | ColSpanType;

  /**
   * ≥768px, could be a span value or an object containing above props
   * @type { span: ColSpanType, offset: ColSpanType } | ColSpanType
   */
  md?: { span: ColSpanType; offset: ColSpanType } | ColSpanType;

  /**
   * ≥992px, could be a span value or an object containing above props
   * @type { span: ColSpanType, offset: ColSpanType } | ColSpanType
   */
  lg?: { span: ColSpanType; offset: ColSpanType } | ColSpanType;

  /**
   * ≥1200px, could be a span value or an object containing above props
   * @type { span: ColSpanType, offset: ColSpanType } | ColSpanType
   */
  xl?: { span: ColSpanType; offset: ColSpanType } | ColSpanType;

  /**
   * ≥1600px, could be a span value or an object containing above props
   * @type { span: ColSpanType, offset: ColSpanType } | ColSpanType
   */
  xxl?: { span: ColSpanType; offset: ColSpanType } | ColSpanType;
}

export type ComponentType = keyof ComponentProps;

type MethodsNameToCamelCase<
  T extends string,
  M extends string = '',
> = T extends `${infer F}-${infer N}${infer Tail}`
  ? MethodsNameToCamelCase<Tail, `${M}${F}${Uppercase<N>}`>
  : `${M}${T}`;

type MethodsNameTransform<T> = {
  [K in keyof T as K extends `on${string}` ? MethodsNameToCamelCase<K> : never]: T[K];
};

type ExtractPropTypes<T extends Component> = T extends new (...args: any) => any
  ? Omit<InstanceType<T>['$props'], keyof VNodeProps>
  : never;

interface _CustomComponents {
  ApiSelect: ExtractPropTypes<(typeof import('../components/ApiSelect.vue'))['default']>;
  ApiTree: ExtractPropTypes<(typeof import('../components/ApiTree.vue'))['default']>;
  ApiTreeSelect: ExtractPropTypes<(typeof import('../components/ApiTreeSelect.vue'))['default']>;
  ApiRadioGroup: ExtractPropTypes<(typeof import('../components/ApiRadioGroup.vue'))['default']>;
  RadioButtonGroup: ExtractPropTypes<
    (typeof import('../components/RadioButtonGroup.vue'))['default']
  >;
  ApiCascader: ExtractPropTypes<(typeof import('../components/ApiCascader.vue'))['default']>;
  StrengthMeter: ExtractPropTypes<
    (typeof import('@/components/StrengthMeter/src/StrengthMeter.vue'))['default']
  >;
  Upload: ExtractPropTypes<(typeof import('@/components/Upload/src/BasicUpload.vue'))['default']>;
  ImageUpload: ExtractPropTypes<
    (typeof import('@/components/Upload/src/components/ImageUpload.vue'))['default']
  >;
  IconPicker: ExtractPropTypes<(typeof import('@/components/Icon/src/IconPicker.vue'))['default']>;
  ApiTransfer: ExtractPropTypes<(typeof import('../components/ApiTransfer.vue'))['default']>;
  CropperAvatar: ExtractPropTypes<
    (typeof import('@/components/Cropper/src/CropperAvatar.vue'))['default']
  >;
  BasicTitle: ExtractPropTypes<(typeof import('@/components/Basic/src/BasicTitle.vue'))['default']>;
  InputCountDown: ExtractPropTypes<
    (typeof import('@/components/CountDown/src/CountdownInput.vue'))['default']
  >;
}

type CustomComponents<T = _CustomComponents> = {
  [K in keyof T]: T[K] & MethodsNameTransform<T[K]>;
};

export interface ComponentProps {
  Input: ExtractPropTypes<(typeof import('ant-design-vue/es/input'))['default']>;
  InputGroup: ExtractPropTypes<(typeof import('ant-design-vue/es/input'))['InputGroup']>;
  InputPassword: ExtractPropTypes<(typeof import('ant-design-vue/es/input'))['InputPassword']>;
  InputSearch: ExtractPropTypes<(typeof import('ant-design-vue/es/input'))['InputSearch']>;
  InputTextArea: ExtractPropTypes<(typeof import('ant-design-vue/es/input'))['Textarea']>;
  InputNumber: ExtractPropTypes<(typeof import('ant-design-vue/es/input-number'))['default']>;
  InputCountDown: CustomComponents['InputCountDown'] & ComponentProps['Input'];
  Select: ExtractPropTypes<(typeof import('ant-design-vue/es/select'))['default']>;
  ApiSelect: CustomComponents['ApiSelect'] & ComponentProps['Select'];
  TreeSelect: ExtractPropTypes<(typeof import('ant-design-vue/es/tree-select'))['default']>;
  ApiTree: CustomComponents['ApiTree'] &
    ExtractPropTypes<(typeof import('ant-design-vue/es/tree'))['default']>;
  ApiTreeSelect: CustomComponents['ApiTreeSelect'] & ComponentProps['TreeSelect'];
  ApiRadioGroup: CustomComponents['ApiRadioGroup'] & ComponentProps['RadioGroup'];
  RadioButtonGroup: CustomComponents['RadioButtonGroup'] & ComponentProps['RadioGroup'];
  RadioGroup: ExtractPropTypes<(typeof import('ant-design-vue/es/radio'))['RadioGroup']>;
  Checkbox: ExtractPropTypes<(typeof import('ant-design-vue/es/checkbox'))['default']>;
  CheckboxGroup: ExtractPropTypes<(typeof import('ant-design-vue/es/checkbox'))['CheckboxGroup']>;
  AutoComplete: ExtractPropTypes<(typeof import('ant-design-vue/es/auto-complete'))['default']>;
  ApiCascader: CustomComponents['ApiCascader'] & ComponentProps['Cascader'];
  Cascader: ExtractPropTypes<(typeof import('ant-design-vue/es/cascader'))['default']>;
  DatePicker: ExtractPropTypes<(typeof import('ant-design-vue/es/date-picker'))['default']>;
  MonthPicker: ExtractPropTypes<(typeof import('ant-design-vue/es/date-picker'))['MonthPicker']>;
  RangePicker: ExtractPropTypes<(typeof import('ant-design-vue/es/date-picker'))['RangePicker']>;
  WeekPicker: ExtractPropTypes<(typeof import('ant-design-vue/es/date-picker'))['WeekPicker']>;
  TimePicker: ExtractPropTypes<(typeof import('ant-design-vue/es/time-picker'))['TimePicker']>;
  TimeRangePicker: ExtractPropTypes<
    (typeof import('ant-design-vue/es/time-picker'))['TimeRangePicker']
  >;
  Switch: ExtractPropTypes<(typeof import('ant-design-vue/es/switch'))['default']>;
  StrengthMeter: CustomComponents['StrengthMeter'] & ComponentProps['InputPassword'];
  Upload: CustomComponents['Upload'];
  ImageUpload: CustomComponents['ImageUpload'];
  IconPicker: CustomComponents['IconPicker'];
  Render: Record<string, any>;
  Slider: ExtractPropTypes<(typeof import('ant-design-vue/es/slider'))['default']>;
  Rate: ExtractPropTypes<(typeof import('ant-design-vue/es/rate'))['default']>;
  Divider: ExtractPropTypes<(typeof import('ant-design-vue/es/divider'))['default']>;
  ApiTransfer: CustomComponents['ApiTransfer'] & ComponentProps['Transfer'];
  Transfer: ExtractPropTypes<(typeof import('ant-design-vue/es/transfer'))['default']>;
  CropperAvatar: CustomComponents['CropperAvatar'];
  BasicTitle: CustomComponents['BasicTitle'];
}
