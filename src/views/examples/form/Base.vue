<script lang="tsx">
  import { defineComponent } from 'compatible-vue';
  import { Divider } from 'ant-design-vue';

  import { BasicForm, useForm } from '@/components/form/index';

  import { basicSchema } from './demoData';
  export default defineComponent({
    setup() {
      const [register, { setProps }] = useForm({
        labelWidth: 100,
        actionColOptions: {
          span: 24,
        },
        schemas: basicSchema,
      });

      return () => (
        <div class="p-4">
          <Divider>功能,点击后如果需要还原在tab右键刷新页面即可</Divider>
          <a-button
            onClick={() => {
              setProps({ size: 'large' });
            }}
            class="mx-3"
          >
            更改表单size
          </a-button>
          <a-button
            onClick={() => {
              setProps({ labelWidth: 200 });
            }}
            class="mx-3"
          >
            更改labelWidth
          </a-button>
          <a-button
            onClick={() => {
              setProps({ labelAlign: 'left' });
            }}
            class="mx-3"
          >
            更改labelAlign
          </a-button>
          <a-button
            onClick={() => {
              setProps({ showActionButtonGroup: false });
            }}
            class="mx-3"
          >
            隐藏操作按钮
          </a-button>

          <a-button
            onClick={() => {
              setProps({ compact: true });
            }}
            class="mx-3"
          >
            紧凑表单
          </a-button>
          <a-button
            onClick={() => {
              setProps({ showResetButton: false });
            }}
            class="mx-3"
          >
            隐藏重置按钮
          </a-button>
          <a-button
            onClick={() => {
              setProps({
                resetButtonOptions: {
                  loading: true,
                  text: '清空',
                },
              });
            }}
            class="mx-3"
          >
            修改重置按钮
          </a-button>
          <a-button
            onClick={() => {
              setProps({ showSubmitButton: false });
            }}
            class="mx-3"
          >
            隐藏查询按钮
          </a-button>
          <a-button
            onClick={() => {
              setProps({
                submitButtonOptions: {
                  disabled: true,
                  text: '提交',
                },
              });
            }}
            class="mx-3"
          >
            修改查询按钮
          </a-button>
          <a-button
            onClick={() => {
              setProps({
                actionColOptions: {
                  span: 10,
                },
              });
            }}
            class="mx-3"
          >
            操作按钮位置
          </a-button>
          <a-button
            onClick={() => {
              setProps({ disabled: true });
            }}
            class="mx-3"
          >
            禁用表单
          </a-button>
          <Divider>JSON表单组件-基础示例</Divider>
          <BasicForm onRegister={register}></BasicForm>
        </div>
      );
    },
  });
</script>
