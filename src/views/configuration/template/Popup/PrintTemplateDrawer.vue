<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    :title="getTitle"
    @ok="handleSubmit"
    :width="400"
    destroyOnClose
    showFooter
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
  import { useGo } from '@/hooks/web/usePage';
  import { HashingFactory } from '@/utils/cipher';

  const actionKey = ref<ActionKey>();
  const rowId = ref<number>();
  const emit = defineEmits(['success', 'register']);
  const go = useGo();

  const [registerForm, { setFieldsValue, validate, resetSchema }] = useForm({
    layout: 'vertical',
    compact: true,
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
      const values = await validate();

      setDrawerProps({ confirmLoading: true });
      const action = unref(actionKey);
      const id = rowId.value;
      if (action === 'create') {
        const { id } = await createApi({ ...values });
        message.success(`新建${modalTitle}成功！`);
        closeDrawer();
        const md5 = HashingFactory.createMD5Hashing().hash(String(id));
        go({ path: '/configuration/print_template/update/' + md5, query: { id } });
      }
      if (action === 'edit') {
        await updateApi({ id, ...values });
        message.success('更新成功！');
        closeDrawer();
      }
      emit('success', {
        actionKey: unref(actionKey),
        values: { ...values, id: rowId.value },
      });
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  }
</script>
<style lang="less" scoped>
  .mx-1 {
    margin: 0 16px;
  }
</style>
