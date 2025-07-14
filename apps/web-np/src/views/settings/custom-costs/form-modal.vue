<script lang="ts" setup>
import type { ICustomCost } from '#/api';

import { reactive } from 'vue';

import { useVbenModal, z } from '@vben/common-ui';

import { Button, message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { storeCustomCost } from '#/api';
import dayjs from '#/shared/dayjs';
import { getDatePreset, toPercentage, toRate } from '#/shared/utils';
import { useShopStore } from '#/store';

import FormModalExample from './form-modal-example.vue';
import { CustomCostType, customCostTypes } from './service';

const shopStore = useShopStore();
const onGoingDate = dayjs('9999-12-31');
const state = reactive({
  showExample: false,
  currenType: CustomCostType.DAILY as CustomCostType,
  currentAmount: 0,
});

function onSubmit(values: Record<string, any>) {
  modalApi.lock();

  if (values.type === CustomCostType.GROSS_SALE_PERCENTAGE) {
    values.grossSaleRate = toRate(values.grossSaleRate);
  }

  if (values.type === CustomCostType.REVENUE_PERCENTAGE) {
    values.revenueRate = toRate(values.revenueRate);
  }

  if (values.type === CustomCostType.GROSS_PROFIT_PERCENTAGE) {
    values.grossProfitRate = toRate(values.grossProfitRate);
  }

  if (values.endDate && !onGoingDate.diff(values.endDate)) {
    values.endDate = null;
  }

  storeCustomCost(values)
    .then(() => {
      message.success('The custom cost has been saved successfully');
      modalApi.setData({ reload: true });
      modalApi.close();
    })
    .finally(() => {
      modalApi.lock(false);
    });
}

function onChanged(values: Record<string, any>) {
  state.currenType = values.type;

  switch (values.type) {
    case CustomCostType.DAILY: {
      state.currentAmount = values.dailyCost;

      formApi.setValues({
        periodCost: state.currentAmount,
      });
      break;
    }

    case CustomCostType.GROSS_PROFIT_PERCENTAGE: {
      state.currentAmount = values.grossProfitRate;
      break;
    }

    case CustomCostType.GROSS_SALE_PERCENTAGE: {
      state.currentAmount = values.grossSaleRate;
      break;
    }

    case CustomCostType.MONTHLY: {
      state.currentAmount = +(values.periodCost / 30).toFixed(2);

      formApi.setValues({
        dailyCost: state.currentAmount,
      });
      break;
    }

    case CustomCostType.ONE_TIME: {
      if (!values.endDate) {
        return;
      }

      const date = values.endDate as any;
      const diffDays = date.diff(values.startDate, 'days');
      state.currentAmount = +(values.periodCost / diffDays).toFixed(2);

      formApi.setValues({
        dailyCost: state.currentAmount,
      });
      break;
    }

    case CustomCostType.REVENUE_PERCENTAGE: {
      state.currentAmount = values.revenueRate;
      break;
    }

    case CustomCostType.WEEKLY: {
      state.currentAmount = +(values.periodCost / 7).toFixed(2);
      formApi.setValues({
        dailyCost: state.currentAmount,
      });
      break;
    }

    default: {
      break;
    }
  }
}

const [Form, formApi] = useVbenForm({
  handleSubmit: onSubmit,
  handleValuesChange: onChanged,
  commonConfig: {
    colon: true,
    componentProps: {
      class: 'w-full',
    },
    labelClass: 'w-1/4',
  },
  schema: [
    {
      component: 'Input',
      dependencies: {
        show: false,
        triggerFields: ['id'],
      },
      fieldName: 'id',
      label: 'id',
    },
    {
      component: 'Input',
      fieldName: 'name',
      label: 'Name',
      componentProps: {
        placeholder: 'Tax, Rent, Employee, Advertisement etc.',
      },
      dependencies: {
        if(values) {
          return values.uuid !== 'default';
        },
        triggerFields: ['uuid'],
      },
      rules: z.string().min(3),
    },
    {
      component: 'Select' as any,
      defaultValue: CustomCostType.DAILY,
      componentProps: {
        options: customCostTypes,
      },
      dependencies: {
        disabled(values) {
          return values.id;
        },
        triggerFields: ['id'],
      },
      fieldName: 'type',
      label: 'Type',
      rules: 'required',
    },
    {
      component: 'InputNumber' as any,
      defaultValue: 0,
      componentProps: {
        prefix: shopStore.shop.currencySymbol,
        addonAfter: shopStore.shop.currency,
        min: 0,
      },
      dependencies: {
        if(values) {
          return (
            values.type === CustomCostType.MONTHLY ||
            values.type === CustomCostType.WEEKLY ||
            values.type === CustomCostType.ONE_TIME
          );
        },
        triggerFields: ['type'],
      },
      fieldName: 'periodCost',
      label: 'Amount',
      rules: z.number().gt(0),
    },
    {
      component: 'InputNumber' as any,
      defaultValue: 0,
      componentProps: {
        prefix: shopStore.shop.currencySymbol,
        addonAfter: shopStore.shop.currency,
        min: 0,
      },
      dependencies: {
        if(values) {
          return (
            values.type === CustomCostType.MONTHLY ||
            values.type === CustomCostType.WEEKLY ||
            values.type === CustomCostType.DAILY ||
            values.type === CustomCostType.ONE_TIME
          );
        },
        disabled(values) {
          return values.type !== CustomCostType.DAILY;
        },
        triggerFields: ['type'],
      },
      fieldName: 'dailyCost',
      label: 'Daily cost',
      rules: z.number().gt(0),
    },
    {
      component: 'InputNumber' as any,
      defaultValue: 0,
      componentProps: {
        addonAfter: '%',
        min: 0,
      },
      dependencies: {
        if(values) {
          return values.type === CustomCostType.GROSS_SALE_PERCENTAGE;
        },
        triggerFields: ['type'],
      },
      fieldName: 'grossSaleRate',
      label: '% of Gross sale',
      rules: z.number().gt(0).max(100),
    },
    {
      component: 'InputNumber' as any,
      defaultValue: 0,
      componentProps: {
        addonAfter: '%',
        min: 0,
      },
      dependencies: {
        if(values) {
          return values.type === CustomCostType.REVENUE_PERCENTAGE;
        },
        triggerFields: ['type'],
      },
      fieldName: 'revenueRate',
      label: '% of Revenue',
      rules: z.number().gt(0).max(100),
    },
    {
      component: 'InputNumber' as any,
      defaultValue: 0,
      componentProps: {
        addonAfter: '%',
        min: 0,
      },
      dependencies: {
        if(values) {
          return values.type === CustomCostType.GROSS_PROFIT_PERCENTAGE;
        },
        triggerFields: ['type'],
      },
      fieldName: 'grossProfitRate',
      label: '% of Gross profit',
      rules: z.number().gt(0).max(100),
    },
    {
      component: 'DatePicker' as any,
      defaultValue: dayjs().add(-7, 'd'),
      componentProps: {
        presets: getDatePreset([
          'today',
          'last7Days',
          'last14Days',
          'lastMonth',
          'last3Months',
          'lastYear',
          'thisMonth',
          'thisYear',
        ]),
      },
      fieldName: 'startDate',
      label: 'Start date',
      rules: 'required',
    },
    {
      component: 'DatePicker' as any,
      defaultValue: dayjs(),
      componentProps: {
        presets: [
          { label: 'On going', value: onGoingDate },
          { label: 'Next 30 Days', value: dayjs().add(30, 'd') },
          { label: 'Next 7 Days', value: dayjs().add(7, 'd') },
          ...getDatePreset(['last7Days', 'lastMonth']),
        ],
        format: (value: any) => {
          const val = value.format('YYYY-MM-DD');

          return onGoingDate.diff(value) ? val : 'On going';
        },
      },
      dependencies: {
        required(values) {
          return values.type === CustomCostType.ONE_TIME;
        },
        triggerFields: ['type'],
      },
      fieldName: 'endDate',
      label: 'End date',
    },
    {
      component: 'Textarea' as any,
      fieldName: 'note',
      label: 'Note',
    },
  ],
  showDefaultActions: false,
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
      const values = modalApi.getData<ICustomCost>();

      if (!values.name) {
        return;
      }

      formApi.setValues({
        ...values,
        grossSaleRate: Number.parseFloat(toPercentage(values.grossSaleRate)),
        revenueRate: Number.parseFloat(toPercentage(values.revenueRate)),
        grossProfitRate: Number.parseFloat(
          toPercentage(values.grossProfitRate),
        ),
        startDate: dayjs(values.startDate),
        endDate: values.endDate ? dayjs(values.endDate) : onGoingDate,
      });
    }
  },
});
</script>
<template>
  <Modal class="w-[700px]" title="Custom Cost" confirm-text="Submit">
    <Form />
    <FormModalExample
      v-show="state.showExample"
      :type="state.currenType"
      :amount="state.currentAmount"
    />

    <template #prepend-footer>
      <div class="flex-auto">
        <Button
          type="dashed"
          size="small"
          @click="state.showExample = !state.showExample"
        >
          {{ state.showExample ? 'Hide' : 'Show' }} example
        </Button>
      </div>
    </template>
  </Modal>
</template>
