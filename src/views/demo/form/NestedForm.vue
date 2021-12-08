<template>
  <PageWrapper title="JSON嵌套表单示例">
    <div class="mb-4">
      <a-button @click="handleAppendSchema" class="mr-2">追加Schema</a-button>
      <a-button @click="handleRemoveSchema" class="mr-2">删除Schema</a-button>
      <a-button @click="handleUpdateSchema" class="mr-2">更新Schema</a-button>
    </div>
    <CollapseContainer title="嵌套表单">
      <BasicForm @register="register" @submit="handleSubmit" ref="formElRef" />
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
              defaultValue: 3,
            },
            {
              field: 'nestedArrayField.0.field'.split('.'),
              component: 'Input',
              label: '嵌套数组字段1',
              colProps: {
                span: 12,
              },
              required: true,
              defaultValue: 4,
            },
            {
              field: 'nestedArrayField.1.nestField.field1'.split('.'),
              component: 'Input',
              label: '嵌套数组嵌套字段1',
              colProps: {
                span: 12,
              },
              required: true,
              defaultValue: 5,
            },
          ],
          labelWidth: 200,
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
            label: '追加字段',
            colProps: {
              span: 12,
            },
            required: true,
            defaultValue: 6,
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
          defaultValue: 11,
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
            defaultValue: 22,
          },
          {
            field: 'nestedField.field'.split('.'),
            component: 'Input',
            label: '更新嵌套字段1',
            colProps: {
              span: 12,
            },
            required: true,
            defaultValue: 33,
          },
          {
            field: 'nestedArrayField.0.field'.split('.'),
            component: 'Input',
            label: '更新嵌套数组字段1',
            colProps: {
              span: 12,
            },
            required: true,
            defaultValue: 44,
          },
        ]);
      }

      return { register, handleSubmit, handleAppendSchema, handleRemoveSchema, handleUpdateSchema };
    },
  });
</script>
