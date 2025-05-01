<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { pinyin } from 'pinyin-pro';

import { useVbenForm, z } from '#/adapter/form';
import {
  createProductApi,
  getBrandAllApi,
  getColorAllApi,
  getStoreAllApi,
  getUnitAllApi,
  updateProductApi,
} from '#/api';

const emit = defineEmits(['refresh']);
const isUpdate = ref(false);
const [Form, formApi] = useVbenForm({
  wrapperClass: 'grid-cols-6',
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    labelWidth: 65,
    formItemClass: 'col-span-2',
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
        placeholder: '请输入产品名称',
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
      disabled: true,
      fieldName: 'pinyin',
      label: '拼音码',
      rules: z
        .string()
        .max(30, {
          message: '请输入1-30个字符',
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
      fieldName: 'unit',
      label: '单位',
      component: 'ApiSelect',
      componentProps: {
        fieldNames: { label: 'name', value: 'name' },
        class: '!w-[140px]',
        placeholder: '请选择单位',
        listHeight: 150,
        allowClear: true,
        api: getUnitAllApi,
      },
    },
    {
      fieldName: 'color',
      label: '颜色',
      component: 'ApiSelect',
      componentProps: {
        fieldNames: { label: 'name', value: 'name' },
        class: '!w-[140px]',
        placeholder: '请选择颜色',
        listHeight: 150,
        allowClear: true,
        api: getColorAllApi,
      },
    },
    {
      fieldName: 'brand',
      label: '品牌',
      component: 'ApiSelect',
      componentProps: {
        fieldNames: { label: 'name', value: 'name' },
        class: '!w-[140px]',
        placeholder: '请选择品牌',
        listHeight: 150,
        allowClear: true,
        api: getBrandAllApi,
      },
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入条码',
      },
      fieldName: 'barcode',
      label: '条码',
      rules: z
        .string()
        .regex(/^(?:\S(?:[\s\S]{0,48}\S)?)?$/, {
          message: '请输入1-50字符',
        })
        .optional(),
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入规格',
      },
      fieldName: 'spec',
      label: '规格',
      rules: z
        .string()
        .regex(/^(?:\S(?:[\s\S]{0,48}\S)?)?$/, {
          message: '长度为1-50字符',
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
      fieldName: 'purchasePrice',
      label: '采购价格',
      defaultValue: 0,
      dependencies: {
        triggerFields: ['isVirtual'],
        disabled: (values) => values.isVirtual === 1,
        trigger: (values) => {
          values.purchasePrice = 0;
        },
      },
    },
    {
      component: 'InputNumber',
      componentProps: {
        placeholder: '0.00',
        controls: false,
        precision: 2,
      },
      fieldName: 'salePrice',
      label: '销售价格',
      defaultValue: 0,
    },
    {
      component: 'InputNumber',
      componentProps: {
        placeholder: '0',
        controls: false,
        precision: 0,
      },
      fieldName: 'maxLimit',
      label: '库存上限',
      defaultValue: 0,
      dependencies: {
        triggerFields: ['isVirtual'],
        disabled: (values) => values.isVirtual === 1,
        trigger: (values) => {
          values.maxLimit = 0;
        },
      },
    },
    {
      component: 'InputNumber',
      componentProps: {
        placeholder: '0',
        controls: false,
        precision: 0,
      },
      fieldName: 'minLimit',
      label: '库存下限',
      defaultValue: 0,
      dependencies: {
        triggerFields: ['isVirtual'],
        disabled: (values) => values.isVirtual === 1,
        trigger: (values) => {
          values.minLimit = 0;
        },
      },
    },
    {
      component: 'InputNumber',
      componentProps: {
        placeholder: '0.00',
        controls: false,
        precision: 2,
      },
      fieldName: 'minPrice',
      label: '最低售价',
      defaultValue: 0,
    },
    {
      component: 'InputNumber',
      componentProps: {
        placeholder: '0.00',
        controls: false,
        precision: 2,
      },
      fieldName: 'maxPrice',
      label: '最高进价',
      defaultValue: 0,
      dependencies: {
        triggerFields: ['isVirtual'],
        disabled: (values) => values.isVirtual === 1,
        trigger: (values) => {
          values.maxPrice = 0;
        },
      },
    },
    {
      component: 'InputNumber',
      componentProps: {
        placeholder: '0.00',
        controls: false,
        precision: 2,
      },
      fieldName: 'vipPrice',
      label: 'VIP价格',
      defaultValue: 0,
    },
    {
      component: 'RadioGroup',
      fieldName: 'isVirtual',
      label: '劳务',
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
      dependencies: {
        triggerFields: ['id'],
        if: (values) => !values.id,
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
      fieldName: 'storeId',
      label: '仓库',
      component: 'ApiSelect',
      componentProps: {
        class: '!w-[140px]',
        placeholder: '请选择仓库',
        listHeight: 150,
        api: getStoreAllApi,
        labelField: 'name',
        valueField: 'id',
        autoSelect: 'first',
        afterFetch: (data) => data.filter((item) => item.status === 1),
      },
      defaultValue: undefined,
      dependencies: {
        triggerFields: ['id'],
        if: (values) => !values.id,
      },
      rules: z
        .number({ message: '请选择仓库' })
        .min(1, { message: '仓库ID不正确' }),
    },
    {
      component: 'InputNumber',
      componentProps: {
        placeholder: '0',
        controls: false,
        precision: 0,
        min: 0,
        onChange: async (value) => {
          const { price } = await formApi.getValues();
          if (price > 0) {
            formApi.setFieldValue('totalPrice', price * value);
          } else {
            formApi.setFieldValue('totalPrice', 0);
          }
        },
      },
      fieldName: 'num',
      label: '库存数量',
      defaultValue: 0,
      dependencies: {
        triggerFields: ['id', 'isVirtual'],
        if: (values) => !values.id,
        disabled: (values) => values.isVirtual === 1,
        trigger: (values) => {
          if (values.isVirtual === 1) {
            values.num = 0;
          }
        },
      },
      rules: z
        .number({ message: '请输入库存数量' })
        .min(0, { message: '库存数量不能小于 0' }),
    },
    {
      component: 'InputNumber',
      componentProps: {
        placeholder: '0.00',
        controls: false,
        precision: 2,
        min: 0,
        onChange: async (value) => {
          const { num } = await formApi.getValues();
          if (num > 0) {
            formApi.setFieldValue('totalPrice', num * value);
          } else {
            formApi.setFieldValue('totalPrice', 0);
          }
        },
      },
      fieldName: 'price',
      label: '库存单价',
      defaultValue: 0,
      rules: z
        .number({ message: '请输入库存单价' })
        .min(0, { message: '库存单价不能小于 0' }),
      dependencies: {
        triggerFields: ['id', 'isVirtual'],
        if: (values) => !values.id,
        disabled: (values) => values.isVirtual === 1,
        trigger: (values) => {
          if (values.isVirtual === 1) {
            values.price = 0;
          }
        },
      },
    },
    {
      component: 'InputNumber',
      componentProps: {
        placeholder: '0.00',
        controls: false,
        precision: 2,
        min: 0,
        onChange: async (value) => {
          const { num } = await formApi.getValues();
          if (num > 0) {
            formApi.setFieldValue('price', Number((value / num).toFixed(2)));
          } else {
            formApi.setFieldValue('price', 0);
          }
        },
      },
      fieldName: 'totalPrice',
      label: '库存总价',
      defaultValue: 0,
      rules: z
        .number({ message: '请输入库存总价' })
        .min(0, { message: '库存总价不能小于 0' }),
      dependencies: {
        triggerFields: ['id', 'isVirtual'],
        if: (values) => !values.id,
        disabled: (values) => values.isVirtual === 1,
        trigger: (values) => {
          if (values.isVirtual === 1) {
            values.totalPrice = 0;
          }
        },
      },
    },
  ],
});
const [Modal, modalApi] = useVbenModal({
  closeOnClickModal: false,
  destroyOnClose: true,
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
    await updateProductApi(values);
    emit('refresh', 'query');
  } else {
    await createProductApi(values);
    emit('refresh', 'reload');
  }
  modalApi.close();
}
</script>
<template>
  <Modal
    class="w-[680px]"
    :title="isUpdate ? '修改产品' : '新增产品'"
    centered
    :fullscreen-button="false"
    auto-content-height
  >
    <Form />
  </Modal>
</template>
