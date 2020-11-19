<template>
  <Form v-bind="{ ...$attrs, ...$props }" ref="formElRef" :model="formModel">
    <Row :class="getProps.compact ? 'compact-form-row' : ''">
      <slot name="formHeader" />
      <template v-for="schema in getSchema" :key="schema.field">
        <FormItem
          :tableAction="tableAction"
          :formActionType="formActionType"
          :schema="schema"
          :formProps="getProps"
          :allDefaultValues="defaultValueRef"
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
  import type { AdvanceState } from './types/hooks';
  import type { Ref, WatchStopHandle } from 'vue';
  import type { ValidateFields } from 'ant-design-vue/lib/form/interface';

  import { defineComponent, reactive, ref, computed, unref, toRef, onMounted, watch } from 'vue';
  import { Form, Row } from 'ant-design-vue';
  import FormItem from './FormItem';
  import { basicProps } from './props';
  import FormAction from './FormAction';

  import { dateItemType } from './helper';
  import moment from 'moment';
  import { cloneDeep } from 'lodash-es';
  import { deepMerge } from '/@/utils';

  import { useFormValues } from './hooks/useFormValues';
  import useAdvanced from './hooks/useAdvanced';
  import { useFormAction } from './hooks/useFormAction';
  export default defineComponent({
    name: 'BasicForm',
    components: { FormItem, Form, Row, FormAction },
    inheritAttrs: false,
    props: basicProps,
    emits: ['advanced-change', 'reset', 'submit', 'register'],
    setup(props, { emit }) {
      const formModel = reactive({});

      const actionState = reactive({
        resetAction: {},
        submitAction: {},
      });

      const advanceState = reactive<AdvanceState>({
        isAdvanced: true,
        hideAdvanceBtn: false,
        isLoad: false,
        actionSpan: 6,
      });

      const defaultValueRef = ref<any>({});
      const isInitedDefaultRef = ref(false);
      const propsRef = ref<Partial<FormProps>>({});
      const schemaRef = ref<Nullable<FormSchema[]>>(null);
      const formElRef = ref<Nullable<FormActionType>>(null);

      const getMergePropsRef = computed(
        (): FormProps => {
          return deepMerge(cloneDeep(props), unref(propsRef));
        }
      );

      // 获取表单基本配置
      const getProps = computed(
        (): FormProps => {
          return {
            ...unref(getMergePropsRef),
            resetButtonOptions: deepMerge(
              actionState.resetAction,
              unref(getMergePropsRef).resetButtonOptions || {}
            ),
            submitButtonOptions: deepMerge(
              actionState.submitAction,
              unref(getMergePropsRef).submitButtonOptions || {}
            ),
          };
        }
      );

      const getSchema = computed((): FormSchema[] => {
        const schemas: FormSchema[] = unref(schemaRef) || (unref(getProps).schemas as any);
        for (const schema of schemas) {
          const { defaultValue, component } = schema;
          if (defaultValue && dateItemType.includes(component!)) {
            if (!Array.isArray(defaultValue)) {
              schema.defaultValue = moment(defaultValue);
            } else {
              const def: moment.Moment[] = [];
              defaultValue.forEach((item) => {
                def.push(moment(item));
              });
              schema.defaultValue = def;
            }
          }
        }
        return schemas as FormSchema[];
      });

      const { getActionPropsRef, handleToggleAdvanced } = useAdvanced({
        advanceState,
        emit,
        getMergePropsRef,
        getProps,
        getSchema,
        formModel,
        defaultValueRef,
      });

      const { handleFormValues, initDefault } = useFormValues({
        transformDateFuncRef: toRef(props, 'transformDateFunc') as Ref<Fn<any>>,
        fieldMapToTimeRef: toRef(props, 'fieldMapToTime'),
        defaultValueRef,
        getSchema,
        formModel,
      });

      const {
        // handleSubmit,
        setFieldsValue,
        clearValidate,
        validate,
        validateFields,
        getFieldsValue,
        updateSchema,
        appendSchemaByField,
        removeSchemaByFiled,
        resetFields,
      } = useFormAction({
        emit,
        getProps,
        formModel,
        getSchema,
        defaultValueRef,
        formElRef: formElRef as Ref<FormActionType>,
        schemaRef: schemaRef as Ref<FormSchema[]>,
        handleFormValues,
        actionState,
      });

      watch(
        () => unref(getMergePropsRef).model,
        () => {
          if (!unref(getMergePropsRef).model) return;
          setFieldsValue(unref(getMergePropsRef).model);
        },
        {
          immediate: true,
        }
      );

      const stopWatch: WatchStopHandle = watch(
        () => getSchema.value,
        (schema) => {
          if (unref(isInitedDefaultRef)) {
            return stopWatch();
          }
          if (schema && schema.length) {
            initDefault();
            isInitedDefaultRef.value = true;
          }
        }
      );

      function setProps(formProps: Partial<FormProps>): void {
        const mergeProps = deepMerge(unref(propsRef) || {}, formProps);
        propsRef.value = mergeProps;
      }

      const formActionType: Partial<FormActionType> = {
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
        initDefault();
        emit('register', formActionType);
      });

      return {
        handleToggleAdvanced,
        formModel,
        getActionPropsRef,
        defaultValueRef,
        advanceState,
        getProps,
        formElRef,
        getSchema,
        formActionType,
        ...formActionType,
      };
    },
  });
</script>
