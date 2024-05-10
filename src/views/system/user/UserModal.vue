<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm">
      <template #avatar="{ model, field }">
        <AvatarUpload :avatar="model[field]" @change="onAvatarChange" />
      </template>
    </BasicForm>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { createUser, updateUser, getUserInfo } from '/@/api/system/user';
  import { AvatarUpload } from '/@/components/Upload';
  import { formSchema } from './user.data';
  import { getDeptList } from '/@/api/system/dept';

  const emit = defineEmits(['success', 'register']);

  const isUpdate = ref(true);
  const rowId = ref<number>(0);
  const getTitle = computed(() => (!unref(isUpdate) ? '新增账号' : '编辑账号'));

  const [registerForm, { setFieldsValue, updateSchema, resetFields, validate }] = useForm({
    labelWidth: 100,
    schemas: formSchema,
    showActionButtonGroup: false,
    actionColOptions: {
      span: 23,
    },
  });

  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    resetFields();
    setModalProps({ confirmLoading: false });
    isUpdate.value = !!data?.isUpdate;

    if (unref(isUpdate)) {
      updateSchema([
        { field: 'username', componentProps: { disabled: true } },
        { field: 'password', required: false },
      ]);

      rowId.value = data.record.id;
      const userInfo = await getUserInfo(data.record.id);
      setFieldsValue(userInfo);
      setFieldsValue({ roleIds: userInfo.roles.map((item) => item.id) });
      setFieldsValue({ deptId: userInfo.dept.id });
    } else {
      updateSchema([
        { field: 'username', componentProps: { disabled: false } },
        {
          field: 'password',
          required: true,
          defaultValue: 'a123456',
          componentProps: { placeholder: '请输入' },
        },
      ]);
    }

    const treeData = await getDeptList();
    updateSchema([
      {
        field: 'deptId',
        componentProps: { treeData },
      },
    ]);
  });

  async function handleSubmit() {
    try {
      const values = await validate();
      setModalProps({ confirmLoading: true });

      if (!values.password) delete values.password;

      if (!unref(isUpdate)) {
        await createUser(values);
      } else {
        await updateUser(rowId.value, values);
      }

      closeModal();
      emit('success', { isUpdate: unref(isUpdate), values: { ...values, id: rowId.value } });
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }

  async function onAvatarChange(file) {
    if (file?.response) {
      setFieldsValue({
        avatar: file.response.data.filename,
      });
    } else {
      setFieldsValue({
        avatar: null,
      });
    }
  }
</script>
