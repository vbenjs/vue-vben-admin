<script lang="ts" setup>
import { onMounted, reactive } from 'vue';

import { useDebounceFn } from '@vueuse/core';
import { Select as ASelect, Image, Spin } from 'ant-design-vue';

import { productGetList } from '#/api';
import { useShopStore } from '#/store';

const products = defineModel<string[]>({
  default: [],
});

const shopStore = useShopStore();

onMounted(() => {
  handleSearch('');
});

const state = reactive({
  data: [],
  value: [],
  fetching: false,
});

const handleSearch = useDebounceFn((value: string) => {
  state.fetching = true;

  productGetList({
    pageSize: 50,
    name: value,
  })
    .then((res) => {
      state.data = res.items.map((item: any) => ({
        value: item.id,
        label: item.name,
        image: item.image,
      }));
    })
    .finally(() => {
      state.fetching = false;
    });
}, 1000);
</script>
<template>
  <div>
    <ASelect
      v-model:value="products"
      @search="handleSearch"
      :filter-option="false"
      :not-found-content="state.fetching ? undefined : null"
      :options="state.data"
      mode="multiple"
      style="width: 100%"
      placeholder="Select at least one product"
      :disabled="shopStore.isFreeSubscription"
    >
      <template #option="{ label, image }">
        <div class="my-1 flex items-center justify-start space-x-2">
          <div class="h-[35px] w-[35px] flex-none">
            <Image
              v-if="image"
              :src="image"
              class="!h-[35px] !w-[35px] rounded-lg border"
            />
          </div>
          <div>{{ label }}</div>
        </div>
      </template>
      <!-- <template #tagRender="{ value: val, label, closable, onClose, option }">
        <Tag :closable="closable" style="margin-right: 3px" @close="onClose">
          {{ label }} &nbsp;
          <span role="img" :aria-label="val">
            {{ option ? option.image : '' }}
          </span>
        </Tag>
      </template> -->
      <template v-if="state.fetching" #notFoundContent>
        <Spin size="small" />
      </template>
    </ASelect>
  </div>
</template>
