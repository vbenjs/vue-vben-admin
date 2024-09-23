import type {
  FormState,
  GenericObject,
  ResetFormOpts,
  ValidationOptions,
} from 'vee-validate';

import type { FormActions, FormSchema, VbenFormProps } from './types';

import { toRaw } from 'vue';

import { Store } from '@vben-core/shared/store';
import {
  bindMethods,
  createMerge,
  isFunction,
  StateHandler,
} from '@vben-core/shared/utils';

const merge = createMerge((originObj, key, updates) => {
  if (Array.isArray(originObj[key]) && Array.isArray(updates)) {
    originObj[key] = updates;
    return true;
  }
});

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
  // private api: Pick<VbenFormProps, 'handleReset' | 'handleSubmit'>;
  public form = {} as FormActions;
  isMounted = false;

  public prevState: null | VbenFormProps = null;
  public state: null | VbenFormProps = null;

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
          this.prevState = this.state;
          this.state = this.store.state;
          this.updateState();
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

  private updateState() {
    const currentSchema = this.state?.schema ?? [];
    const prevSchema = this.prevState?.schema ?? [];
    // 进行了删除schema操作
    if (currentSchema.length < prevSchema.length) {
      const schemaMap = new Map(
        currentSchema.map((item) => [item.fieldName, item]),
      );
      const deletedSchema = prevSchema.filter(
        (item) => !schemaMap.has(item.fieldName),
      );

      for (const schema of deletedSchema) {
        this.form?.setFieldValue(schema.fieldName, undefined);
      }
    }
  }

  // 如果需要多次更新状态，可以使用 batch 方法
  batchStore(cb: () => void) {
    this.store.batch(cb);
  }

  getState() {
    return this.state;
  }

  async getValues() {
    const form = await this.getForm();
    return form.values;
  }

  mount(formActions: FormActions) {
    if (!this.isMounted) {
      Object.assign(this.form, formActions);
      this.stateHandler.setConditionTrue();
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

    const filterSchema = schema.filter((item) => fieldSet.has(item.fieldName));

    this.setState({
      schema: filterSchema,
    });
  }

  /**
   * 重置表单
   */
  async resetForm(
    state?: Partial<FormState<GenericObject>> | undefined,
    opts?: Partial<ResetFormOpts>,
  ) {
    const form = await this.getForm();
    return form.resetForm(state, opts);
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
      this.store.setState((prev) => {
        return merge(stateOrFn(prev), prev);
      });
    } else {
      this.store.setState((prev) => merge(stateOrFn, prev));
    }
  }

  async setValues(
    fields: Record<string, any>,
    shouldValidate: boolean = false,
  ) {
    const form = await this.getForm();
    form.setValues(fields, shouldValidate);
  }

  async submitForm(e?: Event) {
    e?.preventDefault();
    e?.stopPropagation();
    const form = await this.getForm();
    await form.submitForm();
    const rawValues = toRaw(form.values || {});
    await this.state?.handleSubmit?.(rawValues);
    return rawValues;
  }

  unmounted() {
    // this.state = null;
    this.isMounted = false;
    this.stateHandler.reset();
  }

  updateSchema(schema: Partial<FormSchema>[]) {
    const updated: Partial<FormSchema>[] = [...schema];
    const hasField = updated.every(
      (item) => Reflect.has(item, 'fieldName') && item.fieldName,
    );

    if (!hasField) {
      console.error(
        'All items in the schema array must have a valid `fieldName` property to be updated',
      );
      return;
    }
    const currentSchema = [...(this.state?.schema ?? [])];

    const updatedMap: Record<string, any> = {};

    updated.forEach((item) => {
      if (item.fieldName) {
        updatedMap[item.fieldName] = item;
      }
    });

    currentSchema.forEach((schema, index) => {
      const updatedData = updatedMap[schema.fieldName];
      if (updatedData) {
        currentSchema[index] = merge(updatedData, schema) as FormSchema;
      }
    });
    this.setState({ schema: currentSchema });
  }

  async validate(opts?: Partial<ValidationOptions>) {
    const form = await this.getForm();

    const validateResult = await form.validate(opts);

    if (Object.keys(validateResult?.errors ?? {}).length > 0) {
      console.error('validate error', validateResult?.errors);
    }
    return validateResult;
  }
}
