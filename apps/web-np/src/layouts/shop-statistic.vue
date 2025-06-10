<script lang="ts" setup>
import { computed, onMounted, reactive } from 'vue';

import {
  VbenButton,
  VbenIconButton,
  VbenPopover,
  VbenScrollbar,
} from '@vben/common-ui';

import { useToggle } from '@vueuse/core';
import { Tag } from 'ant-design-vue';

import { countProcessingOrders } from '#/api';
import { Statistic } from '#/icons';

const [open, toggle] = useToggle();

const state = reactive({
  loading: false,
  statisticList: [
    {
      title: 'Calculate Order',
      amount: 0,
    },
  ],
});

onMounted(() => {
  loadData();

  // Call loadData every seconds to update the statistic
  setInterval(() => {
    loadData();
  }, 30_000);
});

const loadData = () => {
  state.loading = true;

  countProcessingOrders()
    .then((res) => {
      if (!state.statisticList[0]) {
        return;
      }

      state.statisticList[0].amount = res;
    })
    .finally(() => {
      state.loading = false;
    });
};

const isProcessing = computed(() => {
  return state.statisticList.some((item) => item.amount > 0);
});

const getStatusLabel = (val: any) => {
  if (val > 0) {
    return `Processing ${val} item(s)`;
  }

  return 'Finished';
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

    <div class="relative" v-loading="state.loading">
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

      <div
        class="border-border flex items-center justify-center border-t px-4 py-3"
      >
        <VbenButton
          @click="loadData"
          size="sm"
          variant="ghost"
          :loading="state.loading"
        >
          Refresh
        </VbenButton>
      </div>
    </div>
  </VbenPopover>
</template>

<style scoped></style>
