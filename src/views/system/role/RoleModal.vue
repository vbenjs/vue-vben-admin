<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="getTitle"
    :width="720"
    destroyOnClose
    :defaultFullscreen="true"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm">
      <template #auth>
        <AuthTree ref="authTreeRef" />
      </template>
    </BasicForm>
  </BasicModal>
</template>
<script lang="ts" setup name="RoleModal">
  import { ref, computed, unref, toRaw } from 'vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { BasicForm, useForm } from '@/components/Form/index';
  import { roleSchemas } from './data';
  import AuthTree from './component/AuthTree.vue';
  import { createRole, updateRole } from '@/api/system/roles';
  import { message } from 'ant-design-vue';
  import { RoleResult } from '@/ApiModel/system/roleModel';

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

  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
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

    setModalProps({ confirmLoading: false });
  });

  const getTitle = computed(() => {
    const action = unref(actionKey);
    if (action === 'create') return '新增角色';
    if (action === 'edit') return '编辑角色';
    return '';
  });
  async function handleSubmit() {
    setModalProps({ confirmLoading: true });
    const permissions = unref(authTreeRef).getPermissions();
    try {
      const values = await validate();
      values.permissions = permissions;
      const action = unref(actionKey);
      const id = rowId.value;
      if (action === 'create') await createRole({ ...values });
      if (action === 'edit') await updateRole({ id, ...values });
      message.success('保存成功！');
      closeModal();
      emit('success', {
        actionKey: unref(actionKey),
        values: { ...values, id: rowId.value },
      });
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>
@/ApiModel/system/roleModel
