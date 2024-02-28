<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    :title="getTitle"
    @ok="handleSubmit"
    :width="570"
    destroyOnClose
    showFooter
  >
    <BasicForm @register="registerForm" />
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { useI18n } from '@/hooks/web/useI18n';
  import { ActionKey, createApi, getFormSchema, updateApi } from './data';
  import { BasicDrawer, useDrawerInner } from '@/components/Drawer';
  import { useMessage } from '@/hooks/web/useMessage';
  import { BasicForm, useForm } from '@/components/Form';
  import { BaseDataType, baseDataTypeMap } from '@/enums/baseDataType';

  const { t } = useI18n();

  const actionKey = ref<ActionKey>();
  const dataType = ref<BaseDataType>('PRODUCT');
  const rowId = ref<number>();
  const modalTitle = ref<string>('');
  const emit = defineEmits(['success', 'register']);
  const { createMessage: message } = useMessage();

  const [registerForm, { setFieldsValue, validate, resetSchema }] = useForm({
    labelWidth: 80,
    showActionButtonGroup: false,
    actionColOptions: {
      span: 23,
    },
  });

  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    setDrawerProps({ confirmLoading: false });

    actionKey.value = data?.actionKey;
    dataType.value = data?.type;
    modalTitle.value = baseDataTypeMap.get(data?.type) ?? '';

    resetSchema(getFormSchema(actionKey.value, data.type ?? ''));
    if (data?.record) {
      rowId.value = data?.record?.id;
      setFieldsValue({
        ...data.record,
      });
    }
  });

  const getTitle = computed(() => {
    const action = unref(actionKey);
    if (action === 'create') return t('common.addNewText') + modalTitle.value;
    if (action === 'edit') return t('common.editText') + modalTitle.value;
    return '';
  });
  async function handleSubmit() {
    try {
      const values = await validate();
      setDrawerProps({ confirmLoading: true });
      const action = unref(actionKey);
      const id = rowId.value;
      if (!dataType.value) throw new Error('dataType is undefined');
      if (action === 'create') await createApi(dataType.value, { ...values });
      if (action === 'edit') await updateApi(dataType.value, { id, ...values });
      message.success(t('common.saveSuccessMessage'));
      closeDrawer();
      emit('success', {
        actionKey: action,
        values: { ...values, id: rowId.value },
      });
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  }
</script>
