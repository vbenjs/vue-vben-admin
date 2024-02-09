<template>
  <BasicModal
    @register="registerModal"
    @ok="handleOk"
    :okText="$t('common.button.save')"
    :title="$t('common.button.add')"
  >
    <SysDeptEdit ref="formRef" filter-field />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { useModalInner, BasicModal } from '@/components/Modal';
  import { ref, unref } from 'vue';
  import { successMessage } from '@/utils/message/SystemNotice';
  import { useI18n } from '@/hooks/web/useI18n';

  import SysDeptEdit from './SysDeptEdit.vue';
  import { saveUpdateBatchApi } from '../SysDept.api';

  const emit = defineEmits(['after-save', 'register']);

  const { t } = useI18n();

  const formRef = ref();

  const [registerModal, { changeOkLoading, closeModal }] = useModalInner(async (data) => {
    await unref(formRef).resetFields({});
    await unref(formRef).setFieldsValue(data);
  });

  const handleOk = async () => {
    const model = await unref(formRef).validate();
    try {
      changeOkLoading(true);
      await saveUpdateBatchApi([model]);
      successMessage(t('common.message.saveSuccess'));
      closeModal();
      emit('after-save');
    } finally {
      changeOkLoading(false);
    }
  };
</script>

<style scoped></style>
