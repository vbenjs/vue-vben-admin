<script lang="ts" setup>
import { computed, h, reactive } from 'vue';

import { Page, VbenButton } from '@vben/common-ui';
import { useUserStore } from '@vben/stores';

import { Card, message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { cogsSoures } from '#/shared/constants';
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
      fieldName: 'name',
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
      component: h('span'),
      labelClass: 'font-bold',
      formItemClass: 'font-bold',
      fieldName: 'subscriptionName',
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
      component: 'Divider',
      fieldName: '_dividerss',
      renderComponentContent: () => {
        return {
          default: () => h('div', 'Cost of Goods Sold (COGS) & Handling Fees'),
        };
      },
      hideLabel: true,
      formItemClass: 'col-span-1 md:col-span-2 lg:col-span-3 !my-0 !py-0',
      componentProps: {
        dashed: true,
        orientation: 'left',
        plain: true,
      },
    },
    {
      component: 'InputNumber',
      componentProps: {
        controls: false,
        max: 100,
        min: 0,
        addonAfter: '%',
      },
      help: 'Example: Product A has been removed and was priced at $100. With a COGS rate of 75%, the cost of goods sold for that item in the original order would be $75.',
      defaultValue: toPercentage(shopSettingStore.cogsRate),
      fieldName: 'cogsRate',
      label: 'Default Rate',
    },
    {
      component: 'Select',
      help: 'When syncing products from Shopify, the COGS source will either be pulled from the Shopify or set manually.',
      fieldName: 'cogsSource',
      label: 'Source',
      defaultValue: shopSettingStore.cogsSourceDefault,
      componentProps: {
        options: cogsSoures,
      },
    },
    {
      component: 'InputNumber',
      componentProps: {
        // controls: false,
        addonAfter: shopStore.shop.currency,
      },
      help: 'This is the default handling fee for new products. You can change it later in the COGS & Handling Fees settings.',
      defaultValue: shopSettingStore.handlingFees,
      fieldName: 'handlingFees',
      label: 'Handling Fees',
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
      formItemClass: 'col-span-1 md:col-span-2 lg:col-span-3 !my-0 !py-0',
      componentProps: {
        dashed: true,
        orientation: 'left',
        plain: true,
      },
    },
    {
      component: h('span', shopStore.shop.currency),
      fieldName: 'shopCurrency',
      help: 'The currency sync from Shopify',
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
      help: 'The currency display in the app',
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
        <template #subscriptionName>
          <VbenButton
            variant="link"
            class="pl-0"
            @click="shopStore.redirectToPricing"
          >
            {{ shopStore.shop.subscriptionName }} Plan
          </VbenButton>
        </template>
      </ShopSettingForm>
    </Card>
  </Page>
</template>
