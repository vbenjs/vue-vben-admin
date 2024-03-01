<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="getTitle"
    @ok="handleSubmit"
    :can-fullscreen="false"
    :width="578"
    destroyOnClose
    :show-ok-btn="actionKey !== 'show'"
  >
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { ActionKey, createApi, getFormSchema, modalTitle, updateApi } from '../data';
  import { message } from 'ant-design-vue';
  import { cloneDeep } from 'lodash-es';
  import { useForm, BasicForm } from '@/components/Form';
  import { useModalInner, BasicModal } from '@/components/Modal';

  const actionKey = ref<ActionKey>();
  const rowId = ref<number>();
  const emit = defineEmits(['success', 'register']);
  const [registerForm, { setFieldsValue, validate, resetSchema }] = useForm({
    // layout: 'vertical',
    labelWidth: 100,
    showActionButtonGroup: false,
  });

  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    actionKey.value = data?.actionKey;
    resetSchema(getFormSchema(data));
    setModalProps({ confirmLoading: false });

    if (unref(actionKey) !== 'create') {
      const formData = cloneDeep(data.record);
      rowId.value = formData.id;

      formData.messages = formData.messages?.map((item) => item.id);
      formData.attributes = formData.attributes?.map((item) => item.id);
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
      const values = await validate();
      values.messages = values.messages?.map((id: number | string) => ({ id }));
      values.attributes = values.attributes?.map((id: number | string) => ({
        id,
      }));

      setModalProps({ confirmLoading: true });
      const action = unref(actionKey);
      const id = rowId.value;
      if (action === 'create') {
        await createApi({ ...values });
        message.success(`新建${modalTitle}成功！`);
      }
      if (action === 'edit') {
        await updateApi({ id, ...values });
        message.success('更新成功！');
      }
      closeModal();
      emit('success', {
        actionKey: unref(actionKey),
        values: { ...values, id: rowId.value },
      });
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>
