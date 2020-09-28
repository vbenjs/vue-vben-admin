<template>
  <div class="m-4">
    <div class="mb-4">
      <a-button @click="changeLabel3" class="mr-2">更改字段3label</a-button>
      <a-button @click="changeLabel34" class="mr-2">同时更改字段3,4label</a-button>
      <a-button @click="appendField" class="mr-2">往字段3后面插入字段10</a-button>
      <a-button @click="deleteField" class="mr-2">删除字段11</a-button>
    </div>
    <div class="mb-4"> </div>
    <CollapseContainer title="动态表单示例,动态根据表单内其他值改变">
      <BasicForm @register="register" />
    </CollapseContainer>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form/index';
  import { CollapseContainer } from '/@/components/Container/index';
  const schemas: FormSchema[] = [
    {
      field: 'field1',
      component: 'Input',
      label: '字段1',
      colProps: {
        span: 8,
      },
      show: ({ values }) => {
        return !!values.field5;
      },
    },
    {
      field: 'field2',
      component: 'Input',
      label: '字段2',
      colProps: {
        span: 8,
      },
      ifShow: ({ values }) => {
        return !!values.field6;
      },
    },
    {
      field: 'field3',
      component: 'DatePicker',
      label: '字段3',
      colProps: {
        span: 8,
      },
      dynamicDisabled: ({ values }) => {
        return !!values.field7;
      },
    },
    {
      field: 'field4',
      component: 'Select',
      label: '字段4',
      colProps: {
        span: 8,
      },
      dynamicRules: ({ values }) => {
        return values.field8 ? [{ required: true, message: '字段4必填' }] : [];
      },
      componentProps: {
        options: [
          {
            label: '选项1',
            value: '1',
            key: '1',
          },
          {
            label: '选项2',
            value: '2',
            key: '2',
          },
        ],
      },
    },
    {
      field: 'field11',
      component: 'DatePicker',
      label: '字段11',
      colProps: {
        span: 8,
      },
    },
    {
      field: 'field5',
      component: 'Switch',
      label: '是否显示字段1(css控制)',
      colProps: {
        span: 8,
      },
      labelWidth: 200,
    },
    {
      field: 'field6',
      component: 'Switch',
      label: '是否显示字段2(dom控制)',
      colProps: {
        span: 8,
      },
      labelWidth: 200,
    },
    {
      field: 'field7',
      component: 'Switch',
      label: '是否禁用字段3',
      colProps: {
        span: 8,
      },
      labelWidth: 200,
    },
    {
      field: 'field8',
      component: 'Switch',
      label: '字段4是否必填',
      colProps: {
        span: 8,
      },
      labelWidth: 200,
    },
  ];

  export default defineComponent({
    components: { BasicForm, CollapseContainer },
    setup() {
      const [
        register,
        { setProps, updateSchema, appendSchemaByField, removeSchemaByFiled },
      ] = useForm({
        labelWidth: 120,
        schemas,
        actionColOptions: {
          span: 24,
        },
      });
      function changeLabel3() {
        updateSchema({
          field: 'field3',
          label: '字段3 New',
        });
      }
      function changeLabel34() {
        updateSchema([
          {
            field: 'field3',
            label: '字段3 New++',
          },
          {
            field: 'field4',
            label: '字段4 New++',
          },
        ]);
      }

      function appendField() {
        appendSchemaByField(
          {
            field: 'field10',
            label: '字段10',
            component: 'Input',
            colProps: {
              span: 8,
            },
          },
          'field3'
        );
      }
      function deleteField() {
        removeSchemaByFiled('field11');
      }
      return {
        register,
        schemas,
        setProps,
        changeLabel3,
        changeLabel34,
        appendField,
        deleteField,
      };
    },
  });
</script>
