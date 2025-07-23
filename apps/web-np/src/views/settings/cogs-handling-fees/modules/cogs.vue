<script lang="ts" setup>
import type { IProduct } from '../table-config';

import { onMounted, reactive } from 'vue';

import { VbenButton } from '@vben/common-ui';

import { InputNumber } from 'ant-design-vue';

import { AntHistory } from '#/icons';
import { formatMoney } from '#/shared/utils';
import { useShopStore } from '#/store';

import { isShopifyCogsSource } from '../table-config';

const props = defineProps<{
  product: IProduct;
}>();

const emits = defineEmits(['openHistoryModal', 'change']);
const shopStore = useShopStore();

const state = reactive({
  cogsValue: 0,
});

onMounted(() => {
  state.cogsValue = props.product.cogs || 0;
});
</script>
<template>
  <div v-if="!product.cogsSourceShow">
    <template v-if="product.cogsMin === product.cogsMax">
      {{ formatMoney(product.cogsMin, shopStore.shop.currency) }}
    </template>
    <template v-else>
      {{ formatMoney(product.cogsMin, shopStore.shop.currency) }}
      ~
      {{ formatMoney(product.cogsMax, shopStore.shop.currency) }}
    </template>
  </div>
  <div v-else-if="isShopifyCogsSource(product)">
    {{ formatMoney(product.cogsShopify, shopStore.shop.currency) }}
  </div>

  <div v-else class="flex items-center justify-end space-x-2">
    <VbenButton
      @click="emits('openHistoryModal')"
      :disabled="product.loading"
      variant="outline"
      size="icon"
      class="size-6"
      v-tippy="{
        content: 'Set COGS based on historical date',
      }"
    >
      <AntHistory class="size-4" />
    </VbenButton>

    <InputNumber
      class="w-full"
      :min="0"
      :addon-after="shopStore.shop.currency"
      :disabled="product.loading"
      v-model:value="state.cogsValue"
      @change="emits('change', $event)"
      size="small"
    />
  </div>
</template>

<div class="flex items-center justify-end space-x-2"></div>
