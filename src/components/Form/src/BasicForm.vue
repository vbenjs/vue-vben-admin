<template>
  <Form
    v-bind="getBindValue"
    :class="getFormClass"
    ref="formElRef"
    :model="formModel"
    @keypress.enter="handleEnterPress"
  >
    <Row v-bind="getRow">
      <slot name="formHeader"></slot>
      <template v-for="schema in getSchema" :key="schema.field">
        <FormItem
          :isAdvanced="fieldsIsAdvancedMap[schema.field]"
          :tableAction="tableAction"
          :formActionType="formActionType"
          :schema="schema"
          :formProps="getProps"
          :allDefaultValues="defaultValueRef"
          :formModel="formModel"
          :setFormModel="setFormModel"
        >
          <template #[item]="data" v-for="item in Object.keys($slots)">
            <slot :name="item" v-bind="data || {}"></slot>
          </template>
        </FormItem>
      </template>

      <FormAction v-bind="getFormActionBindProps" @toggle-advanced="handleToggleAdvanced">
        <template
          #[item]="data"
          v-for="item in ['resetBefore', 'submitBefore', 'advanceBefore', 'advanceAfter']"
        >
          <slot :name="item" v-bind="data || {}"></slot>
        </template>
      </FormAction>
      <slot name="formFooter"></slot>
    </Row>
  </Form>
</template>
<script lang="ts">
  import type { FormActionType, FormProps, FormSchemaInner as FormSchema } from './types/form';
  import type { AdvanceState } from './types/hooks';
  import type { Ref } from 'vue';

  import { defineComponent, reactive, ref, computed, unref, onMounted, watch, nextTick } from 'vue';
  import { Form, Row, type FormProps as AntFormProps } from 'ant-design-vue';
  import FormItem from './components/FormItem.vue';
  import FormAction from './components/FormAction.vue';

  import { dateItemType } from './helper';
  import { dateUtil } from '/@/utils/dateUtil';

  import { deepMerge } from '/@/utils';

  import { useFormValues } from './hooks/useFormValues';
  import useAdvanced from './hooks/useAdvanced';
  import { useFormEvents } from './hooks/useFormEvents';
  import { createFormContext } from './hooks/useFormContext';
  import { useAutoFocus } from './hooks/useAutoFocus';
  import { useModalContext } from '/@/components/Modal';
  import { useDebounceFn } from '@vueuse/core';

  import { basicProps } from './props';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { cloneDeep } from 'lodash-es';

  export default defineComponent({
    name: 'BasicForm',
    components: { FormItem, Form, Row, FormAction },
    props: basicProps,
    emits: ['advanced-change', 'reset', 'submit', 'register', 'field-value-change'],
    setup(props, { emit, attrs }) {
      const formModel = reactive({});
      const modalFn = useModalContext();

      const advanceState = reactive<AdvanceState>({
        isAdvanced: true,
        hideAdvanceBtn: false,
        isLoad: false,
        actionSpan: 6,
      });

      const defaultValueRef = ref({});
      const isInitedDefaultRef = ref(false);
      const propsRef = ref<Partial<FormProps>>();
      const schemaRef = ref<FormSchema[] | null>(null);
      const formElRef = ref<FormActionType | null>(null);

      const { prefixCls } = useDesign('basic-form');

      // Get the basic configuration of the form
      const getProps = computed(() => {
        return { ...props, ...unref(propsRef) } as FormProps;
      });

      const getFormClass = computed(() => {
        return [
          prefixCls,
          {
            [`${prefixCls}--compact`]: unref(getProps).compact,
          },
        ];
      });

      // Get uniform row style and Row configuration for the entire form
      const getRow = computed(() => {
        const { baseRowStyle = {}, rowProps } = unref(getProps);
        return {
          style: baseRowStyle,
          ...rowProps,
        };
      });

      const getBindValue = computed(
        () => ({ ...attrs, ...props, ...unref(getProps) }) as AntFormProps,
      );

      const getSchema = computed((): FormSchema[] => {
        const schemas: FormSchema[] = unref(schemaRef) || (unref(getProps).schemas as any);
        for (const schema of schemas) {
          const {
            defaultValue,
            component,
            componentProps,
            isHandleDateDefaultValue = true,
          } = schema;
          // handle date type
          if (
            isHandleDateDefaultValue &&
            defaultValue &&
            component &&
            dateItemType.includes(component)
          ) {
            const valueFormat = componentProps ? componentProps['valueFormat'] : null;
            if (!Array.isArray(defaultValue)) {
              schema.defaultValue = valueFormat
                ? dateUtil(defaultValue).format(valueFormat)
                : dateUtil(defaultValue);
            } else {
              const def: any[] = [];
              defaultValue.forEach((item) => {
                def.push(valueFormat ? dateUtil(item).format(valueFormat) : dateUtil(item));
              });
              schema.defaultValue = def;
            }
          }
        }
        if (unref(getProps).showAdvancedButton) {
          return cloneDeep(
            schemas.filter((schema) => schema.component !== 'Divider') as FormSchema[],
          );
        } else {
          return cloneDeep(schemas as FormSchema[]);
        }
      });

      const { handleToggleAdvanced, fieldsIsAdvancedMap } = useAdvanced({
        advanceState,
        emit,
        getProps,
        getSchema,
        formModel,
        defaultValueRef,
      });

      const { handleFormValues, initDefault } = useFormValues({
        getProps,
        defaultValueRef,
        getSchema,
        formModel,
      });

      useAutoFocus({
        getSchema,
        getProps,
        isInitedDefault: isInitedDefaultRef,
        formElRef: formElRef as Ref<FormActionType>,
      });

      const {
        handleSubmit,
        setFieldsValue,
        clearValidate,
        validate,
        validateFields,
        getFieldsValue,
        updateSchema,
        resetSchema,
        appendSchemaByField,
        removeSchemaByField,
        resetFields,
        scrollToField,
      } = useFormEvents({
        emit,
        getProps,
        formModel,
        getSchema,
        defaultValueRef,
        formElRef: formElRef as Ref<FormActionType>,
        schemaRef: schemaRef as Ref<FormSchema[]>,
        handleFormValues,
      });

      createFormContext({
        resetAction: resetFields,
        submitAction: handleSubmit,
      });

      watch(
        () => unref(getProps).model,
        () => {
          const { model } = unref(getProps);
          if (!model) return;
          setFieldsValue(model);
        },
        {
          immediate: true,
        },
      );

      watch(
        () => unref(getProps).schemas,
        (schemas) => {
          resetSchema(schemas ?? []);
        },
      );

      watch(
        () => getSchema.value,
        (schema) => {
          nextTick(() => {
            //  Solve the problem of modal adaptive height calculation when the form is placed in the modal
            modalFn?.redoModalHeight?.();
          });
          if (unref(isInitedDefaultRef)) {
            return;
          }
          if (schema?.length) {
            initDefault();
            isInitedDefaultRef.value = true;
          }
        },
      );

      watch(
        () => formModel,
        useDebounceFn(() => {
          unref(getProps).submitOnChange && handleSubmit();
        }, 300),
        { deep: true },
      );

      async function setProps(formProps: Partial<FormProps>): Promise<void> {
        propsRef.value = deepMerge(unref(propsRef) || {}, formProps);
      }

      function setFormModel(key: string, value: any, schema: FormSchema) {
        formModel[key] = value;
        emit('field-value-change', key, value);
        // TODO 优化验证，这里如果是autoLink=false手动关联的情况下才会再次触发此函数
        if (schema && schema.itemProps && !schema.itemProps.autoLink) {
          validateFields([key]).catch((_) => {});
        }
      }

      function handleEnterPress(e: KeyboardEvent) {
        const { autoSubmitOnEnter } = unref(getProps);
        if (!autoSubmitOnEnter) return;
        if (e.key === 'Enter' && e.target && e.target instanceof HTMLElement) {
          const target: HTMLElement = e.target as HTMLElement;
          if (target && target.tagName && target.tagName.toUpperCase() == 'INPUT') {
            handleSubmit();
          }
        }
      }

      const formActionType: Partial<FormActionType> = {
        getFieldsValue,
        setFieldsValue,
        resetFields,
        updateSchema,
        resetSchema,
        setProps,
        removeSchemaByField,
        appendSchemaByField,
        clearValidate,
        validateFields,
        validate,
        submit: handleSubmit,
        scrollToField: scrollToField,
      };

      onMounted(() => {
        initDefault();
        emit('register', formActionType);
      });

      return {
        getBindValue,
        handleToggleAdvanced,
        handleEnterPress,
        formModel,
        defaultValueRef,
        advanceState,
        getRow,
        getProps,
        formElRef,
        getSchema,
        formActionType: formActionType as any,
        setFormModel,
        getFormClass,
        getFormActionBindProps: computed(
          () =>
            ({ ...getProps.value, ...advanceState }) as InstanceType<typeof FormAction>['$props'],
        ),
        fieldsIsAdvancedMap,
        ...formActionType,
      };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-basic-form';

  .@{prefix-cls} {
    .ant-form-item {
      &-label label::after {
        margin: 0 6px 0 2px;
      }

      &-with-help {
        margin-bottom: 0;
      }

      &:not(.ant-form-item-with-help) {
        margin-bottom: 20px;
      }

      &.suffix-item {
        .ant-form-item-children {
          display: flex;
        }

        .ant-form-item-control {
          margin-top: 4px;
        }

        .suffix {
          display: inline-flex;
          align-items: center;
          margin-top: 1px;
          padding-left: 6px;
          line-height: 1;
        }
      }
    }

    .ant-form-explain {
      font-size: 14px;
    }

    &--compact {
      .ant-form-item {
        margin-bottom: 8px !important;
      }
    }
  }
</style>
