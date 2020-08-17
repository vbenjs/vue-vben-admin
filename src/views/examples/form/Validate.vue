<script lang="tsx">
  import { defineComponent } from 'compatible-vue';
  import { Divider } from 'ant-design-vue';

  import { BasicForm, useForm } from '@/components/form/index';
  import { useMessage } from '@/hooks/core/useMessage';
  import { validateSchema } from './demoData';
  export default defineComponent({
    setup() {
      const { createMessage } = useMessage();
      const [register, { validateFieldsAndScroll, getFieldsValue, setFieldsValue }] = useForm({
        labelWidth: 100,
        actionColOptions: {
          span: 24,
        },
        schemas: validateSchema,
      });
      async function validateForm() {
        const { values, err } = await validateFieldsAndScroll();
        if (err) {
          return;
        }
        createMessage.success(JSON.stringify(values));
      }
      function handleGetFieldValue() {
        const val = getFieldsValue();
        createMessage.success(JSON.stringify(val));
      }
      function handleSetFieldsValue() {
        setFieldsValue({
          field1: '1',
          field2: '2',
          field3: '1',
        });
      }
      return () => (
        <div class="p-4">
          <Divider>功能,点击后如果需要还原在tab右键刷新页面即可</Divider>
          <a-button onClick={validateForm} class="mx-3">
            手动校验表单
          </a-button>

          <a-button onClick={handleGetFieldValue} class="mx-3">
            获取表单值
          </a-button>

          <a-button onClick={handleSetFieldsValue} class="mx-3">
            设置表单值
          </a-button>

          <Divider>JSON表单组件-表单校验示例</Divider>
          <BasicForm
            onRegister={register}
            onChange={(val: any) => {
              createMessage.success(JSON.stringify(val));

              console.log('点击查询按钮:校验通过触发', val);
            }}
          ></BasicForm>
        </div>
      );
    },
  });
</script>
