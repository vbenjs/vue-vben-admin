<template>
  <Form v-bind="$attrs" ref="formElRef" :model="formModel">
    <Row :class="getProps.compact ? 'compact-form-row' : ''">
      <slot name="formHeader" />
      <template v-for="schema in getSchema" :key="schema.field">
        <FormItem
          :schema="schema"
          :formProps="getProps"
          :allDefaultValues="getAllDefaultValues"
          :formModel="formModel"
        >
          <template #[item]="data" v-for="item in Object.keys($slots)">
            <slot :name="item" v-bind="data" />
          </template>
        </FormItem>
      </template>
      <FormAction
        v-bind="{ ...getActionPropsRef, ...advanceState }"
        @toggle-advanced="handleToggleAdvanced"
      />
      <slot name="formFooter" />
    </Row>
  </Form>
</template>
<script lang="ts">
  import type { FormActionType, FormProps, FormSchema } from './types/form';
  import type { Form as FormType, ValidateFields } from 'ant-design-vue/types/form/form';

  import {
    defineComponent,
    reactive,
    ref,
    computed,
    unref,
    toRaw,
    watch,
    toRef,
    onMounted,
  } from 'vue';
  import { Form, Row } from 'ant-design-vue';
  import FormItem from './FormItem';
  import { basicProps } from './props';
  import { deepMerge, unique } from '/@/utils';
  import FormAction from './FormAction';

  import { dateItemType } from './helper';
  import moment from 'moment';
  import { isArray, isBoolean, isFunction, isNumber, isObject, isString } from '/@/utils/is';
  import { cloneDeep } from 'lodash-es';
  import { useBreakpoint } from '/@/hooks/event/useBreakpoint';
  // import { useThrottle } from '/@/hooks/core/useThrottle';
  import { useFormValues } from './hooks/useFormValues';
  import type { ColEx } from './types';
  import { NamePath } from 'ant-design-vue/types/form/form-item';
  const BASIC_COL_LEN = 24;

  export default defineComponent({
    name: 'BasicForm',
    inheritAttrs: false,
    components: { FormItem, Form, Row, FormAction },
    props: basicProps,
    emits: ['advanced-change', 'reset', 'submit', 'register'],
    setup(props, { emit }) {
      let formModel = reactive({});
      const advanceState = reactive({
        isAdvanced: true,
        hideAdvanceBtn: false,
        isLoad: false,
        actionSpan: 6,
      });
      const propsRef = ref<Partial<FormProps>>({});
      const schemaRef = ref<FormSchema[] | null>(null);
      const formElRef = ref<Nullable<FormType>>(null);

      const getMergePropsRef = computed(
        (): FormProps => {
          return deepMerge(props, unref(propsRef));
        }
      );
      // 获取表单基本配置
      const getProps = computed(
        (): FormProps => {
          const resetAction = {
            onClick: resetFields,
          };
          const submitAction = {
            onClick: handleSubmit,
          };
          return {
            ...unref(getMergePropsRef),
            resetButtonOptions: deepMerge(
              resetAction,
              unref(getMergePropsRef).resetButtonOptions || {}
            ) as any,
            submitButtonOptions: deepMerge(
              submitAction,
              unref(getMergePropsRef).submitButtonOptions || {}
            ) as any,
          };
        }
      );

      const getActionPropsRef = computed(() => {
        const {
          resetButtonOptions,
          submitButtonOptions,
          showActionButtonGroup,
          showResetButton,
          showSubmitButton,
          showAdvancedButton,
          actionColOptions,
        } = unref(getProps);
        return {
          resetButtonOptions,
          submitButtonOptions,
          show: showActionButtonGroup,
          showResetButton,
          showSubmitButton,
          showAdvancedButton,
          actionColOptions,
        };
      });

      const getSchema = computed((): FormSchema[] => {
        const schemas: FormSchema[] = unref(schemaRef) || (unref(getProps).schemas as any);
        for (const schema of schemas) {
          const { defaultValue, component } = schema;
          if (defaultValue && dateItemType.includes(component!)) {
            schema.defaultValue = moment(defaultValue);
          }
        }
        return schemas as FormSchema[];
      });

      const getAllDefaultValues = computed(() => {
        const schemas = unref(getSchema);
        const obj: any = {};
        schemas.forEach((item) => {
          if (item.defaultValue) {
            obj[item.field] = item.defaultValue;
            (formModel as any)[item.field] = item.defaultValue;
          }
        });
        return obj;
      });
      const getEmptySpanRef = computed((): number => {
        if (!advanceState.isAdvanced) {
          return 0;
        }
        const emptySpan = unref(getMergePropsRef).emptySpan || 0;

        if (isNumber(emptySpan)) {
          return emptySpan;
        }
        if (isObject(emptySpan)) {
          const { span = 0 } = emptySpan;
          const screen = unref(screenRef) as string;

          const screenSpan = (emptySpan as any)[screen.toLowerCase()];
          return screenSpan || span || 0;
        }
        return 0;
      });

      const { realWidthRef, screenEnum, screenRef } = useBreakpoint();
      // const [throttleUpdateAdvanced] = useThrottle(updateAdvanced, 30, { immediate: true });
      watch(
        [() => unref(getSchema), () => advanceState.isAdvanced, () => unref(realWidthRef)],
        () => {
          const { showAdvancedButton } = unref(getProps);
          if (showAdvancedButton) {
            updateAdvanced();
          }
        },
        { immediate: true }
      );
      function updateAdvanced() {
        let itemColSum = 0;
        let realItemColSum = 0;
        for (const schema of unref(getSchema)) {
          const { show, colProps } = schema;
          let isShow = true;

          if (isBoolean(show)) {
            isShow = show;
          }

          if (isFunction(show)) {
            isShow = show({
              schema: schema,
              model: formModel,
              field: schema.field,
              values: {
                ...getAllDefaultValues,
                ...formModel,
              },
            });
          }
          if (isShow && colProps) {
            const { itemColSum: sum, isAdvanced } = getAdvanced(colProps, itemColSum);

            itemColSum = sum || 0;
            if (isAdvanced) {
              realItemColSum = itemColSum;
            }
            schema.isAdvanced = isAdvanced;
          }
        }
        advanceState.actionSpan = (realItemColSum % BASIC_COL_LEN) + unref(getEmptySpanRef);
        getAdvanced(
          unref(getActionPropsRef).actionColOptions || { span: BASIC_COL_LEN },
          itemColSum,
          true
        );
        emit('advanced-change');
      }
      function getAdvanced(itemCol: Partial<ColEx>, itemColSum = 0, isLastAction = false) {
        const width = unref(realWidthRef);

        const mdWidth =
          parseInt(itemCol.md as string) ||
          parseInt(itemCol.xs as string) ||
          parseInt(itemCol.sm as string) ||
          (itemCol.span as number) ||
          BASIC_COL_LEN;
        const lgWidth = parseInt(itemCol.lg as string) || mdWidth;
        const xlWidth = parseInt(itemCol.xl as string) || lgWidth;
        const xxlWidth = parseInt(itemCol.xxl as string) || xlWidth;
        if (width <= screenEnum.LG) {
          itemColSum += mdWidth;
        } else if (width < screenEnum.XL) {
          itemColSum += lgWidth;
        } else if (width < screenEnum.XXL) {
          itemColSum += xlWidth;
        } else {
          itemColSum += xxlWidth;
        }
        if (isLastAction) {
          advanceState.hideAdvanceBtn = false;
          if (itemColSum <= BASIC_COL_LEN * 2) {
            // 小于等于2行时，不显示收起展开按钮
            advanceState.hideAdvanceBtn = true;
            advanceState.isAdvanced = true;
          } else if (
            itemColSum > BASIC_COL_LEN * 2 &&
            itemColSum <= BASIC_COL_LEN * (props.autoAdvancedLine || 3)
          ) {
            advanceState.hideAdvanceBtn = false;

            // 大于3行默认收起
          } else if (!advanceState.isLoad) {
            advanceState.isLoad = true;
            advanceState.isAdvanced = !advanceState.isAdvanced;
          }
          return { isAdvanced: advanceState.isAdvanced, itemColSum };
        }
        if (itemColSum > BASIC_COL_LEN) {
          return { isAdvanced: advanceState.isAdvanced, itemColSum };
        } else {
          // 第一行始终显示
          return { isAdvanced: true, itemColSum };
        }
      }

      async function resetFields(): Promise<any> {
        const { resetFunc } = unref(getProps);
        resetFunc && isFunction(resetFunc) && (await resetFunc());
        const formEl = unref(formElRef);
        if (!formEl) return;
        Object.keys(formModel).forEach((key) => {
          (formModel as any)[key] = undefined;
        });
        const values = formEl.resetFields();
        emit('reset', toRaw(formModel));
        return values;
      }

      /**
       * @description: 设置表单值
       */
      async function setFieldsValue(values: any): Promise<void> {
        const fields = unref(getSchema)
          .map((item) => item.field)
          .filter(Boolean);
        const formEl = unref(formElRef);
        Object.keys(values).forEach((key) => {
          const element = values[key];
          if (fields.includes(key) && element !== undefined && element !== null) {
            // 时间
            if (itemIsDateType(key)) {
              if (Array.isArray(element)) {
                const arr: any[] = [];
                for (const ele of element) {
                  arr.push(moment(ele));
                }
                (formModel as any)[key] = arr;
              } else {
                (formModel as any)[key] = moment(element);
              }
            } else {
              (formModel as any)[key] = element;
            }
            if (formEl) {
              formEl.validateFields([key]);
            }
          }
        });
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
        const formEl = unref(formElRef);
        if (!formEl) return;
        try {
          const values = await formEl.validate();
          const res = handleFormValues(values);
          emit('submit', res);
        } catch (error) {}
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
        schemaRef.value = schemaList as any;
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
        const hasInList = schemaList.find((item) => item.field === schema.field);

        if (hasInList) {
          return;
        }
        if (!prefixField || index === -1) {
          schemaList.push(schema);
          schemaRef.value = schemaList as any;
          return;
        }
        if (index !== -1) {
          schemaList.splice(index + 1, 0, schema);
        }
        schemaRef.value = schemaList as any;
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

        schemaRef.value = unique(schema, 'field') as any;
      }

      function handleToggleAdvanced() {
        advanceState.isAdvanced = !advanceState.isAdvanced;
      }

      const handleFormValues = useFormValues(
        toRef(props, 'transformDateFunc'),
        toRef(props, 'fieldMapToTime')
      );
      function getFieldsValue(): any {
        const formEl = unref(formElRef);
        if (!formEl) return;
        return handleFormValues(toRaw(unref(formModel)));
      }

      /**
       * @description: 是否是时间
       */
      function itemIsDateType(key: string) {
        return unref(getSchema).some((item) => {
          return item.field === key ? dateItemType.includes(item.component!) : false;
        });
      }
      /**
       * @description:设置表单
       */
      function setProps(formProps: Partial<FormProps>): void {
        const mergeProps = deepMerge(unref(propsRef) || {}, formProps);
        propsRef.value = mergeProps;
      }

      function validateFields(nameList?: NamePath[] | undefined) {
        if (!formElRef.value) return;
        return formElRef.value.validateFields(nameList);
      }
      function validate(nameList?: NamePath[] | undefined) {
        if (!formElRef.value) return;
        return formElRef.value.validate(nameList);
      }

      function clearValidate(name: string | string[]) {
        if (!formElRef.value) return;
        formElRef.value.clearValidate(name);
      }

      const methods: Partial<FormActionType> = {
        getFieldsValue,
        setFieldsValue,
        resetFields,
        updateSchema,
        setProps,
        removeSchemaByFiled,
        appendSchemaByField,
        clearValidate,
        validateFields: validateFields as ValidateFields,
        validate: validate as ValidateFields,
      };
      onMounted(() => {
        emit('register', methods);
      });
      return {
        handleToggleAdvanced,
        formModel,
        getActionPropsRef,
        getAllDefaultValues,
        advanceState,
        getProps,
        formElRef,
        getSchema,
        ...methods,
      };
    },
  });
</script>
