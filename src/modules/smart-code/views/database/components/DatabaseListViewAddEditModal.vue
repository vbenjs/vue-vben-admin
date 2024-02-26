<template>
  <BasicModal
    v-bind="$attrs"
    :title="isAddRef ? $t('common.button.add') : $t('common.button.edit')"
    :width="700"
    @ok="handleSave"
    @register="registerModal"
  >
    <BasicForm @register="registerAddEditForm" :size="getFormSize" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { useI18n } from '@/hooks/web/useI18n';

  import { BasicModal, useModalInner } from '@/components/Modal';
  import BasicForm from '@/components/Form/src/BasicForm.vue';
  import { useForm } from '@/components/Form';
  import { addEditForm } from '@/modules/codeGenerator/views/database/DatabaseListView.data';

  import { useSizeSetting } from '@/hooks/setting/UseSizeSetting';

  import { getByIdApi, saveUpdateApi } from '../DatabaseListView.api';

  const emit = defineEmits(['success', 'register']);

  const { t } = useI18n();
  const { getFormSize } = useSizeSetting();
  const isAddRef = ref(true);

  const [registerAddEditForm, { setFieldsValue, resetFields, validate }] = useForm({
    schemas: addEditForm(t),
    baseColProps: {
      span: 24,
    },
    labelCol: {
      span: 5,
    },
    wrapperCol: {
      span: 18,
    },
    // @ts-ignore
    showActionButtonGroup: false,
  });

  const [registerModal, { changeLoading, closeModal }] = useModalInner(async ({ isAdd, id }) => {
    await resetFields();
    isAddRef.value = isAdd;
    if (!isAdd) {
      changeLoading(true);
      try {
        const result = await getByIdApi(id);
        await setFieldsValue({
          ...result,
        });
      } finally {
        changeLoading(false);
      }
    }
  });

  /**
   * 执行保存操作
   */
  const handleSave = async () => {
    const model = await validate();
    changeLoading(true);
    try {
      await saveUpdateApi(model);
      closeModal();
      emit('success');
    } finally {
      changeLoading(false);
    }
  };
</script>
