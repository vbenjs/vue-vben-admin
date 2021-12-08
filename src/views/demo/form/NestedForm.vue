<template>
  <PageWrapper title="JSON嵌套表单示例">
    <CollapseContainer title="嵌套表单">
      <BasicForm @register="register" @submit="handleSubmit" ref="formElRef" />
      <a-button @click="handleAppendSchema">appendSchema</a-button>
      <a-button @click="handleRemoveSchema">removeSchema</a-button>
      <a-button @click="handleUpdateSchema">updateSchema</a-button>
    </CollapseContainer>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { CollapseContainer } from '/@/components/Container';
  import { PageWrapper } from '/@/components/Page';

  export default defineComponent({
    components: { BasicForm, CollapseContainer, PageWrapper },
    setup() {
      const [register, { validate, appendSchemaByField, removeSchemaByFiled, updateSchema }] =
        useForm({
          schemas: [
            {
              field: 'field1',
              component: 'Input',
              label: '字段1',
              colProps: {
                span: 12,
              },
              required: true,
              defaultValue: 1,
            },
            {
              field: 'flatField.field',
              component: 'Input',
              label: '扁平化字段1',
              colProps: {
                span: 12,
              },
              required: true,
              defaultValue: 2,
            },
            {
              field: 'nestedField.field'.split('.'),
              component: 'Input',
              label: '嵌套字段1',
              colProps: {
                span: 12,
              },
              required: true,
              defaultValue: 2,
            },
          ],
          labelWidth: 100,
          actionColOptions: { span: 24 },
        });

      async function handleSubmit() {
        try {
          const data = await validate();
          console.log(data);
        } catch (e) {
          console.log(e);
        }
      }

      function handleAppendSchema() {
        appendSchemaByField(
          {
            field: 'appendField',
            component: 'Input',
            label: 'appendField',
            colProps: {
              span: 12,
            },
            required: true,
            defaultValue: 2,
          },
          'nestedField.field'.split('.'),
        );
      }

      function handleRemoveSchema() {
        removeSchemaByFiled('field1');
      }
      function handleUpdateSchema() {
        updateSchema({
          field: 'field1',
          component: 'Input',
          label: '更新字段1',
          colProps: {
            span: 12,
          },
          required: true,
          defaultValue: 1,
        });
        updateSchema([
          {
            field: 'flatField.field',
            component: 'Input',
            label: '更新扁平化字段1',
            colProps: {
              span: 12,
            },
            required: true,
            defaultValue: 2,
          },
          {
            field: 'nestedField.field'.split('.'),
            component: 'Input',
            label: '更新嵌套字段1',
            colProps: {
              span: 12,
            },
            required: true,
            defaultValue: 2,
          },
        ]);
      }

      return { register, handleSubmit, handleAppendSchema, handleRemoveSchema, handleUpdateSchema };
    },
  });
</script>
