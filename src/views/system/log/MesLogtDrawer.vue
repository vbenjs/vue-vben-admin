<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    :title="getTitle"
    :width="500"
    destroyOnClose
  >
    <BasicForm @register="registerForm" />
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { useDrawerInner, BasicDrawer } from '@/components/Drawer';
  import { useForm, BasicForm } from '@/components/Form';
  import { getMesLogById } from '@/api/system/logs';

  const emit = defineEmits(['register', 'success']);

  const [registerForm, { setFieldsValue }] = useForm({
    layout: 'vertical',
    labelWidth: 100,
    schemas: [
      {
        label: '',
        field: 'content',
        component: 'InputTextArea',
        componentProps: {
          readonly: true,
          style: { height: 'calc(100vh - 100px)' },
        },
        colProps: { span: 24 },
      },
    ],
    compact: true,
    showActionButtonGroup: false,
    // showResetButton: false,
    actionColOptions: { span: 24 },
  });

  const [registerDrawer, { setDrawerProps }] = useDrawerInner(async (id) => {
    setDrawerProps({ confirmLoading: false });

    const data = await getMesLogById(id);
    setFieldsValue(data);
  });

  const getTitle = '内容详情';
</script>
