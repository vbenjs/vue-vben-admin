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
  } from '../data';
  import { message } from 'ant-design-vue';
  import { cloneDeep } from 'lodash-es';
  import { useForm, BasicForm } from '@/components/Form';
  import { useDrawerInner, BasicDrawer } from '@/components/Drawer';

  const actionKey = ref<ActionKey>();
  const rowId = ref<number>();
  const emit = defineEmits(['success', 'register']);
  const [registerForm, { setFieldsValue, validate, resetSchema }] = useForm({
    // layout: 'vertical',
    labelWidth: 100,
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
        const { equipmentType, equipmentId, equipment } = itemData ?? data;
        resetSchema(
          getFormSchema({
            ...data,
            equipmentType,
            equipmentId: equipmentId ? Number(equipmentId) : undefined,
            checkedMessages: itemData?.messages,
            checkedTemplate: itemData?.template ? [itemData.template] : undefined,
            checkedEquipment: equipment ? [equipment] : undefined,
          }),
        );
        setDrawerProps({ confirmLoading: false });

        if (itemData) {
          const formData: Recordable = cloneDeep(itemData);
          formData.messages = itemData.messages?.map((item) => item.id);
          formData.attributes = itemData.attributes?.map((item) => item.id);
          setFieldsValue({
            ...formData,
          });
        }
      } finally {
        changeLoading(false);
      }
    },
  );

  const getTitle = computed(() => {
    const action = unref(actionKey);
    if (action === 'create') return '新建' + modalTitle;
    if (action === 'edit') return '编辑' + modalTitle;
    if (action === 'show') return '查看' + modalTitle;
    if (action === 'copy') return '复制' + modalTitle;
    return '';
  });
  async function handleSubmit() {
    try {
      const values = await validate();
      values.messages = values.messages?.map((id: number | string) => ({ id }));
      values.attributes = values.attributes?.map((id: number | string) => ({
        id,
      }));

      setDrawerProps({ confirmLoading: true });
      const action = unref(actionKey);
      const id = rowId.value;
      if (action === 'create' || action === 'copy') {
        await createApi({ ...values });
        message.success(`新建${modalTitle}成功！`);
      }
      if (action === 'edit') {
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
