<script lang="tsx">
  import { Form, Row } from 'ant-design-vue';
  import {
    defineComponent,
    ref,
    onMounted,
    computed,
    unref,
    // PropOptions
  } from 'compatible-vue';

  import { formProps } from './props/form';

  import {
    FormSchema,
    FormProps,
    FormInstance,
    ValidateResult,
    ActionButtonOption,
  } from './types/form';

  import { getSlot } from '@/utils/helper/tsxHelper';

  import { moment } from '@/utils/momentUtil';
  import { dateItemType } from './helper';
  import { cloneDeep } from '@/utils/lodashChunk';
  import { isFunction, isObject, isArray, isString } from '@/utils/is/index';
  import { deepMerge } from '@/utils/deepMerge';

  import { renderCol } from './renderItem';
  import { renderAction } from './renderAction';
  const BasicForm = defineComponent({
    name: 'BasicForm',
    props: formProps,
    setup(props: Readonly<FormProps>, { slots, emit, listeners }) {
      const schemaRef = ref<FormSchema[] | null>(null);
      const propsRef = ref<Partial<FormProps> | null>(null);

      const getMergeProps = computed(() => {
        return { ...props, ...unref(propsRef) };
      });
      // 获取表单基本配置
      const getProps = computed(
        (): FormProps => {
          const resetAction: Partial<ActionButtonOption> = {
            on: {
              click: resetFields,
            },
          };
          const submitAction: Partial<ActionButtonOption> = {
            on: {
              click: handleSubmit,
            },
          };
          return {
            ...unref(getMergeProps),
            resetButtonOptions: deepMerge(
              resetAction,
              unref(getMergeProps).resetButtonOptions || {}
            ) as ActionButtonOption,
            submitButtonOptions: deepMerge(
              submitAction,
              unref(getMergeProps).submitButtonOptions || {}
            ) as ActionButtonOption,
          };
        }
      );

      const getSchema = computed((): FormSchema[] => {
        const schemas = unref(schemaRef) || unref(getProps).schemas || [];
        for (const schema of schemas) {
          const { defaultValue, component } = schema;
          if (defaultValue && dateItemType.includes(component!)) {
            schema.defaultValue = moment(defaultValue);
          }
        }
        return schemas;
      });

      /**
       * @description: 是否是时间
       */
      function itemIsDateType(key) {
        return unref(getSchema).some((item) => {
          return item.field === key ? dateItemType.includes(item.component!) : false;
        });
      }
      // 重置表单
      async function resetFields(): Promise<any> {
        const { resetFunc } = unref(getProps);
        resetFunc && isFunction(resetFunc) && (await resetFunc());
        unref(getProps).form.resetFields();
        const values = unref(getProps).form.getFieldsValue();
        emit('reset', values);
        return values;
      }
      /**
       * @description: 设置表单值
       */
      function setFieldsValue<T>(values: T): void {
        const fields = unref(getSchema)
          .map((item) => item.field)
          .filter(Boolean);
        const newValues = {};
        Object.keys(values).forEach((key) => {
          const element = values[key];
          if (fields.includes(key) && element !== undefined && element !== null) {
            // 时间
            newValues[key] = itemIsDateType(key) ? moment(element) : element;
          }
        });
        unref(getProps).form.setFieldsValue(newValues);
      }

      // 处理表单值
      function handleFormValues(values: any) {
        if (!isObject(values)) {
          return {};
        }
        const resMap = {};
        for (let [key, value] of Object.entries(values)) {
          if ((isArray(value) && value.length === 0) || isFunction(value)) {
            continue;
          }
          if (isObject(value)) {
            value = unref(getProps).transformDateFunc(value);
          }
          if (isArray(value) && value[0]._isAMomentObject && value[1]._isAMomentObject) {
            value = value.map((item) => unref(getProps).transformDateFunc(item));
          }
          // 去除空格
          if (isString(value)) {
            value = value.trim();
          }
          resMap[key] = value;
        }
        return handleRangeTimeValue(resMap);
      }

      /**
       * @description: 处理时间区间参数
       */
      function handleRangeTimeValue(values) {
        const fieldMapToTime = unref(getProps).fieldMapToTime;

        if (!fieldMapToTime || !Array.isArray(fieldMapToTime)) {
          return values;
        }

        for (const [field, [startTimeKey, endTimeKey, format = 'YYYY-MM-DD']] of fieldMapToTime) {
          if (!field || !startTimeKey || !endTimeKey || !values[field]) {
            continue;
          }

          const [startTime, endTime]: string[] = values[field];

          values[startTimeKey] = moment(startTime).format(format);
          values[endTimeKey] = moment(endTime).format(format);
        }

        return values;
      }
      /**
       * @description: 表单提交
       */
      async function handleSubmit(e?: Event): Promise<void> {
        e && e.preventDefault();
        const { submitFunc } = unref(getProps);
        if (submitFunc && isFunction(submitFunc)) {
          await submitFunc();
          return;
        }
        const { err, values } = await validateFieldsAndScroll();
        if (!err) {
          const res = handleFormValues(values);
          emit('change', res);
        }
      }

      /**
       * @description: 校验表单
       */
      function validateFields<T>(): Promise<ValidateResult<T>> {
        return new Promise((resolve) => {
          unref(getProps).form.validateFields({ force: true }, (err, values) => {
            resolve({
              err,
              values: handleFormValues(values),
            });
          });
        });
      }
      /**
       * @description: 校验表单并滚动
       */
      function validateFieldsAndScroll<T>(): Promise<ValidateResult<T>> {
        return new Promise((resolve) => {
          unref(getProps).form.validateFieldsAndScroll({ force: true }, (err, values) => {
            resolve({
              err,
              values: handleFormValues(values),
            });
          });
        });
      }

      function getFieldsValue<T>(): any {
        let values = unref(getProps).form.getFieldsValue();
        values = handleFormValues(values);
        return values;
      }
      function updateSchema(data: Partial<FormSchema> | Partial<FormSchema>[]) {
        let updateData: Partial<FormSchema>[] = [];
        if (isObject(data)) {
          updateData.push(data as FormSchema);
        }
        if (isArray(data)) {
          updateData = [...data];
        }
        const hasField = updateData.every((item) => Reflect.has(item, 'field') && item.field);
        if (!hasField) {
          throw new Error('Must pass in the `field` field!');
        }
        const schema: FormSchema[] = [];
        updateData.forEach((item) => {
          unref(getSchema).forEach((val) => {
            if (val.field === item.field) {
              const newScheam = deepMerge(val, item);
              schema.push(newScheam as FormSchema);
            } else {
              schema.push(val);
            }
          });
        });

        schemaRef.value = schema;
      }
      /**
       * @description: 根据字段名删除
       */
      function removeSchemaByFiled(fields: string | string[]): void {
        const schemaList: FormSchema[] = cloneDeep(unref(getSchema));
        if (!fields) {
          return;
        }
        let fieldList: string[] = fields as string[];
        if (isString(fields)) {
          fieldList = [fields];
        }
        for (const field of fieldList) {
          _removeSchemaByFiled(field, schemaList);
        }
        schemaRef.value = schemaList;
      }
      /**
       * @description: 根据字段名删除
       */
      function _removeSchemaByFiled(field: string, schemaList: FormSchema[]): void {
        if (isString(field)) {
          const index = schemaList.findIndex((schema) => schema.field === field);
          if (index !== -1) {
            schemaList.splice(index, 1);
          }
        }
      }

      /**
       * @description: 往某个字段后面插入,如果没有插入最后一个
       */
      function appendSchemaByField(schema: FormSchema, prefixField?: string) {
        const schemaList: FormSchema[] = cloneDeep(unref(getSchema));

        const index = schemaList.findIndex((schema) => schema.field === prefixField);
        if (!prefixField || index === -1) {
          schemaList.push(schema);
          schemaRef.value = schemaList;
          return;
        }
        if (index !== -1) {
          schemaList.splice(index + 1, 0, schema);
        }
        schemaRef.value = schemaList;
      }

      /**
       * @description:设置表单
       */
      function setProps(formProps: Partial<FormProps>): void {
        const mergeProps = deepMerge(unref(propsRef) || {}, formProps);
        propsRef.value = cloneDeep(mergeProps);
      }
      const methods: Partial<FormInstance> = {
        ...props.form,
        getFieldsValue,
        setFieldsValue,
        resetFields,
        validateFields,
        validateFieldsAndScroll,
        updateSchema,
        setProps,
        removeSchemaByFiled,
        appendSchemaByField,
      };
      emit('register', methods);
      onMounted(() => {
        emit('mounted');
      });
      return () => {
        const propsData = unref(getProps);
        const { compact } = propsData;
        const schema = unref(getSchema) || [];
        return (
          <Form props={propsData} on={listeners}>
            {
              // 表单项前置item  需要用 Col标签包含
            }
            {getSlot(slots, 'insert-form')}
            <Row class={[compact ? 'compact-form-row' : '']}>
              {schema.map((schemaItem) => {
                return renderCol(schemaItem, propsData, slots);
              })}
              {renderAction(propsData)}
            </Row>
            {
              // 表单项后置item  需要用 Col标签包含
            }
            {getSlot(slots, 'append-form')}
          </Form>
        );
      };
    },
  });

  export default Form.create({
    props: formProps || {},
  })(BasicForm);
</script>
