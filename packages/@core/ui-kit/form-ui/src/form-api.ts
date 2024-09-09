import type { FormActions, FormSchema, VbenFormProps } from './types';

import { toRaw } from 'vue';

import { Store } from '@vben-core/shared/store';
import { bindMethods, isFunction, StateHandler } from '@vben-core/shared/utils';

function getDefaultState(): VbenFormProps {
  return {
    actionWrapperClass: '',
    collapsed: false,
    collapsedRows: 1,
    commonConfig: {},
    handleReset: undefined,
    handleSubmit: undefined,
    layout: 'horizontal',
    resetButtonOptions: {},
    schema: [],
    showCollapseButton: false,
    showDefaultActions: true,
    submitButtonOptions: {},
    wrapperClass: 'grid-cols-1',
  };
}

export class FormApi {
  // private prevState!: ModalState;
  private state: null | VbenFormProps = null;
  // private api: Pick<VbenFormProps, 'handleReset' | 'handleSubmit'>;
  public form = {} as FormActions;

  isMounted = false;

  stateHandler: StateHandler;

  public store: Store<VbenFormProps>;

  constructor(options: VbenFormProps = {}) {
    const { ...storeState } = options;

    const defaultState = getDefaultState();

    this.store = new Store<VbenFormProps>(
      {
        ...defaultState,
        ...storeState,
      },
      {
        onUpdate: () => {
          this.state = this.store.state;
        },
      },
    );

    this.state = this.store.state;
    this.stateHandler = new StateHandler();
    bindMethods(this);
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

  // 如果需要多次更新状态，可以使用 batch 方法
  batchStore(cb: () => void) {
    this.store.batch(cb);
  }

  async getValues() {
    const form = await this.getForm();
    return form.values;
  }

  /**
   * 满足条件的位置，插入表单项，如果没有满足条件的，插入到末尾
   * @param value
   * @param condition
   */
  insertAtCondition(
    value: FormSchema,
    condition: (
      element: FormSchema,
      index: number,
      array: FormSchema[],
    ) => boolean,
  ): FormSchema[] {
    const schema = this.state?.schema ?? [];
    // 找到满足条件的索引
    const index = schema?.findIndex((element, i, array) =>
      condition(element, i, array),
    );

    if (index === -1) {
      // 如果没有符合条件的，插入到末尾
      schema.push(value);
    } else {
      // 在找到的位置插入
      schema.splice(index, 0, value);
    }
    this.setState({
      schema,
    });
    return schema;
  }

  mount(formActions: FormActions) {
    if (!this.isMounted) {
      Object.assign(this.form, formActions);
      this.stateHandler.setConditionTrue();
      this.isMounted = true;
    }
  }

  /**
   * 删除数组中满足条件的元素
   * @param condition - 回调函数，定义删除条件
   */
  removeAtCondition(
    condition: (
      element: FormSchema,
      index: number,
      array: FormSchema[],
    ) => boolean,
  ): FormSchema[] {
    const schema = this.state?.schema ?? [];

    // 删除第一个符合条件的元素
    const filterSchema = schema.filter(
      (element, index, array) => !condition(element, index, array),
    );

    this.setState({
      schema: filterSchema,
    });
    return schema;
  }

  /**
   * 根据字段名移除表单项
   * @param fields
   */
  async removeSchemaByFields(fields: string[]) {
    const fieldSet = new Set(fields);
    const schema = this.state?.schema ?? [];

    const filterSchema = schema.filter((item) => fieldSet.has(item.fieldName));

    this.setState({
      schema: filterSchema,
    });
  }

  /**
   * 重置表单
   */
  async resetForm(e?: Event) {
    e?.preventDefault();
    const form = await this.getForm();

    return form.resetForm();
  }

  async resetValidate() {
    const form = await this.getForm();
    const fields = Object.keys(form.errors.value);
    fields.forEach((field) => {
      form.setFieldError(field, undefined);
    });
  }

  async setFieldValue(field: string, value: any, shouldValidate?: boolean) {
    const form = await this.getForm();
    form.setFieldValue(field, value, shouldValidate);
  }

  setState(
    stateOrFn:
      | ((prev: VbenFormProps) => Partial<VbenFormProps>)
      | Partial<VbenFormProps>,
  ) {
    if (isFunction(stateOrFn)) {
      this.store.setState(stateOrFn as (prev: VbenFormProps) => VbenFormProps);
    } else {
      this.store.setState((prev) => ({ ...prev, ...stateOrFn }));
    }
  }

  async setValues(fields: Record<string, any>, shouldValidate?: boolean) {
    const form = await this.getForm();
    form.setValues(fields, shouldValidate);
  }

  async submitForm(e?: Event) {
    e?.preventDefault();
    const form = await this.getForm();
    await form.submitForm();
    const rawValues = toRaw(form.values || {});
    await this.state?.handleSubmit?.(rawValues);
    return rawValues;
  }

  unmounted() {
    this.state = null;
    this.isMounted = false;
    this.stateHandler.reset();
  }

  async validate() {
    const form = await this.getForm();
    return await form.validate();
  }
}
