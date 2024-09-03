<script setup lang="ts">
import { type Ref, ref } from 'vue';

import { keepPreviousData, useQuery } from '@tanstack/vue-query';
import { Button } from 'ant-design-vue';

const LIMIT = 10;
const fetcher = (page: Ref<number>) =>
  fetch(
    `https://dummyjson.com/products?limit=${LIMIT}&skip=${page.value * LIMIT}`,
  ).then((response) => response.json());

const page = ref(1);
const { data, error, isError, isPending, isPlaceholderData } = useQuery({
  placeholderData: keepPreviousData,
  queryFn: () => fetcher(page),
  queryKey: ['projects', page],
});
const prevPage = () => {
  page.value = Math.max(page.value - 1, 1);
};
const nextPage = () => {
  if (!isPlaceholderData.value) {
    page.value = page.value + 1;
  }
};
</script>

<template>
  <div class="flex gap-4">
    <p>Current Page: {{ page }}</p>
    <p>Previous data: {{ isPlaceholderData }}</p>
  </div>
  <Button size="small" @click="prevPage">Prev Page</Button>
  <Button size="small" @click="nextPage">Next Page</Button>
  <div class="p-4">
    <div v-if="isPending">Loading...</div>
    <div v-else-if="isError">An error has occurred: {{ error }}</div>
    <div v-else-if="data">
      <ul>
        <li v-for="item in data.products" :key="item.id">
          {{ item.title }}
        </li>
      </ul>
    </div>
  </div>
</template>
