<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    :title="getTitle"
    @ok="handleSubmit"
    :width="640"
    destroyOnClose
    showFooter
  >
    <BasicForm @register="registerForm" />
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { ref, computed, unref, toRaw } from 'vue';
  import { BasicDrawer, useDrawerInner } from '@/components/Drawer';
  import { BasicForm, useForm } from '@/components/Form/index';
  import { ActionKey, getFormSchema } from '../form';
  import { savePermission } from '@/api/system/permission';
  import { message } from 'ant-design-vue';
  import { PermissionTree } from '@/ApiModel/system/permissionModel';

  const actionKey = ref<ActionKey>();
  const rowId = ref<number>();
  const children = ref();
  const emit = defineEmits(['success', 'register']);

  const [registerForm, { setFieldsValue, resetFields, validate, resetSchema }] = useForm({
    labelWidth: 90,
    showActionButtonGroup: false,
    actionColOptions: {
      span: 23,
    },
  });

  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    actionKey.value = data?.actionKey;

    resetFields();
    resetSchema(getFormSchema(actionKey.value, data?.record?.id));
    setDrawerProps({ confirmLoading: false });
    if (unref(actionKey) !== 'create') {
      const permission = toRaw(data.record) as PermissionTree;
      rowId.value = permission.id;
      children.value = permission.children;
      setFieldsValue(permission);
    }
  });

  const getTitle = computed(() => {
    const action = unref(actionKey);
    if (action === 'create') return '新增权限';
    if (action === 'edit') return '编辑权限';
    return '';
  });
  async function handleSubmit() {
    try {
      const values = await validate();
      await savePermission(values);
      closeDrawer();
      message.success('保存成功！');
      emit('success', {
        actionKey: unref(actionKey),
        values: { ...values, id: rowId.value },
      });
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  }
</script>
