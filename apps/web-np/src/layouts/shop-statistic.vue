<script lang="ts" setup>
import type { INotification } from '#/store';

import { computed, onMounted, reactive } from 'vue';

import { VbenIconButton, VbenPopover, VbenScrollbar } from '@vben/common-ui';

import { useToggle } from '@vueuse/core';
import { Tag } from 'ant-design-vue';

import { countProcessingOrders } from '#/api';
import { Statistic } from '#/icons';
import { useShopStore } from '#/store';

const [open, toggle] = useToggle();
const shopStore = useShopStore();

const state = reactive({
  statisticList: [
    {
      title: 'Calculate Order',
      amount: 0,
    },
  ],
});

onMounted(() => {
  loadData();

  shopStore.pusherChannel.bind(
    shopStore.pusherEventName,
    (payload: INotification) => {
      if (payload.reloadStatistic) {
        loadData();
      }
    },
  );
});

const loadData = () => {
  countProcessingOrders().then((res) => {
    if (!state.statisticList[0]) {
      return;
    }

    state.statisticList[0].amount = res;
  });
};

const isProcessing = computed(() => {
  return state.statisticList.some((item) => item.amount > 0);
});

const getStatusLabel = (val: any) => {
  if (val > 0) {
    return `Processing ${val} item(s)`;
  }

  return 'Done';
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
          <Statistic class="size-5" :class="{ 'animate-spin': isProcessing }" />
        </VbenIconButton>
      </div>
    </template>

    <div class="relative">
      <div class="flex items-center justify-between p-4 py-3">
        <div class="text-foreground">System Statistic</div>
      </div>
      <VbenScrollbar>
        <ul class="!flex max-h-[360px] w-full flex-col">
          <template v-for="item in state.statisticList" :key="item.title">
            <li
              class="hover:bg-accent border-border relative flex w-full items-start gap-5 border-t px-5 py-3"
            >
              <div class="flex w-full items-end justify-between leading-none">
                <div class="text-sm">{{ item.title }}</div>
                <Tag color="success" class="text-center">
                  {{ getStatusLabel(item.amount) }}
                </Tag>
              </div>
            </li>
          </template>
        </ul>
      </VbenScrollbar>
    </div>
  </VbenPopover>
</template>

<style scoped></style>
