<script lang="ts" setup>
import { onMounted } from 'vue';

import {
  VbenButton,
  VbenIconButton,
  VbenPopover,
  VbenScrollbar,
} from '@vben/common-ui';
import { useAccessStore } from '@vben/stores';

import { useToggle } from '@vueuse/core';
import { Tag } from 'ant-design-vue';

import { Statistic } from '#/icons';
import { StateStatus } from '#/shared/constants';
import { useSystemStatisticStore } from '#/store';

const [open, toggle] = useToggle();
const systemStatisticStore = useSystemStatisticStore();
const accessStore = useAccessStore();

onMounted(() => {
  systemStatisticStore.loadData();

  // Call loadData every seconds to update the statistic
  setInterval(() => {
    if (!accessStore.accessToken) {
      return;
    }

    systemStatisticStore.loadData();
  }, 30_000);
});

const getStatusLabel = (val: any) => {
  if (val === StateStatus.PROCESSED) {
    return 'Finished';
  }

  return 'Processing';
};
</script>
<template>
  <VbenPopover
    v-model:open="open"
    content-class="relative right-2 w-[360px] p-0"
  >
    <template #trigger>
      <div class="flex-center mr-1 h-full" @click.stop="toggle()">
        <VbenIconButton class="bell-button text-foreground relative">
          <Statistic
            class="size-5"
            :class="{ 'animate-spin': systemStatisticStore.isProcessing }"
          />
        </VbenIconButton>
      </div>
    </template>
    <div class="relative" v-loading="systemStatisticStore.loading">
      <div class="flex items-center justify-between p-4 py-3">
        <div class="text-foreground">System Statistic</div>
      </div>
      <VbenScrollbar>
        <ul class="!flex max-h-[360px] w-full flex-col">
          <li
            class="hover:bg-accent border-border relative flex w-full items-start gap-5 border-t px-5 py-3"
          >
            <div class="flex w-full items-end justify-between leading-none">
              <div class="text-sm">Calculate Order</div>
              <Tag color="success" class="text-center">
                {{ getStatusLabel(systemStatisticStore.calcOrder) }}
              </Tag>
            </div>
          </li>
          <li class="hover:bg-accent relative w-full px-5 py-2">
            <div class="flex w-full items-end justify-between leading-none">
              <div class="text-sm">Sync Orders</div>
              <Tag color="success" class="text-center">
                {{ getStatusLabel(systemStatisticStore.syncShopifyOrder) }}
              </Tag>
            </div>
          </li>
          <li class="hover:bg-accent relative w-full px-5 py-2">
            <div class="flex w-full items-end justify-between leading-none">
              <div class="text-sm">Sync Products</div>
              <Tag color="success" class="text-center">
                {{ getStatusLabel(systemStatisticStore.syncShopifyProduct) }}
              </Tag>
            </div>
          </li>
          <li class="hover:bg-accent relative w-full px-5 py-2">
            <div class="flex w-full items-end justify-between leading-none">
              <div class="text-sm">Sync Customers</div>
              <Tag color="success" class="text-center">
                {{ getStatusLabel(systemStatisticStore.syncShopifyCustomer) }}
              </Tag>
            </div>
          </li>
        </ul>
      </VbenScrollbar>

      <div
        class="border-border flex items-center justify-center border-t px-4 py-3"
      >
        <VbenButton
          @click="systemStatisticStore.loadData(true)"
          size="sm"
          variant="ghost"
          :loading="systemStatisticStore.loading"
        >
          Refresh
        </VbenButton>
      </div>
    </div>
  </VbenPopover>
</template>

<style scoped></style>
