<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    :title="getTitle"
    @ok="handleSubmit"
    :width="450"
    destroyOnClose
    show-footer
  >
    <div class="mx-1">
      <BasicForm @register="registerForm" validateTrigger="blur" />
    </div>
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { getFormSchema, modalTitle, updateApi } from './data';
  import { message } from 'ant-design-vue';
  import { cloneDeep } from 'lodash-es';
  import { useForm, BasicForm } from '@/components/Form';
  import { useDrawerInner, BasicDrawer } from '@/components/Drawer';

  const rowId = ref<number>();
  const emit = defineEmits(['success', 'register']);

  const [registerForm, { setFieldsValue, validate, resetFields }] = useForm({
    layout: 'vertical',
    showActionButtonGroup: false,
    schemas: getFormSchema(),
  });

  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    setDrawerProps({ confirmLoading: false });
    resetFields();
    const formData = cloneDeep(data);
    setFieldsValue({
      ...formData,
    });
  });

  const getTitle = computed(() => {
    return '更新' + modalTitle;
  });
  async function handleSubmit() {
    try {
      const values = await validate();

      setDrawerProps({ confirmLoading: true });

      await updateApi(values as any);
      message.success('更新成功！');
      closeDrawer();
      emit('success', {
        values: { ...values, id: rowId.value },
      });
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  }
</script>
