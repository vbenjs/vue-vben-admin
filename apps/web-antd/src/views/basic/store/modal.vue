<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm, z } from '#/adapter/form';
import { createStoreApi, updateStoreApi } from '#/api';

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
        placeholder: '请输入仓库名称',
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
        placeholder: '请输入联系人',
      },
      fieldName: 'contact',
      label: '联系人',
      rules: z
        .string()
        .regex(/^(?:\S(?:[\s\S]{0,28}\S)?)?$/, {
          message: '长度为1-30字符',
        })
        .optional(),
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入手机号',
      },
      fieldName: 'phone',
      label: '手机号',
      rules: z
        .string()
        .regex(/^(?:\S(?:[\s\S]{0,28}\S)?)?$/, {
          message: '长度为1-30字符',
        })
        .optional(),
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
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入1-80字备注',
      },
      fieldName: 'desc',
      label: '备注',
      formItemClass: 'col-span-12',
      rules: z
        .string()
        .regex(/^(?:\S(?:[\s\S]{0,78}\S)?)?$/, {
          message: '请输入1-80字备注',
        })
        .optional(),
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
    await updateStoreApi(values);
    emit('refresh', 'query');
  } else {
    await createStoreApi(values);
    emit('refresh', 'reload');
  }
  modalApi.close();
}
</script>
<template>
  <Modal
    class="w-[580px]"
    :title="isUpdate ? '修改仓库' : '新增仓库'"
    centered
    :fullscreen-button="false"
    auto-content-height
  >
    <Form />
  </Modal>
</template>
