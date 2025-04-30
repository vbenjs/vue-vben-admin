<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm, z } from '#/adapter/form';
import { createUnitApi, updateUnitApi } from '#/api';

const emit = defineEmits(['refresh']);
const isUpdate = ref(false);
const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-4/5',
    },
    labelWidth: 60,
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
        placeholder: '请输入单位名称',
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
      component: 'InputNumber',
      componentProps: {
        controls: false,
        precision: 0,
        min: 0,
        max: 9999,
        placeholder: '请输入排序',
      },
      fieldName: 'sort',
      label: '排序',
      defaultValue: 0,
      rules: z
        .number({ message: '请输入排序' })
        .min(0, { message: '排序不能小于 0' })
        .max(9999, { message: '排序不能大于 9999' }),
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
    await updateUnitApi(values);
    emit('refresh', 'query');
  } else {
    await createUnitApi(values);
    emit('refresh', 'reload');
  }
  modalApi.close();
}
</script>
<template>
  <Modal
    class="w-[400px]"
    :title="isUpdate ? '修改单位' : '新增单位'"
    centered
    :fullscreen-button="false"
    auto-content-height
  >
    <Form />
  </Modal>
</template>
