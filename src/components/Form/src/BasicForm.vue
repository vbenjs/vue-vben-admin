<template>
  <Form v-bind="{ ...$attrs, ...$props }" ref="formElRef" :model="formModel">
    <Row :class="getProps.compact ? 'compact-form-row' : ''" :style="getRowWrapStyle">
      <slot name="formHeader" />
      <template v-for="schema in getSchema" :key="schema.field">
        <FormItem
          :tableAction="tableAction"
          :formActionType="formActionType"
          :schema="schema"
          :formProps="getProps"
          :allDefaultValues="defaultValueRef"
          :formModel="formModel"
          :setFormModel="setFormModel"
        >
          <template #[item]="data" v-for="item in Object.keys($slots)">
            <slot :name="item" v-bind="data" />
          </template>
        </FormItem>
      </template>

      <!--  -->
      <FormAction
        v-bind="{ ...getProps, ...advanceState }"
        @toggle-advanced="handleToggleAdvanced"
      />
      <slot name="formFooter" />
    </Row>
  </Form>
</template>
<script lang="ts">
  import type { FormActionType, FormProps, FormSchema } from './types/form';
  import type { AdvanceState } from './types/hooks';
  import type { CSSProperties, Ref, WatchStopHandle } from 'vue';

  import { defineComponent, reactive, ref, computed, unref, onMounted, watch, toRefs } from 'vue';
  import { Form, Row } from 'ant-design-vue';
  import FormItem from './components/FormItem';
  import FormAction from './components/FormAction.vue';

  import { dateItemType } from './helper';
  import moment from 'moment';
  import { cloneDeep } from 'lodash-es';
  import { deepMerge } from '/@/utils';

  import { useFormValues } from './hooks/useFormValues';
  import useAdvanced from './hooks/useAdvanced';
  import { useFormEvents } from './hooks/useFormEvents';
  import { createFormContext } from './hooks/useFormContext';

  import { basicProps } from './props';

  export default defineComponent({
    name: 'BasicForm',
    components: { FormItem, Form, Row, FormAction },
    inheritAttrs: false,
    props: basicProps,
    emits: ['advanced-change', 'reset', 'submit', 'register'],
    setup(props, { emit }) {
      const formModel = reactive<Recordable>({});

      const advanceState = reactive<AdvanceState>({
        isAdvanced: true,
        hideAdvanceBtn: false,
        isLoad: false,
        actionSpan: 6,
      });

      const defaultValueRef = ref<Recordable>({});
      const isInitedDefaultRef = ref(false);
      const propsRef = ref<Partial<FormProps>>({});
      const schemaRef = ref<Nullable<FormSchema[]>>(null);
      const formElRef = ref<Nullable<FormActionType>>(null);

      // Get the basic configuration of the form
      const getProps = computed(
        (): FormProps => {
          return deepMerge(cloneDeep(props), unref(propsRef));
        }
      );

      // Get uniform row style
      const getRowWrapStyle = computed(
        (): CSSProperties => {
          const { baseRowStyle = {} } = unref(getProps);
          return baseRowStyle;
        }
      );

      const getSchema = computed((): FormSchema[] => {
        const schemas: FormSchema[] = unref(schemaRef) || (unref(getProps).schemas as any);
        for (const schema of schemas) {
          const { defaultValue, component } = schema;
          // handle date type
          if (defaultValue && dateItemType.includes(component)) {
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

      const { handleToggleAdvanced } = useAdvanced({
        advanceState,
        emit,
        getProps,
        getSchema,
        formModel,
        defaultValueRef,
      });

      const { transformDateFunc, fieldMapToTime } = toRefs(props);

      const { handleFormValues, initDefault } = useFormValues({
        transformDateFuncRef: transformDateFunc,
        fieldMapToTimeRef: fieldMapToTime,
        defaultValueRef,
        getSchema,
        formModel,
      });

      const {
        handleSubmit,
        setFieldsValue,
        clearValidate,
        validate,
        validateFields,
        getFieldsValue,
        updateSchema,
        appendSchemaByField,
        removeSchemaByFiled,
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
        }
      );

      const stopWatch: WatchStopHandle = watch(
        () => getSchema.value,
        (schema) => {
          if (unref(isInitedDefaultRef)) {
            return stopWatch();
          }
          if (schema?.length) {
            initDefault();
            isInitedDefaultRef.value = true;
          }
        }
      );

      async function setProps(formProps: Partial<FormProps>): Promise<void> {
        propsRef.value = deepMerge(unref(propsRef) || {}, formProps);
      }

      function setFormModel(key: string, value: any) {
        formModel[key] = value;
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
        handleToggleAdvanced,
        formModel,
        defaultValueRef,
        advanceState,
        getRowWrapStyle,
        getProps,
        formElRef,
        getSchema,
        formActionType,
        setFormModel,
        ...formActionType,
      };
    },
  });
</script>
