import type { FormActions, FormSchema, VbenFormProps } from './types';

import { Store } from '@vben-core/shared/store';
import { isFunction } from '@vben-core/shared/utils';

export class FormApi {
  // private prevState!: ModalState;
  private state: null | VbenFormProps = null;

  // private api: Pick<VbenFormProps, 'handleReset' | 'handleSubmit'>;
  public form: FormActions | null = null;

  public store: Store<VbenFormProps>;

  constructor(options: VbenFormProps = {}) {
    const { ...storeState } = options;

    const defaultState: VbenFormProps = {
      actionWrapperClass: '',
      collapsedRows: 1,
      commonConfig: {},
      expandable: false,
      gridClass: 'grid-cols-1',
      handleReset: undefined,
      handleSubmit: undefined,
      layout: 'vertical',
      resetButtonOptions: {},
      schema: [],
      showDefaultActions: false,
      submitButtonOptions: {},
    };

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
  }

  // 如果需要多次更新状态，可以使用 batch 方法
  batchStore(cb: () => void) {
    this.store.batch(cb);
  }

  async getValues() {
    return this.form?.values;
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
    this.form = formActions;
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
  async resetForm() {
    return this.form?.resetForm();
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
    this.form?.setValues(fields, shouldValidate);
  }

  async submitForm(e?: Event) {
    e?.preventDefault();
    return await (this.form as FormActions).validate();
  }

  async validate() {
    return await (this.form as FormActions).validate();
  }
}
