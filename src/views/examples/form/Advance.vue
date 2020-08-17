<script lang="tsx">
  import { defineComponent } from 'compatible-vue';
  import { Divider, Alert } from 'ant-design-vue';

  import { BasicForm, useForm } from '@/components/form/index';
  // import { useMessage } from '@/hooks/core/useMessage';
  import { getAdvanceSchema } from './demoData';
  export default defineComponent({
    setup() {
      // const { createMessage } = useMessage();
      const [register] = useForm({
        labelWidth: 100,
        compact: true,
        showAdvancedButton: true,
        schemas: getAdvanceSchema(6),
      });

      const [register1] = useForm({
        labelWidth: 100,
        compact: true,
        // 默认3行
        autoAdvancedLine: 3,
        showAdvancedButton: true,
        schemas: getAdvanceSchema(9),
      });
      const [register2] = useForm({
        labelWidth: 100,
        compact: true,
        // 默认3行
        autoAdvancedLine: 3,
        showAdvancedButton: true,
        schemas: getAdvanceSchema(4),
      });
      const [register3] = useForm({
        labelWidth: 100,
        compact: true,
        // 默认3行
        autoAdvancedLine: 3,
        showAdvancedButton: true,
        schemas: getAdvanceSchema(5),
      });

      return () => (
        <div class="p-4">
          <Alert message="响应式判断是否收起，只需要配置参数 showAdvancedButton:true 开启即可" />
          <Divider>拖动窗口，会进行响应式判断</Divider>

          <Divider>JSON表单组件-表单收起/展开基础示例</Divider>
          <BasicForm onRegister={register}></BasicForm>

          <Divider>JSON表单组件-超过3行自动收起</Divider>
          <BasicForm onRegister={register1}></BasicForm>

          <Divider>JSON表单组件-自动计算action操作按钮列宽度，无需传递操作列宽度</Divider>
          <BasicForm onRegister={register2}></BasicForm>
          <Divider />
          <BasicForm onRegister={register3}></BasicForm>
        </div>
      );
    },
  });
</script>
