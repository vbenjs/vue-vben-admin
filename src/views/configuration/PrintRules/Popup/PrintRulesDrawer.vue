<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    :title="getTitle"
    @ok="handleSubmit"
    destroyOnClose
    showFooter
    :width="478"
  >
    <div class="mx-1">
      <BasicForm @register="registerForm" />
    </div>
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { ActionKey, createApi, getFormSchema, modalTitle, updateApi } from '../data';
  import { message } from 'ant-design-vue';
  import { cloneDeep } from 'lodash-es';
  import { useForm, BasicForm } from '@/components/Form';
  import { useDrawerInner, BasicDrawer } from '@/components/Drawer';
  import { HxPrintRule } from '@/ApiModel/configuration/printRule';

  const actionKey = ref<ActionKey>();
  const rowId = ref<number>();
  const emit = defineEmits(['success', 'register']);
  const [registerForm, { setFieldsValue, validate, resetSchema }] = useForm({
    // layout: 'vertical',
    labelWidth: 90,
    rowProps: {
      gutter: [12, 4],
    },
    compact: true,
    showActionButtonGroup: false,
  });

  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    setDrawerProps({ confirmLoading: false });

    actionKey.value = data?.actionKey;
    const formData = cloneDeep(data.record) as HxPrintRule;
    resetSchema(getFormSchema(formData));

    if (unref(actionKey) !== 'create') {
      rowId.value = formData.id;
      Object.keys(formData).forEach((key) => {
        if (formData[key] === 'Y') {
          formData[key] = true;
        }
        if (formData[key] === 'N') {
          formData[key] = false;
        }
      });
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

      Object.keys(values).forEach((key) => {
        if (values[key] === true) {
          values[key] = 'Y';
        }
        if (values[key] === false) {
          values[key] = 'N';
        }
      });

      setDrawerProps({ confirmLoading: true });
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
