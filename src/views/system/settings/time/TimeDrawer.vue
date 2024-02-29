<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    :title="getTitle"
    @ok="handleSubmit"
    :maskClosable="true"
    showFooter
    :width="578"
    destroyOnClose
  >
    <BasicForm @register="registerForm" />
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { ActionKey, createApi, getFormSchema, modalTitle, updateApi } from './data';
  import { message } from 'ant-design-vue';
  import { cloneDeep } from 'lodash-es';
  import { BasicForm, useForm } from '@/components/Form';
  import { useDrawerInner, BasicDrawer } from '@/components/Drawer';
  import { useI18n } from '@/hooks/web/useI18n';
  import { formatToDate } from '@/utils/dateUtil';

  const { t } = useI18n();

  const actionKey = ref<ActionKey>();
  const rowId = ref<number>();
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
        bookDay: formData.bookDay ? formatToDate(formData.bookDay) : null,
      });
    }
  });

  const getTitle = computed(() => {
    const action = unref(actionKey);
    if (action === 'create') return t('common.addNewText') + modalTitle;
    if (action === 'edit') return t('common.editText') + modalTitle;
    if (action === 'show') return t('common.showText') + modalTitle;
    return '';
  });
  async function handleSubmit() {
    try {
      const values = await validate();
      setDrawerProps({ confirmLoading: true });
      const action = unref(actionKey);
      const id = rowId.value;
      if (action === 'create') {
        await createApi({ ...values });
        message.success(t('common.addSuccessMessage', [modalTitle]));
      }
      if (action === 'edit') {
        await updateApi({ id, ...values });
        message.success(t('common.updateSuccessMessage'));
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
