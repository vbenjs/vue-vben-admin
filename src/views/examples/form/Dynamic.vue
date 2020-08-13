<script lang="tsx">
  import { defineComponent } from 'compatible-vue';
  import { Divider } from 'ant-design-vue';

  import { BasicForm, useForm } from '@/components/form/index';

  import { dynamicSchema } from './demoData';
  export default defineComponent({
    name: 'DynamicFormDemo',
    setup() {
      const [register, { updateSchema, appendSchemaByField, removeSchemaByFiled }] = useForm({
        labelWidth: 100,
        actionColOptions: {
          span: 24,
        },
        schemas: dynamicSchema,
      });
      function updateLabel() {
        updateSchema({
          field: 'field1',
          label: '字段1-1',
        });
      }
      function updateLabel12() {
        updateSchema([
          {
            field: 'field1',
            label: '字段1-1',
          },
          {
            field: 'field2',
            label: '字段2-2',
          },
        ]);
      }
      function insertField3() {
        appendSchemaByField(
          {
            field: 'field33',
            label: '字段3',
            component: 'Input',
            colProps: {
              span: 24,
            },
          },
          'field1'
        );
      }
      function removefield2() {
        removeSchemaByFiled('field2');
      }
      return () => (
        <div class="p-4">
          <Divider>功能,点击后如果需要还原在tab右键刷新页面即可</Divider>
          <a-button onClick={updateLabel} class="mx-3">
            更改字段1Label
          </a-button>
          <a-button onClick={updateLabel12} class="mx-3">
            更改字段1,2Label
          </a-button>
          <a-button onClick={insertField3} class="mx-3">
            往字段1后面插入字段3
          </a-button>
          <a-button onClick={removefield2} class="mx-3">
            删除字段2
          </a-button>

          <Divider>JSON表单组件-动态表单示例</Divider>
          <BasicForm onRegister={register}></BasicForm>
        </div>
      );
    },
  });
</script>
