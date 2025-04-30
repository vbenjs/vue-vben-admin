<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm, z } from '#/adapter/form';
import { createBankApi, updateBankApi } from '#/api';

const emit = defineEmits(['refresh']);
const isUpdate = ref(false);
const [Form, formApi] = useVbenForm({
  wrapperClass: 'grid-cols-12',
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    labelWidth: 60,
    formItemClass: 'col-span-6',
  },
  handleSubmit: onSubmit,

  schema: [
    {
      component: 'Input',
      fieldName: 'id',
      label: '编码',
      componentProps: {
        disabled: true,
      },
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入银行名称',
      },
      fieldName: 'name',
      label: '名称',
      rules: z
        .string()
        .regex(/^\S(?:[\s\S]{0,28}\S)?$/, {
          message: '请输入1-30个字符',
        })
        .refine((value) => value.trim() !== '', {
          message: '请输入名称',
        }),
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入开户人',
      },
      fieldName: 'holder',
      label: '开户人',
      rules: z
        .string()
        .regex(/^(?:\S(?:[\s\S]{0,28}\S)?)?$/, {
          message: '长度为1-30字符',
        })
        .optional(),
      formItemClass: 'col-span-5',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入账号',
      },
      fieldName: 'account',
      label: '账号',
      rules: z
        .string()
        .regex(/^(?:\S(?:[\s\S]{0,48}\S)?)?$/, {
          message: '长度为1-50字符',
        })
        .optional(),
      formItemClass: 'col-span-7',
    },
    {
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入1-200字地址',
      },
      fieldName: 'address',
      label: '地址',
      formItemClass: 'col-span-12',
      rules: z
        .string()
        .regex(/^(?:\S(?:[\s\S]{0,198}\S)?)?$/, {
          message: '请输入1-200字地址',
        })
        .optional(),
    },
    {
      component: 'InputNumber',
      componentProps: {
        placeholder: '0.00',
        controls: false,
        precision: 2,
      },
      fieldName: 'initialBalance',
      label: '期初余额',
      defaultValue: 0,
      dependencies: {
        triggerFields: ['id'],
        if: ({ id }) => !id,
      },
      formItemClass: 'col-span-4',
    },
    {
      component: 'RadioGroup',
      fieldName: 'status',
      label: '状态',
      defaultValue: 1,
      componentProps: {
        options: [
          {
            label: '启用',
            value: 1,
          },
          {
            label: '禁用',
            value: 0,
          },
        ],
      },
      formItemClass: 'col-span-4',
    },
    {
      component: 'RadioGroup',
      fieldName: 'isDefault',
      label: '默认',
      defaultValue: 0,
      componentProps: {
        options: [
          {
            label: '是',
            value: 1,
          },
          {
            label: '否',
            value: 0,
          },
        ],
      },
      formItemClass: 'col-span-4',
    },
  ],
});
const [Modal, modalApi] = useVbenModal({
  onOpenChange(isOpen: boolean) {
    if (!isOpen) {
      return;
    }
    const { id, ...values } = modalApi.getData();
    isUpdate.value = !!id;
    if (id) {
      formApi.setValues({
        id,
        ...values,
      });
    }
  },
  onConfirm: async () => {
    await formApi.validateAndSubmitForm();
  },
});

async function onSubmit(values: Record<string, any>) {
  if (isUpdate.value) {
    await updateBankApi(values);
    emit('refresh', 'query');
  } else {
    await createBankApi(values);
    emit('refresh', 'reload');
  }
  modalApi.close();
}
</script>
<template>
  <Modal
    class="w-[650px]"
    :title="isUpdate ? '修改银行' : '新增银行'"
    centered
    :fullscreen-button="false"
    auto-content-height
  >
    <Form />
  </Modal>
</template>
