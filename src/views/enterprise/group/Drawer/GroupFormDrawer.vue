<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    :title="getTitle"
    @ok="handleSubmit"
    destroyOnClose
    showFooter
    isDetail
  >
    <BasicForm @register="registerForm" />
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { ActionKey, createApi, getFormSchema, modalTitle, updateApi, FormValue } from '../data';
  import { message } from 'ant-design-vue';
  import { cloneDeep } from 'lodash-es';
  import { useForm, BasicForm } from '@/components/Form';
  import { useDrawerInner, BasicDrawer } from '@/components/Drawer';

  const actionKey = ref<ActionKey>();
  const rowId = ref<number>(0);
  const emit = defineEmits(['success', 'register']);
  const [registerForm, { setFieldsValue, validate, resetSchema }] = useForm({
    // layout: 'vertical',
    labelWidth: 100,
    showActionButtonGroup: false,
  });

  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    actionKey.value = data?.actionKey;
    resetSchema(getFormSchema(actionKey.value));
    setDrawerProps({ confirmLoading: false });

    if (unref(actionKey) !== 'create') {
      const formData = cloneDeep(data.record);
      rowId.value = formData.id;
      setFieldsValue({
        ...formData,
      });
    }
  });

  const getTitle = computed(() => {
    const action = unref(actionKey);
    if (action === 'create') return '新建' + modalTitle;
    if (action === 'edit') return '编辑' + modalTitle;
    if (action === 'show') return '查看' + modalTitle;
    return '';
  });
  async function handleSubmit() {
    try {
      const values = (await validate()) as FormValue;

      setDrawerProps({ confirmLoading: true });
      const action = unref(actionKey);
      const id = rowId.value;
      if (action === 'create') {
        await createApi({ ...values });
        message.success(`新建${modalTitle}成功！`);
      } else if (action === 'edit') {
        await updateApi({ id, ...values });
        message.success('更新成功！');
      }
      closeDrawer();
      emit('success', {
        actionKey: unref(actionKey),
        values: { ...values, id: rowId.value },
      });
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  }
</script>
