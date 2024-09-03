<script setup>
import { useInfiniteQuery } from '@tanstack/vue-query';
import { Button } from 'ant-design-vue';

const LIMIT = 10;
const fetchProjects = async ({ pageParam = 0 }) => {
  const res = await fetch(
    `https://dummyjson.com/products?limit=${LIMIT}&skip=${pageParam * LIMIT}`,
  );
  return res.json();
};

const {
  data,
  error,
  fetchNextPage,
  hasNextPage,
  isError,
  isFetching,
  isFetchingNextPage,
  isPending,
} = useInfiniteQuery({
  getNextPageParam: (current, allPages) => {
    const nextPage = allPages.length + 1;
    const lastPage = current.skip + current.limit;
    if (lastPage === current.total) return;
    return nextPage;
  },
  queryFn: fetchProjects,
  queryKey: ['projects'],
});
</script>

<template>
  <div>
    <span v-if="isPending">Loading...</span>
    <span v-else-if="isError">Error: {{ error.message }}</span>
    <div v-else-if="data">
      <span v-if="isFetching && !isFetchingNextPage">Fetching...</span>
      <ul v-for="(group, index) in data.pages" :key="index">
        <li v-for="product in group.products" :key="product.id">
          {{ product.title }}
        </li>
      </ul>
      <Button
        :disabled="!hasNextPage || isFetchingNextPage"
        @click="() => fetchNextPage()"
      >
        <span v-if="isFetchingNextPage">Loading more...</span>
        <span v-else-if="hasNextPage">Load More</span>
        <span v-else>Nothing more to load</span>
      </Button>
    </div>
  </div>
</template>
