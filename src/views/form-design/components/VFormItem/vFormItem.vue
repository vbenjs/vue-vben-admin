<!--
 * @Description:
   `<FormItem`
    :tableAction="tableAction"
    :formActionType="formActionType"
    :schema="schema2"
    :formProps="getProps"
    :allDefaultValues="defaultValueRef"
    :formModel="formModel"
    :setFormModel="setFormModel"
  >
-->

<template>
  <FormItem :schema="schemaNew" :formProps="getProps">
    <template #[item]="data" v-for="item in Object.keys($slots)">
      <slot :name="item" v-bind="data || {}"></slot>
    </template>
  </FormItem>
</template>
<script lang="ts">
  import { computed, defineComponent, unref } from 'vue';
  import { IFormConfig, IVFormComponent } from '../../typings/v-form-component';
  import { FormProps, FormSchema } from '@/components/Form';

  import FormItem from '@/components/Form/src/components/FormItem.vue';

  export default defineComponent({
    name: 'VFormItem',
    components: {
      FormItem,
    },
    props: {
      formData: {
        type: Object,
        default: () => ({}),
      },
      schema: {
        type: Object as PropType<IVFormComponent>,
        required: true,
      },
      formConfig: {
        type: Object as PropType<IFormConfig>,
        required: true,
      },
    },
    setup(props) {
      const schema = computed(() => {
        const schema: FormSchema = {
          ...unref(props.schema),
        } as FormSchema;

        return schema;
      });

      // Get the basic configuration of the form
      const getProps = computed((): FormProps => {
        return { ...unref(props.formConfig) } as FormProps;
      });
      return {
        schemaNew: schema,
        getProps,
      };
    },
  });
</script>

<style lang="less" scoped></style>
