<script lang="ts" setup>
import { computed, h, reactive } from 'vue';

import { Page } from '@vben/common-ui';
import { useUserStore } from '@vben/stores';

import { Card, Divider, message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { useCurrencyStore, useShopStore } from '#/store';

const userStore = useUserStore();
const shopStore = useShopStore();
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
      component: h(
        'span',
        shopStore.shop.domain ?? shopStore.shop.myshopifyDomain,
      ),
      fieldName: 'domain',
      label: 'Domain',
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
      component: 'Divider',
      fieldName: 'system-state',
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

  shopStore.updateAppCurrency(values.appCurrency).then(() => {
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
        <template #system-state="slotProps">
          <Divider v-bind="slotProps">Currency Converter Display</Divider>
        </template>
        <template #currencyRate>
          <span v-if="state.appCurrency !== shopStore.shop.currency">{{
            displayRate
          }}</span>
        </template>
      </ShopSettingForm>
    </Card>
  </Page>
</template>
