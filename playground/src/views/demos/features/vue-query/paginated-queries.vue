<script setup lang="ts">
import { type Ref, ref } from 'vue';

import { keepPreviousData, useQuery } from '@tanstack/vue-query';
import { Button } from 'ant-design-vue';

const fetcher = (page: Ref<number>) =>
  fetch(
    `https://jsonplaceholder.typicode.com/posts?_page=${page.value}&_limit=10`,
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
  <p>Current Page: {{ page }} | Previous data: {{ isPlaceholderData }}</p>
  <Button @click="prevPage">Prev Page</Button>
  <Button @click="nextPage">Next Page</Button>
  <div v-if="isPending">Loading...</div>
  <div v-else-if="isError">An error has occurred: {{ error }}</div>
  <div v-else-if="data">
    <ul>
      <li v-for="item in data" :key="item.id">
        {{ item.title }}
      </li>
    </ul>
  </div>
</template>
