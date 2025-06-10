<script lang="ts" setup>
import { onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';

import { VbenLoading } from '@vben/common-ui';

import { isShopifyEmbedded } from '#/shared/utils';
import { useAuthStore } from '#/store';

const authStore = useAuthStore();
const route = useRoute();

onBeforeMount(() => {
  const queryParams = route.query;

  isShopifyEmbedded()
    ? authStore.authLoginViaShopifySession(queryParams)
    : authStore.authInstall({ myshopifyDomain: queryParams.shop as string });
});
</script>

<template>
  <VbenLoading spinning text="Shopify verifying..." />
</template>
