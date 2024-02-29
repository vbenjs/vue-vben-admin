<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    :title="getTitle"
    width="90%"
    destroyOnClose
    @ok="handleSubmit"
    showFooter
  >
    <BasicForm @register="registerForm">
      <template #auth>
        <AuthTree ref="authTreeRef" />
      </template>
    </BasicForm>
  </BasicDrawer>
</template>
<script lang="ts" setup name="RoleDrawer">
  import { ref, computed, unref, toRaw } from 'vue';
  import { BasicDrawer, useDrawerInner } from '@/components/Drawer';
  import { BasicForm, useForm } from '@/components/Form/index';
  import { roleSchemas } from './data';
  import AuthTree from './component/AuthTree.vue';
  import { createRole, updateRole } from '@/api/system/roles';
  import { RoleResult } from '@/api/system/model/roleModel';
  import { message } from 'ant-design-vue';

  const actionKey = ref<'create' | 'edit'>();
  const rowId = ref<number>();
  const authTreeRef = ref();
  const emit = defineEmits(['success', 'register']);

  const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
    labelWidth: 100,
    schemas: roleSchemas,
    showActionButtonGroup: false,
    actionColOptions: {
      span: 23,
    },
  });

  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    actionKey.value = data?.actionKey;
    resetFields();

    if (unref(actionKey) !== 'create') {
      const roleData = toRaw(data.record) as RoleResult;
      rowId.value = roleData.id;
      unref(authTreeRef).setPermissions(roleData.permissions);
      setFieldsValue(roleData);
    } else {
      setFieldsValue({ sortNum: data.sortNum });
    }

    setDrawerProps({ confirmLoading: false });
  });

  const getTitle = computed(() => {
    const action = unref(actionKey);
    if (action === 'create') return '新增角色';
    if (action === 'edit') return '编辑角色';
    return '';
  });
  async function handleSubmit() {
    setDrawerProps({ confirmLoading: true });
    const permissions = unref(authTreeRef).getPermissions();
    try {
      const values = await validate();
      values.permissions = permissions;
      const action = unref(actionKey);
      const id = rowId.value;
      if (action === 'create') await createRole({ ...values });
      if (action === 'edit') await updateRole({ id, ...values });
      message.success('保存成功！');
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
