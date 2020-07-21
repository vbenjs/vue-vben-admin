<script lang="tsx">
  import { defineComponent } from 'compatible-vue';
  import { Divider, Button } from 'ant-design-vue';

  import { BasicForm, useForm } from '@/components/form/index';
  import { useMessage } from '@/hooks/core/useMessage';
  import { customSchema } from './demoData';
  export default defineComponent({
    name: 'CustomFormDemo',
    setup() {
      const { createMessage } = useMessage();
      const [register, { validateFieldsAndScroll }] = useForm({
        labelWidth: 100,
        actionColOptions: {
          span: 24,
        },
        schemas: customSchema,
      });
      async function validateForm() {
        const { values, err } = await validateFieldsAndScroll();
        if (err) {
          return;
        }
        createMessage.success(JSON.stringify(values));
      }

      return () => (
        <div class="p-4">
          <Divider>功能,点击后如果需要还原在tab右键刷新页面即可</Divider>
          <Button onClick={validateForm} class="mx-3">
            手动校验表单
          </Button>

          <Divider>JSON表单组件-自定义组件示例</Divider>
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
