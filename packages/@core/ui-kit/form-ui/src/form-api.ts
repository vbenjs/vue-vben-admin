import type { ComponentPublicInstance } from 'vue';

import type {
  BaseFormComponentType,
  FormActions,
  FormFieldName,
  FormFieldValue,
  FormResetOptions,
  FormResetState,
  FormSchema,
  FormValues,
  FormValueSnapshot,
  VbenFormProps,
} from './types';

import { isRef, toRaw } from 'vue';

import { Store } from '@vben-core/shared/store';
import {
  bindMethods,
  cloneDeep,
  isDate,
  isDayjsObject,
  isFunction,
  isObject,
  mergeWithArrayOverride,
  StateHandler,
} from '@vben-core/shared/utils';

import { warnDeprecatedOnce } from './deprecation';
import { resolveFieldNamePath } from './field-name';
import { decodeFormValues, encodeFormValues } from './form-codec';
import { updateFormSchemaList } from './form-render/schema';
import { formatFormValues } from './form-value-transform';

type FormApiProps<
  TFormValues extends FormValues,
  T extends BaseFormComponentType,
  P extends Record<string, any>,
  TSubmitValues extends FormValues,
> = VbenFormProps<T, P, TFormValues, TSubmitValues>;

type FormApiSchema<
  TValues extends FormValues,
  T extends BaseFormComponentType,
  P extends Record<string, any>,
> = FormSchema<T, P, TValues>;

function getDefaultState<
  TFormValues extends FormValues,
  T extends BaseFormComponentType,
  P extends Record<string, any>,
  TSubmitValues extends FormValues,
>(): FormApiProps<TFormValues, T, P, TSubmitValues> {
  return {
    actionWrapperClass: '',
    collapsed: false,
    collapsedRows: 1,
    collapseTriggerResize: false,
    commonConfig: {},
    handleReset: undefined,
    handleSubmit: undefined,
    handleValuesChange: undefined,
    handleCollapsedChange: undefined,
    layout: 'horizontal',
    resetButtonOptions: {},
    schema: [],
    scrollToFirstError: false,
    showCollapseButton: false,
    showDefaultActions: true,
    submitButtonOptions: {},
    submitOnChange: false,
    submitOnEnter: false,
    wrapperClass: 'grid-cols-1',
  };
}

export class FormApi<
  TFormValues extends FormValues = FormValues,
  T extends BaseFormComponentType = BaseFormComponentType,
  P extends Record<string, any> = Record<never, never>,
  TSubmitValues extends FormValues = TFormValues,
> {
  // private api: Pick<VbenFormProps, 'handleReset' | 'handleSubmit'>;
  public form = {} as FormActions<TFormValues>;
  isMounted = false;

  public state: FormApiProps<TFormValues, T, P, TSubmitValues> | null = null;
  stateHandler: StateHandler;

  public store: Store<FormApiProps<TFormValues, T, P, TSubmitValues>>;

  /**
   * 组件实例映射
   */
  private componentRefMap: Map<string, unknown> = new Map();

  // 最后一次点击提交时的表单值
  private latestSubmissionValues: null | Partial<TSubmitValues> = null;

  private legacyTransformWarningState: null | Pick<
    FormApiProps<TFormValues, T, P, TSubmitValues>,
    'arrayToStringFields' | 'codec' | 'fieldMappingTime' | 'schema'
  > = null;

  private prevState: FormApiProps<TFormValues, T, P, TSubmitValues> | null =
    null;

  constructor(options: FormApiProps<TFormValues, T, P, TSubmitValues> = {}) {
    const { ...storeState } = options;

    const defaultState = getDefaultState<TFormValues, T, P, TSubmitValues>();

    this.store = new Store<FormApiProps<TFormValues, T, P, TSubmitValues>>({
      ...defaultState,
      ...storeState,
    });

    this.store.subscribe((state) => {
      this.prevState = this.state;
      this.state = state;
      this.updateState();
    });

    this.state = this.store.state;
    this.stateHandler = new StateHandler();
    bindMethods(this);
  }

  async clearValidation(
    fieldNames?: FormFieldName<TFormValues> | FormFieldName<TFormValues>[],
  ) {
    const form = await this.getForm();
    form.clearValidation(fieldNames);
  }

  formatValues(rawValues: Readonly<TFormValues>): TSubmitValues;
  /** @deprecated Declare the submit type on `useVbenForm` instead. */
  formatValues<TResult extends FormValues>(
    rawValues: Readonly<FormValues>,
  ): TResult;
  formatValues(rawValues: Readonly<FormValues>): FormValues {
    this.warnLegacyValueTransforms();
    if (this.state?.codec) {
      return encodeFormValues(
        this.state.codec,
        cloneDeep(toRaw(rawValues)) as Readonly<TFormValues>,
      );
    }
    return formatFormValues(
      toRaw(rawValues),
      this.state?.schema ?? [],
      this.state?.fieldMappingTime,
      this.state?.arrayToStringFields,
    );
  }

  /**
   * 获取字段组件实例
   * @param fieldName 字段名
   * @returns 组件实例
   */
  getFieldComponentRef<T = ComponentPublicInstance>(
    fieldName: string,
  ): T | undefined {
    let target = this.componentRefMap.has(fieldName)
      ? (this.componentRefMap.get(fieldName) as ComponentPublicInstance)
      : undefined;
    if (
      target &&
      target.$.type.name === 'AsyncComponentWrapper' &&
      target.$.subTree.ref
    ) {
      if (Array.isArray(target.$.subTree.ref)) {
        if (
          target.$.subTree.ref.length > 0 &&
          isRef(target.$.subTree.ref[0]?.r)
        ) {
          target = target.$.subTree.ref[0]?.r.value as ComponentPublicInstance;
        }
      } else if (isRef(target.$.subTree.ref.r)) {
        target = target.$.subTree.ref.r.value as ComponentPublicInstance;
      }
    }
    return target as T;
  }

  /**
   * 获取当前聚焦的字段，如果没有聚焦的字段则返回undefined
   */
  getFocusedField() {
    for (const fieldName of this.componentRefMap.keys()) {
      const ref = this.getFieldComponentRef(fieldName);
      if (ref) {
        let el: HTMLElement | null = null;
        if (ref instanceof HTMLElement) {
          el = ref;
        } else if (ref.$el instanceof HTMLElement) {
          el = ref.$el;
        }
        if (!el) {
          continue;
        }
        if (
          el === document.activeElement ||
          el.contains(document.activeElement)
        ) {
          return fieldName;
        }
      }
    }
    return undefined;
  }

  getLatestSubmissionValues() {
    return this.latestSubmissionValues || {};
  }

  async getRawValues(): Promise<TFormValues>;
  /** @deprecated Declare the form value type on `useVbenForm` instead. */
  async getRawValues<TResult extends FormValues>(): Promise<TResult>;
  async getRawValues(): Promise<FormValues> {
    const form = await this.getForm();
    return cloneDeep(toRaw(form.values ?? {}));
  }

  getState() {
    return this.state;
  }

  async getValues(): Promise<TSubmitValues>;
  /** @deprecated Declare the submit type on `useVbenForm` instead. */
  async getValues<TResult extends FormValues>(): Promise<TResult>;
  async getValues(): Promise<FormValues> {
    const form = await this.getForm();
    return this.formatValues(toRaw(form.values ?? {}));
  }

  async getValueSnapshot(): Promise<
    FormValueSnapshot<TFormValues, TSubmitValues>
  >;
  /** @deprecated Declare form and submit value types on `useVbenForm`. */
  async getValueSnapshot<TResult extends FormValues>(): Promise<
    FormValueSnapshot<TResult>
  >;
  async getValueSnapshot(): Promise<FormValueSnapshot> {
    const rawValues = await this.getRawValues();
    return {
      rawValues,
      values: this.formatValues(rawValues),
    };
  }

  async isFieldValid(fieldName: FormFieldName<TFormValues>) {
    const form = await this.getForm();
    return form.isFieldValid(fieldName);
  }

  merge(formApi: FormApi<any, any, any, any>) {
    const chain = [this, formApi];
    const proxy = new Proxy(formApi, {
      get(target: any, prop: any) {
        if (prop === 'merge') {
          return (nextFormApi: FormApi<any, any, any, any>) => {
            chain.push(nextFormApi);
            return proxy;
          };
        }
        if (prop === 'submitAllForm') {
          return async (needMerge: boolean = true) => {
            try {
              const results = await Promise.all(
                chain.map(async (api) => {
                  const validateResult = await api.validate();
                  if (!validateResult.valid) {
                    return;
                  }
                  const rawValues = toRaw((await api.getValues()) || {});
                  return rawValues;
                }),
              );
              if (needMerge) {
                const mergedResults = Object.assign({}, ...results);
                return mergedResults;
              }
              return results;
            } catch (error) {
              console.error('Validation error:', error);
            }
          };
        }
        return target[prop];
      },
    });

    return proxy;
  }

  mount(
    formActions: FormActions<TFormValues>,
    componentRefMap?: Map<string, unknown>,
  ) {
    if (!this.isMounted) {
      this.form = formActions;
      this.stateHandler.setConditionTrue();
      let initialValues: FormValues = {};
      if (this.form.values) {
        const rawInitialValues = toRaw(this.form.values);
        try {
          initialValues = this.formatValues(rawInitialValues);
        } catch (error) {
          if (!this.state?.codec) {
            throw error;
          }
          console.warn(
            '[Vben Form] Failed to encode initial values. Falling back to raw form values.',
            error,
          );
          initialValues = cloneDeep(rawInitialValues);
        }
      }
      this.setLatestSubmissionValues(initialValues as Partial<TSubmitValues>);
      this.componentRefMap =
        componentRefMap ?? this.componentRefMap ?? new Map();
      this.isMounted = true;
    }
  }

  /**
   * 根据字段名移除表单项
   * @param fields
   */
  async removeSchemaByFields(fields: string[]) {
    const fieldSet = new Set(fields);
    const schema = this.state?.schema ?? [];

    const filterSchema = schema.filter((item) => !fieldSet.has(item.fieldName));

    this.setState({
      schema: filterSchema,
    });
  }

  /**
   * 重置表单
   */
  async reset(state?: FormResetState<TFormValues>, opts?: FormResetOptions) {
    const form = await this.getForm();
    return form.reset(state, opts);
  }

  /** @deprecated Use `reset` instead. */
  async resetForm(
    state?: FormResetState<TFormValues>,
    opts?: FormResetOptions,
  ) {
    warnDeprecatedOnce(
      'form-api-reset-form',
      '[Vben Form] `formApi.resetForm()` is deprecated. Use `formApi.reset()` instead.',
    );
    return this.reset(state, opts);
  }

  /** @deprecated Use `clearValidation` instead. */
  async resetValidate() {
    warnDeprecatedOnce(
      'form-api-reset-validate',
      '[Vben Form] `formApi.resetValidate()` is deprecated. Use `formApi.clearValidation()` instead.',
    );
    return this.clearValidation();
  }

  /**
   * 滚动到第一个错误字段
   * @param errors 验证错误对象
   */
  scrollToFirstError(errors: Record<string, any> | string) {
    const firstErrorFieldName =
      typeof errors === 'string' ? errors : Object.keys(errors)[0];

    if (!firstErrorFieldName) {
      return;
    }

    let el = document.querySelector(
      `[name="${firstErrorFieldName}"]`,
    ) as HTMLElement;

    // 如果通过 name 属性找不到，尝试通过组件引用查找
    if (!el) {
      const componentRef = this.getFieldComponentRef(firstErrorFieldName);
      if (componentRef && componentRef.$el instanceof HTMLElement) {
        el = componentRef.$el;
      }
    }

    if (el) {
      // 滚动到错误字段，添加一些偏移量以确保字段完全可见
      el.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
      });
    }
  }

  async setFieldValue<TFieldName extends FormFieldName<TFormValues>>(
    field: TFieldName,
    value: FormFieldValue<TFormValues, NoInfer<TFieldName>>,
    shouldValidate?: boolean,
  ) {
    const form = await this.getForm();
    await form.setFieldValue(field, value, shouldValidate);
  }

  setLatestSubmissionValues(values: null | Partial<TSubmitValues>) {
    this.latestSubmissionValues = {
      ...toRaw(values),
    } as Partial<TSubmitValues>;
  }

  setState(
    stateOrFn:
      | ((
          prev: FormApiProps<TFormValues, T, P, TSubmitValues>,
        ) => Partial<FormApiProps<TFormValues, T, P, TSubmitValues>>)
      | Partial<FormApiProps<TFormValues, T, P, TSubmitValues>>,
  ) {
    if (isFunction(stateOrFn)) {
      this.store.setState((prev) => {
        return mergeWithArrayOverride(stateOrFn(prev), prev);
      });
    } else {
      this.store.setState((prev) => mergeWithArrayOverride(stateOrFn, prev));
    }
  }

  async setSubmitValues(
    values: TSubmitValues,
    filterFields: boolean = true,
    shouldValidate: boolean = false,
  ) {
    const codec = this.state?.codec;
    if (!codec) {
      throw new Error(
        '[Vben Form] `setSubmitValues()` requires a form `codec`.',
      );
    }
    const formValues = decodeFormValues(codec, values);
    await this.setValues(formValues, filterFields, shouldValidate);
  }

  /**
   * 设置表单值
   * @param fields record
   * @param filterFields 过滤不在schema中定义的字段 默认为true
   * @param shouldValidate
   */
  async setValues(
    fields: Partial<TFormValues>,
    filterFields: boolean = true,
    shouldValidate: boolean = false,
  ) {
    const form = await this.getForm();
    if (!filterFields) {
      form.setValues(fields, shouldValidate);
      return;
    }

    const schemaFieldPaths = (this.state?.schema ?? []).map(
      (schema) => resolveFieldNamePath(schema.fieldName).pathSegments,
    );
    const filterValue = (
      value: unknown,
      parentPath: string[] = [],
    ): unknown => {
      if (
        !isObject(value) ||
        Array.isArray(value) ||
        isDate(value) ||
        isDayjsObject(value)
      ) {
        return value;
      }

      const result: Record<string, unknown> = {};
      for (const [key, currentValue] of Object.entries(value)) {
        const currentPath = [...parentPath, key];
        const matchingPaths = schemaFieldPaths.filter(
          (schemaPath) =>
            schemaPath.length >= currentPath.length &&
            currentPath.every(
              (pathSegment, index) => schemaPath[index] === pathSegment,
            ),
        );
        if (matchingPaths.length === 0) {
          continue;
        }

        result[key] = matchingPaths.some(
          (schemaPath) => schemaPath.length === currentPath.length,
        )
          ? currentValue
          : filterValue(currentValue, currentPath);
      }
      return result;
    };
    const filteredFields = filterValue(fields) as Partial<TFormValues>;
    form.setValues(filteredFields as Partial<TFormValues>, shouldValidate);
  }

  async submit(e?: Event) {
    e?.preventDefault();
    e?.stopPropagation();
    const form = await this.getForm();
    await form.submit();
    return this.submitValues();
  }

  /** @deprecated Use `submit` instead. */
  async submitForm(e?: Event) {
    warnDeprecatedOnce(
      'form-api-submit-form',
      '[Vben Form] `formApi.submitForm()` is deprecated. Use `formApi.submit()` instead.',
    );
    return this.submit(e);
  }

  unmount() {
    this.form?.reset?.();
    // this.state = null;
    this.componentRefMap = new Map();
    this.latestSubmissionValues = null;
    this.isMounted = false;
    this.stateHandler.reset();
  }

  updateSchema(schema: Partial<FormApiSchema<TFormValues, T, P>>[]) {
    const updated: Partial<FormApiSchema<TFormValues, T, P>>[] = [...schema];
    const hasField = updated.every(
      (item) => Reflect.has(item, 'fieldName') && item.fieldName,
    );

    if (!hasField) {
      console.error(
        'All items in the schema array must have a valid `fieldName` property to be updated',
      );
      return;
    }
    const currentSchema = updateFormSchemaList(
      [...(this.state?.schema ?? [])],
      updated,
    );
    this.setState({ schema: currentSchema });
  }

  async validate() {
    const form = await this.getForm();

    const validateResult = await form.validate();

    if (
      Object.keys(validateResult?.errors ?? {}).length > 0 &&
      this.state?.scrollToFirstError
    ) {
      this.scrollToFirstError(validateResult.errors);
    }
    return validateResult;
  }

  async validateAndSubmit() {
    const { valid } = await this.validate();
    if (!valid) return;
    return this.submitValues();
  }

  /** @deprecated Use `validateAndSubmit` instead. */
  async validateAndSubmitForm() {
    warnDeprecatedOnce(
      'form-api-validate-and-submit-form',
      '[Vben Form] `formApi.validateAndSubmitForm()` is deprecated. Use `formApi.validateAndSubmit()` instead.',
    );
    return this.validateAndSubmit();
  }

  async validateField(fieldName: FormFieldName<TFormValues>) {
    const form = await this.getForm();
    const validateResult = await form.validateField(fieldName);

    if (
      Object.keys(validateResult?.errors ?? {}).length > 0 &&
      this.state?.scrollToFirstError
    ) {
      this.scrollToFirstError(fieldName);
    }
    return validateResult;
  }

  private async getForm() {
    if (!this.isMounted) {
      // 等待form挂载
      await this.stateHandler.waitForCondition();
    }
    if (!this.form?.meta) {
      throw new Error('<VbenForm /> is not mounted');
    }
    return this.form;
  }

  private async submitValues() {
    const { rawValues, values } = await this.getValueSnapshot();
    this.setLatestSubmissionValues(values);
    await this.state?.handleSubmit?.(values, rawValues);
    return values;
  }

  private updateState() {
    const currentSchema = this.state?.schema ?? [];
    const prevSchema = this.prevState?.schema ?? [];
    // 进行了删除schema操作
    if (currentSchema.length < prevSchema.length) {
      const currentFields = new Set(
        currentSchema.map((item) => item.fieldName),
      );
      const deletedSchema = prevSchema.filter(
        (item) => !currentFields.has(item.fieldName),
      );
      for (const schema of deletedSchema) {
        this.form?.setFieldValue?.(
          schema.fieldName,
          undefined as FormFieldValue<TFormValues, string>,
        );
      }
    }
  }

  private warnLegacyValueTransforms() {
    const warningState = {
      arrayToStringFields: this.state?.arrayToStringFields,
      codec: this.state?.codec,
      fieldMappingTime: this.state?.fieldMappingTime,
      schema: this.state?.schema ?? [],
    };
    const previousState = this.legacyTransformWarningState;
    if (
      previousState &&
      previousState.arrayToStringFields === warningState.arrayToStringFields &&
      previousState.codec === warningState.codec &&
      previousState.fieldMappingTime === warningState.fieldMappingTime &&
      previousState.schema === warningState.schema
    ) {
      return;
    }
    this.legacyTransformWarningState = warningState;

    const hasValueFormat = (
      items: FormApiSchema<TFormValues, T, P>[],
    ): boolean => {
      return items.some((schema) => {
        if (schema.valueFormat) {
          return true;
        }
        const children = 'children' in schema ? schema.children : undefined;
        return Array.isArray(children) && hasValueFormat(children);
      });
    };
    const usesValueFormat = hasValueFormat(warningState.schema);
    const usesFieldMappingTime =
      (warningState.fieldMappingTime?.length ?? 0) > 0;
    const usesArrayToStringFields =
      (warningState.arrayToStringFields?.length ?? 0) > 0;
    const usesLegacyTransform =
      usesValueFormat || usesFieldMappingTime || usesArrayToStringFields;

    if (warningState.codec && usesLegacyTransform) {
      warnDeprecatedOnce(
        'form-codec-legacy-transform-conflict',
        '[Vben Form] The form `codec` takes precedence over deprecated `valueFormat`, `fieldMappingTime`, and `arrayToStringFields` options.',
      );
      return;
    }
    if (usesValueFormat) {
      warnDeprecatedOnce(
        'form-schema-value-format',
        '[Vben Form] `schema.valueFormat` is deprecated. Use the form-level `codec` instead.',
      );
    }
    if (usesFieldMappingTime) {
      warnDeprecatedOnce(
        'form-field-mapping-time',
        '[Vben Form] `fieldMappingTime` is deprecated. Use the form-level `codec` instead.',
      );
    }
    if (usesArrayToStringFields) {
      warnDeprecatedOnce(
        'form-array-to-string-fields',
        '[Vben Form] `arrayToStringFields` is deprecated. Use the form-level `codec` instead.',
      );
    }
  }
}
