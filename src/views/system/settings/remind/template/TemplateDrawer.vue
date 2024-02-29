<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    :title="getTitle"
    @ok="handleSubmit"
    :width="578"
    destroyOnClose
    :showFooter="actionKey !== 'show'"
  >
    <BasicForm @register="registerForm" />
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import {
    ActionKey,
    ItemResult,
    createApi,
    getFormSchema,
    getItemApi,
    modalTitle,
    updateApi,
  } from './data';
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
    labelWidth: 140,
    showActionButtonGroup: false,
  });

  const [registerDrawer, { setDrawerProps, closeDrawer, changeLoading }] = useDrawerInner(
    async (data) => {
      try {
        const { actionKey: key, id } = data;
        actionKey.value = key;
        rowId.value = id;
        changeLoading(true);
        const itemData: ItemResult | null = id ? await getItemApi(id) : null;

        resetSchema(getFormSchema(actionKey.value));
        setDrawerProps({ confirmLoading: false });

        if (itemData) {
          const formData: Recordable = cloneDeep(itemData);
          formData.managerIds = formData.remindManager?.map((item) => item.id);
          formData.operatorId = formData.remindOperator?.id;
          setFieldsValue({
            ...formData,
            bookDay: formData.bookDay ? formatToDate(formData.bookDay) : null,
          });
        }
      } finally {
        changeLoading(false);
      }
    },
  );

  const getTitle = computed(() => {
    const action = unref(actionKey);
    if (action === 'create') return t('common.addNewText') + modalTitle;
    if (action === 'edit') return t('common.editText') + modalTitle;
    if (action === 'show') return t('common.showText') + modalTitle;
    if (action === 'copy') return '复制' + modalTitle;
    return '';
  });
  async function handleSubmit() {
    try {
      const values = await validate();
      values.remindManager = values.managerIds?.map((id: number) => ({ id }));
      delete values.managerIds;
      setDrawerProps({ confirmLoading: true });
      const action = unref(actionKey);
      const id = rowId.value;
      if (action === 'create' || action === 'copy') {
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
