<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { pinyin } from 'pinyin-pro';

import { useVbenForm, z } from '#/adapter/form';
import { createCustomerApi, updateCustomerApi } from '#/api';

const emit = defineEmits(['refresh']);
const isUpdate = ref(false);
const [Form, formApi] = useVbenForm({
  wrapperClass: 'grid-cols-12',
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    labelWidth: 60,
    formItemClass: 'col-span-4',
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
        placeholder: '请输入客户名称',
      },
      fieldName: 'name',
      label: '名称',
      rules: z.string().regex(/^\S(?:[\s\S]{0,38}\S)?$/, {
        message: '长度为1-40字符',
      }),
    },
    {
      component: 'Input',
      disabled: true,
      fieldName: 'pinyin',
      label: '拼音码',
      rules: z
        .string()
        .max(40, {
          message: '请输入1-40个字符',
        })
        .optional(),
      dependencies: {
        triggerFields: ['name'],
        trigger(values) {
          values.pinyin = pinyin(values.name, {
            pattern: 'first',
            toneType: 'none',
            separator: '',
          })
            .replaceAll(/[^a-z0-9]/gi, '')
            .toLocaleUpperCase();
        },
      },
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
        .regex(/^(?:\S(?:[\s\S]{0,38}\S)?)?$/, {
          message: '长度为1-40字符',
        })
        .optional(),
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入手机',
      },
      fieldName: 'phone',
      label: '手机',
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
        placeholder: '请输入公司名称',
      },
      fieldName: 'company',
      label: '公司名称',
      rules: z
        .string()
        .regex(/^(?:\S(?:[\s\S]{0,38}\S)?)?$/, {
          message: '长度为1-40字符',
        })
        .optional(),
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入税号',
      },
      fieldName: 'taxNo',
      label: '税号',
      rules: z
        .string()
        .regex(/^(?:\S(?:[\s\S]{0,38}\S)?)?$/, {
          message: '长度为1-40字符',
        })
        .optional(),
      formItemClass: 'col-span-6',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入账户',
      },
      fieldName: 'bankAccount',
      label: '银行账户',
      rules: z
        .string()
        .regex(/^(?:\S(?:[\s\S]{0,38}\S)?)?$/, {
          message: '长度为1-40字符',
        })
        .optional(),
      formItemClass: 'col-span-6',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入银行名称',
      },
      fieldName: 'bankName',
      label: '银行名称',
      rules: z
        .string()
        .regex(/^(?:\S(?:[\s\S]{0,38}\S)?)?$/, {
          message: '长度为1-40字符',
        })
        .optional(),
      formItemClass: 'col-span-6',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入开户人',
      },
      fieldName: 'bankHolder',
      label: '开户人',
      rules: z
        .string()
        .regex(/^(?:\S(?:[\s\S]{0,38}\S)?)?$/, {
          message: '长度为1-40字符',
        })
        .optional(),
      formItemClass: 'col-span-6',
    },
    {
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入银行地址',
      },
      fieldName: 'bankAddress',
      label: '银行地址',
      formItemClass: 'col-span-12',
      rules: z
        .string()
        .regex(/^(?:\S(?:[\s\S]{0,78}\S)?)?$/, {
          message: '长度为1-80字符',
        })
        .optional(),
    },

    {
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入1-80字地址',
      },
      fieldName: 'address',
      label: '地址',
      formItemClass: 'col-span-12',
      rules: z
        .string()
        .regex(/^(?:\S(?:[\s\S]{0,78}\S)?)?$/, {
          message: '长度为1-80字符',
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
    await updateCustomerApi(values);
    emit('refresh', 'query');
  } else {
    await createCustomerApi(values);
    emit('refresh', 'reload');
  }
  modalApi.close();
}
</script>
<template>
  <Modal
    class="w-[650px]"
    :title="isUpdate ? '修改客户' : '新增客户'"
    centered
    :fullscreen-button="false"
    auto-content-height
  >
    <Form />
  </Modal>
</template>
