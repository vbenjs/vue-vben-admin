<script lang="ts" setup>
import type { IProduct } from './table-config';

import { h, reactive } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Image } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';

const state = reactive({
  formValue: null as IProduct | null,
});

const [CogsForm, formApi] = useVbenForm({
  layout: 'horizontal',
  wrapperClass: 'grid-cols-1 sm:grid-cols-2',
  showDefaultActions: false,
  commonConfig: {
    colon: true,
  },
  schema: [
    {
      component: 'Input',
      componentProps: {
        disabled: true,
      },
      dependencies: {
        show: false,
        triggerFields: ['productTitle'],
      },
      fieldName: 'id',
      label: 'Hidden Field',
    },
    {
      component: h('span'),
      renderComponentContent: () => {
        return {
          default: () => h('div', state.formValue?.productTitle),
        };
      },
      fieldName: 'productTitle',
      label: 'Product Title',
    },
    {
      component: h('span'),
      renderComponentContent: () => {
        return {
          default: () => h('div', state.formValue?.variantTitle),
        };
      },
      dependencies: {
        show: (values) => {
          return !!values.variantId;
        },
        triggerFields: ['id'],
      },
      fieldName: 'variantTitle',
      label: 'Variant Title',
    },
    {
      component: h('span'),
      renderComponentContent: () => {
        return {
          default: () => h('div', state.formValue?.productId),
        };
      },
      fieldName: 'productId',
      label: 'Product ID',
      formItemClass: 'col-start-1',
    },
    {
      component: h('span'),
      renderComponentContent: () => {
        return {
          default: () => h('div', state.formValue?.variantId),
        };
      },
      dependencies: {
        show: (values) => {
          return !!values.variantId;
        },
        triggerFields: ['id'],
      },
      fieldName: 'variantId',
      label: 'Variant ID',
    },
    {
      component: 'Divider',
      fieldName: '_divider',
      renderComponentContent: () => {
        return {
          default: () => h('div', 'COGS - Historical settings'),
        };
      },
      hideLabel: true,
      componentProps: {
        dashed: true,
        class: '!my-0 !py-0',
        orientation: 'left',
        plain: true,
      },
      formItemClass: 'col-start-1',
    },
  ],
});

const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close();
  },
  onConfirm: async () => {
    await formApi.validateAndSubmitForm();
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      state.formValue = modalApi.getData<IProduct>();

      if (state.formValue) {
        formApi.setValues(state.formValue);
      }
    }
  },
});
</script>
<template>
  <Modal title="Cost of Goods Sold - Settings" confirm-text="Submit">
    <div
      class="mb-5 flex items-center justify-center"
      v-if="state.formValue?.image"
    >
      <div class="h-[100px] w-[100px] min-w-5 flex-none object-cover">
        <Image :src="state.formValue?.image" class="rounded-lg border" />
      </div>
    </div>
    <CogsForm />
  </Modal>
</template>
