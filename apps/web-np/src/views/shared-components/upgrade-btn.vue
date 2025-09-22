<script lang="ts" setup>
import { VbenButton } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { useShopStore } from '#/store';

const shopStore = useShopStore();
</script>

<template>
  <VbenButton
    v-if="shopStore.isFreeSubscription"
    @click="shopStore.redirectToPricing"
    size="sm"
    type="primary"
    v-tippy="{
      content: 'Upgrade to Pro Plan to unlock all features',
    }"
  >
    <IconifyIcon class="mr-2 size-4" icon="ant-design:crown-twotone" />
    Purchase Pro
  </VbenButton>
</template>
