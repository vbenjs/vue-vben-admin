<script lang="ts" setup>
import { computed, h, reactive } from 'vue';

import { Page } from '@vben/common-ui';
import { useUserStore } from '@vben/stores';

import { Card, message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { toPercentage } from '#/shared/utils';
import { useCurrencyStore, useShopSettingStore, useShopStore } from '#/store';

const userStore = useUserStore();
const shopStore = useShopStore();
const shopSettingStore = useShopSettingStore();
const currencyStore = useCurrencyStore();

const state = reactive({
  appCurrency: shopStore.shop.currencyFromApp,
  currencyRate: '',
});

const displayRate = computed(() => {
  return currencyStore.getDisplayRate(
    shopStore.shop.currency,
    state.appCurrency,
  );
});

const [ShopSettingForm, formApi] = useVbenForm({
  commonConfig: {
    colon: true,
    componentProps: {
      class: 'w-full',
    },
    labelClass: 'w-2/6',
  },
  handleSubmit: onSubmit,
  handleValuesChange: (values) => {
    state.appCurrency = values.appCurrency;
    formApi.updateSchema([
      {
        fieldName: 'currencyRate',
        hideLabel: state.appCurrency === shopStore.shop.currency,
      },
    ]);
  },
  submitButtonOptions: {
    class: 'w-28',
  },
  resetButtonOptions: {
    class: 'w-28',
  },
  layout: 'horizontal',
  schema: [
    {
      component: h('span', shopStore.shop.id),
      fieldName: 'id',
      label: 'Shop ID',
    },
    {
      component: h('span', userStore.userInfo?.username),
      fieldName: 'id',
      label: 'Name',
    },
    {
      component: h(
        'span',
        shopStore.shop.domain ?? shopStore.shop.myshopifyDomain,
      ),
      fieldName: 'domain',
      label: 'Domain',
    },
    {
      component: h('span', shopStore.shop.subscriptionName),
      labelClass: 'font-bold',
      formItemClass: 'font-bold',
      fieldName: 'id',
      label: 'Subscription',
    },
    {
      component: h('span', userStore.userInfo?.realName),
      fieldName: 'ownerName',
      label: 'Owner',
    },
    {
      component: h('span', userStore.userInfo?.email),
      fieldName: 'ownerEmail',
      label: 'Email',
    },
    {
      component: 'InputNumber',
      componentProps: {
        controls: false,
        max: 100,
        min: 0,
        addonAfter: '%',
      },
      help: 'Example: The product A has been removed and the price is $100. If the COGS Rate is 75%, the cost of goods sold will be $75.',
      defaultValue: toPercentage(shopSettingStore.cogsRate),
      fieldName: 'cogsRate',
      label: 'COGS Rate',
    },
    {
      component: 'Divider',
      fieldName: '_divider',
      renderComponentContent: () => {
        return {
          default: () => h('div', 'Currency Converter Display'),
        };
      },
      hideLabel: true,
      formItemClass: 'col-span-3 !my-0 !py-0',
      componentProps: {
        dashed: true,
        orientation: 'left',
        plain: true,
      },
    },
    {
      component: h('span', shopStore.shop.currency),
      fieldName: 'shopCurrency',
      formItemClass: 'col-start-1',
      label: 'From Shopify',
    },
    {
      component: 'Select',
      componentProps: {
        filterOption: true,
        options: currencyStore.rates.map((item) => ({
          label: item.currency,
          value: item.currency,
        })),
        showSearch: true,
      },
      defaultValue: shopStore.shop.currencyFromApp,
      fieldName: 'appCurrency',
      label: 'App display',
    },
    {
      component: h('span'),
      fieldName: 'currencyRate',
      label: 'Rate',
      hideLabel: state.appCurrency === shopStore.shop.currency,
    },
  ],
  wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
});

function onSubmit(values: Record<string, any>) {
  formApi.setState({
    submitButtonOptions: {
      loading: true,
    },
  });

  shopStore.updateSetting(values).then(() => {
    formApi.setState({
      submitButtonOptions: {
        loading: false,
      },
    });
    message.success({
      content: 'The settings have been saved.',
    });
  });
}
</script>

<template>
  <Page auto-content-height>
    <Card title="Shop settings">
      <ShopSettingForm>
        <template #currencyRate>
          <span v-if="state.appCurrency !== shopStore.shop.currency">{{
            displayRate
          }}</span>
        </template>
      </ShopSettingForm>
    </Card>
  </Page>
</template>
