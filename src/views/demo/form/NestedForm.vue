<template>
  <PageWrapper title="JSON嵌套表单示例">
    <div class="mb-4">
      <a-button @click="handleAppendSchema" class="mr-2">追加Schema</a-button>
      <a-button @click="handleRemoveSchema" class="mr-2">删除Schema</a-button>
      <a-button @click="handleUpdateSchema" class="mr-2">更新Schema</a-button>
      <a-button @click="handleSetFieldsValue" class="mr-2">设置表单值</a-button>
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
      const [
        register,
        { appendSchemaByField, removeSchemaByFiled, updateSchema, validate, setFieldsValue },
      ] = useForm({
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
            field: ['nestedArrayField', 0, 'field'],
            component: 'Input',
            label: '嵌套数组字段1',
            colProps: {
              span: 12,
            },
            required: true,
            defaultValue: 4,
          },
          {
            field: ['nestedArrayField', 2],
            component: 'Input',
            label: '嵌套数组字段2',
            colProps: {
              span: 12,
            },
            required: true,
            defaultValue: 5,
          },
          {
            field: ['nestedArrayField', 1, 'nestField', 'field1'],
            component: 'Input',
            label: '嵌套数组嵌套字段1',
            colProps: {
              span: 12,
            },
            required: true,
            defaultValue: 6,
          },
          {
            field: ['array', 0],
            component: 'Input',
            label: '数组',
            colProps: {
              span: 12,
            },
            required: true,
            defaultValue: 7,
          },
          {
            field: 'fieldDate',
            component: 'DatePicker',
            label: '日期字段',
            colProps: {
              span: 12,
            },
          },
          {
            field: 'fieldTime',
            component: 'RangePicker',
            label: '时间字段',
            colProps: {
              span: 12,
            },
          },
          {
            field: 'nestedField.fieldTime'.split('.'),
            component: 'RangePicker',
            label: '嵌套时间字段',
            colProps: {
              span: 12,
            },
          },
        ],
        labelWidth: 200,
        actionColOptions: { span: 24 },
        fieldMapToTime: [
          // data为时间组件在表单内的字段，startTime，endTime为转化后的开始时间于结束时间
          // 'YYYY-MM-DD'为时间格式，参考moment
          [
            'nestedField.fieldTime'.split('.'),
            [
              'nestedField.fieldTime.startTime'.split('.'),
              'nestedField.fieldTime.endTime'.split('.'),
            ],
            'YYYY-MM-DD',
          ],
          ['fieldTime', ['startTime', 'endTime'], 'YYYY-MM-DD'],
        ],
      });

      async function handleSubmit(values) {
        try {
          let data = await validate();
          console.log('data=', JSON.stringify(data));
          console.log('values=', JSON.stringify(values));
        } catch (e) {
          console.log('error', e);
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

      function handleSetFieldsValue() {
        setFieldsValue({
          test: 1,
          field1: 11,
          'flatField.field': 22,
          nestedField: {
            field: 33,
            fieldTime: ['2020-12-14 10:39:44', '2020-12-26 10:39:44'],
            // fieldTime: { startTime: '2020-12-14 10:39:44', endTime: '2020-12-26 10:39:44' },
          },
          nestedArrayField: [{ field: '44' }, { nestField: { field1: 66 } }, 55],
          array: [77],
          // fieldTime: ['2020-12-14 10:38:27', '2020-12-17 10:38:27'],
          // fieldTime: null,
          startTime: '2019-12-14 10:38:27',
          endTime: '2019-12-17 10:38:27',
        });
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
            field: ['nestedArrayField', 1, 'nestField', 'field1'],
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

      return {
        register,
        handleSubmit,
        handleAppendSchema,
        handleRemoveSchema,
        handleUpdateSchema,
        handleSetFieldsValue,
      };
    },
  });
</script>
