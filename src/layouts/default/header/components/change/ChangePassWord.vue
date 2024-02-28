<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    title="更改密码"
    @ok="handleSubmit"
    :can-fullscreen="false"
    :width="600"
    destroy-on-close
  >
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts" setup name="AppointmentModal">
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { BasicForm, useForm } from '@/components/Form/index';
  import { useUserStore } from '@/store/modules/user';
  import { message } from 'ant-design-vue';
  import { modifyPassword } from '@/api/system/user';

  // const emit = defineEmits(['register']);
  const [registerForm, { resetFields, validate }] = useForm({
    labelWidth: 100,
    schemas: [
      {
        field: 'name',
        label: '用户名',
        component: 'Input',
        componentProps: {
          readonly: true,
        },
        defaultValue: useUserStore().getUserInfo?.name,
        colProps: { span: 24 },
      },
      {
        field: 'oldPassword',
        label: '旧密码',
        component: 'InputPassword',
        componentProps: {
          placeholder: '请输入旧密码',
          autocomplete: 'autocomplete',
        },
        rules: [{ required: true, min: 6, max: 20, message: '请输入旧密码' }],
        colProps: { span: 24 },
      },
      {
        field: 'password',
        label: '密码',
        component: 'InputPassword',
        componentProps: {
          placeholder: '请输入密码（6-20个字符）',
          autocomplete: 'autocomplete',
        },
        rules: [{ required: true, min: 6, max: 20, message: '请输入6-20个字符的密码' }],
        colProps: { span: 24 },
      },
      {
        field: 'confirm_password',
        label: '确认密码',
        component: 'InputPassword',
        componentProps: {
          placeholder: '请再次输入密码',
          autocomplete: 'autocomplete',
        },
        dynamicRules: ({ values }) => {
          return [
            {
              required: true,
              validator: (_, value) => {
                if (!value) {
                  return Promise.reject('不能为空');
                }
                if (value !== values.password) {
                  return Promise.reject('两次输入的密码不一致!');
                }
                return Promise.resolve();
              },
            },
          ];
        },
        colProps: { span: 24 },
      },
    ],
    showActionButtonGroup: false,
    actionColOptions: {
      span: 23,
    },
  });

  const [registerModal, { setModalProps, closeModal }] = useModalInner(async () => {
    resetFields();
    setModalProps({ confirmLoading: false });
  });

  async function handleSubmit() {
    try {
      const values = await validate();
      delete values.confirm_password;
      delete values.name;
      setModalProps({ confirmLoading: true });
      await modifyPassword(values);
      closeModal();
      message.success('保存成功！');
      useUserStore().logout(true);
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>
