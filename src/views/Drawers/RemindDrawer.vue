<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    :title="getTitle"
    @ok="handleSubmit"
    :width="578"
    destroyOnClose
    showFooter
  >
    <BasicForm @register="registerForm" />
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { ref, computed, PropType } from 'vue';
  import { message } from 'ant-design-vue';
  import { cloneDeep } from 'lodash-es';
  import { useForm, BasicForm } from '@/components/Form';
  import { useDrawerInner, BasicDrawer } from '@/components/Drawer';

  const props = defineProps({
    updateApi: {
      type: Function as PropType<(data: any) => Promise<any>>,
      required: true,
    },
    field: {
      type: String,
      default: 'mark',
    },
  });

  const rowId = ref<number>();
  const emit = defineEmits(['success', 'register']);
  const [registerForm, { setFieldsValue, validate, resetFields }] = useForm({
    layout: 'vertical',
    labelWidth: 60,
    showActionButtonGroup: false,
    schemas: [
      {
        label: 'id',
        field: 'id',
        component: 'Input',
        show: false,
      },
      {
        label: '',
        field: props.field,
        component: 'InputTextArea',
        componentProps: {
          placeholder: '请输入备注',
          autoSize: { minRows: 8 },
        },
        colProps: { span: 24 },
      },
    ],
  });

  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    resetFields();
    setDrawerProps({ confirmLoading: false });

    const formData = cloneDeep(data.record);
    rowId.value = formData.id;
    setFieldsValue({
      ...formData,
    });
  });

  const getTitle = computed(() => {
    return '更新备注信息';
  });
  async function handleSubmit() {
    try {
      const values = await validate();
      setDrawerProps({ confirmLoading: true });
      const id = rowId.value;
      await props.updateApi({ id, ...values });
      message.success('更新成功！');
      closeDrawer();
      emit('success', { action: 'edit', values: { ...values, id: rowId.value } });
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  }
</script>
