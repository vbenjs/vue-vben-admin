<template>
  <CollapseContainer title="基本设置" :canExpan="false">
    <BasicForm @register="register" />
    <Button type="primary" @click="handleSubmit">更新基本信息</Button>
  </CollapseContainer>
</template>
<script lang="ts">
  import { Button } from 'ant-design-vue';
  import { defineComponent, onMounted } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { CollapseContainer } from '/@/components/Container/index';

  import { useMessage } from '/@/hooks/web/useMessage';

  import { accountInfoApi } from '/@/api/demo/account';
  import { baseSetschemas } from './data';

  export default defineComponent({
    components: { BasicForm, CollapseContainer, Button },
    setup() {
      const { createMessage } = useMessage();

      const [register, { setFieldsValue }] = useForm({
        labelWidth: 120,
        schemas: baseSetschemas,
        showActionButtonGroup: false,
      });

      onMounted(async () => {
        const data = await accountInfoApi();
        setFieldsValue(data);
      });

      return {
        register,
        handleSubmit: () => {
          createMessage.success('更新成功！');
        },
      };
    },
  });
</script>
