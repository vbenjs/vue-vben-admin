<template>
  <BasicModal v-bind="$attrs" @register="register" title="修改密码" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';

  import { changePasswordApi } from '/@/api/sys/user';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useUserStore } from '/@/store/modules/user';

  const reg = /(?!^\d+$)(?!^[A-Za-z]+$)(?!^[^A-Za-z0-9]+$)(?!^.*[\u4E00-\u9FA5].*$)^\S{6,16}$/;
  const formSchema: FormSchema[] = [
    {
      field: 'oldPassword',
      label: '当前密码',
      component: 'InputPassword',
      required: true,
    },
    {
      field: 'newPassword',
      label: '新密码',
      component: 'StrengthMeter',
      componentProps: {
        placeholder: '新密码',
      },
      rules: [
        {
          required: true,
          trigger: 'change',
          validator(_, value) {
            return new Promise((resolve, reject) => {
              if (!value) reject('请输入密码');
              if (!reg.test(value)) {
                reject('请输入6-16位字母+数字组合');
              } else {
                resolve();
              }
            });
          },
        },
      ],
    },
    {
      field: 'confirmPassword',
      label: '确认密码',
      component: 'StrengthMeter',
      componentProps: {
        placeholder: '确认密码',
      },
      dynamicRules: ({ values }) => {
        return [
          {
            required: true,
            validator: (_, value) => {
              if (!value) {
                return Promise.reject('密码不能为空');
              }
              if (value !== values.newPassword) {
                return Promise.reject('两次输入的密码不一致!');
              }
              return Promise.resolve();
            },
          },
        ];
      },
    },
  ];

  const [registerForm, { resetFields, validate }] = useForm({
    labelWidth: 80,
    schemas: formSchema,
    showActionButtonGroup: false,
    actionColOptions: {
      span: 24,
    },
  });

  const { createMessage } = useMessage();
  const userStore = useUserStore();

  const [register, { closeModal, setModalProps }] = useModalInner(async () => {
    resetFields();
    setModalProps({ confirmLoading: false });
  });

  async function handleSubmit() {
    try {
      const values = await validate();

      setModalProps({ confirmLoading: true });

      await changePasswordApi(values);

      createMessage.success('修改密码成功');
      closeModal();
      setTimeout(() => {
        userStore.logout();
        location.reload();
      }, 1000);
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>
