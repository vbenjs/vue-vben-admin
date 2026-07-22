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
import { updateFormSchemaList } from './form-render/schema';
import { formatFormValues } from './form-value-transform';

type FormApiProps<
  TValues extends FormValues,
  T extends BaseFormComponentType,
  P extends Record<string, any>,
> = VbenFormProps<T, P, TValues>;

type FormApiSchema<
  TValues extends FormValues,
  T extends BaseFormComponentType,
  P extends Record<string, any>,
> = FormSchema<T, P, TValues>;

function getDefaultState<
  TValues extends FormValues,
  T extends BaseFormComponentType,
  P extends Record<string, any>,
>(): FormApiProps<TValues, T, P> {
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
  TValues extends FormValues = FormValues,
  T extends BaseFormComponentType = BaseFormComponentType,
  P extends Record<string, any> = Record<never, never>,
> {
  // private api: Pick<VbenFormProps, 'handleReset' | 'handleSubmit'>;
  public form = {} as FormActions<TValues>;
  isMounted = false;

  public state: FormApiProps<TValues, T, P> | null = null;
  stateHandler: StateHandler;

  public store: Store<FormApiProps<TValues, T, P>>;

  /**
   * 组件实例映射
   */
  private componentRefMap: Map<string, unknown> = new Map();

  // 最后一次点击提交时的表单值
  private latestSubmissionValues: null | Partial<TValues> = null;

  private prevState: FormApiProps<TValues, T, P> | null = null;

  constructor(options: FormApiProps<TValues, T, P> = {}) {
    const { ...storeState } = options;

    const defaultState = getDefaultState<TValues, T, P>();

    this.store = new Store<FormApiProps<TValues, T, P>>({
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
    fieldNames?: FormFieldName<TValues> | FormFieldName<TValues>[],
  ) {
    const form = await this.getForm();
    form.clearValidation(fieldNames);
  }

  formatValues<TResult extends FormValues = TValues>(
    rawValues: Readonly<FormValues>,
  ) {
    return formatFormValues(
      toRaw(rawValues),
      this.state?.schema ?? [],
      this.state?.fieldMappingTime,
      this.state?.arrayToStringFields,
    ) as TResult;
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

  async getRawValues<TResult extends FormValues = TValues>() {
    const form = await this.getForm();
    return cloneDeep(toRaw(form.values ?? {})) as unknown as TResult;
  }

  getState() {
    return this.state;
  }

  async getValues<TResult extends FormValues = TValues>() {
    const form = await this.getForm();
    return this.formatValues<TResult>(toRaw(form.values ?? {}));
  }

  async getValueSnapshot<TResult extends FormValues = TValues>(): Promise<
    FormValueSnapshot<TResult>
  > {
    const rawValues = await this.getRawValues<TResult>();
    return {
      rawValues,
      values: this.formatValues<TResult>(rawValues),
    };
  }

  async isFieldValid(fieldName: FormFieldName<TValues>) {
    const form = await this.getForm();
    return form.isFieldValid(fieldName);
  }

  merge(formApi: FormApi<any, any, any>) {
    const chain = [this, formApi];
    const proxy = new Proxy(formApi, {
      get(target: any, prop: any) {
        if (prop === 'merge') {
          return (nextFormApi: FormApi<any, any, any>) => {
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
    formActions: FormActions<TValues>,
    componentRefMap?: Map<string, unknown>,
  ) {
    if (!this.isMounted) {
      this.form = formActions;
      this.stateHandler.setConditionTrue();
      const initialValues = this.form.values
        ? this.formatValues(toRaw(this.form.values))
        : {};
      this.setLatestSubmissionValues({
        ...initialValues,
      } as Partial<TValues>);
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
  async reset(state?: FormResetState<TValues>, opts?: FormResetOptions) {
    const form = await this.getForm();
    return form.reset(state, opts);
  }

  /** @deprecated Use `reset` instead. */
  async resetForm(state?: FormResetState<TValues>, opts?: FormResetOptions) {
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

  async setFieldValue<TFieldName extends FormFieldName<TValues>>(
    field: TFieldName,
    value: FormFieldValue<TValues, NoInfer<TFieldName>>,
    shouldValidate?: boolean,
  ) {
    const form = await this.getForm();
    await form.setFieldValue(field, value, shouldValidate);
  }

  setLatestSubmissionValues(values: null | Partial<TValues>) {
    this.latestSubmissionValues = {
      ...toRaw(values),
    } as Partial<TValues>;
  }

  setState(
    stateOrFn:
      | ((
          prev: FormApiProps<TValues, T, P>,
        ) => Partial<FormApiProps<TValues, T, P>>)
      | Partial<FormApiProps<TValues, T, P>>,
  ) {
    if (isFunction(stateOrFn)) {
      this.store.setState((prev) => {
        return mergeWithArrayOverride(stateOrFn(prev), prev);
      });
    } else {
      this.store.setState((prev) => mergeWithArrayOverride(stateOrFn, prev));
    }
  }

  /**
   * 设置表单值
   * @param fields record
   * @param filterFields 过滤不在schema中定义的字段 默认为true
   * @param shouldValidate
   */
  async setValues(
    fields: Partial<TValues>,
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
    const filteredFields = filterValue(fields) as Partial<TValues>;
    form.setValues(filteredFields as Partial<TValues>, shouldValidate);
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

  updateSchema(schema: Partial<FormApiSchema<TValues, T, P>>[]) {
    const updated: Partial<FormApiSchema<TValues, T, P>>[] = [...schema];
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

  async validateField(fieldName: FormFieldName<TValues>) {
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
          undefined as FormFieldValue<TValues, string>,
        );
      }
    }
  }
}
