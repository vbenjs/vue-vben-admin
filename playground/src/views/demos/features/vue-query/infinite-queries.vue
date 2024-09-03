<script setup lang="ts">
import type { IProducts } from './typing';

import { nextTick, onMounted, onUnmounted, ref } from 'vue';

import { useInfiniteQuery } from '@tanstack/vue-query';

const LIMIT = 10;
const fetchProducts = async ({ pageParam = 0 }): Promise<IProducts> => {
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
  initialPageParam: 0,
  queryFn: fetchProducts,
  queryKey: ['products'],
});

const container = ref<HTMLDivElement | null>(null);
const loader = ref<HTMLDivElement | null>(null);

let observer: IntersectionObserver;

const checkAndLoad = () => {
  if (container.value && loader.value) {
    const containerHeight = container.value.clientHeight;
    const viewportHeight = window.innerHeight;
    if (
      containerHeight < viewportHeight &&
      hasNextPage.value &&
      !isFetchingNextPage.value
    ) {
      fetchNextPage();
    }
  }
};

onMounted(() => {
  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry?.isIntersecting) {
        fetchNextPage();
      }
    },
    { threshold: 1 },
  );

  if (loader.value) {
    observer.observe(loader.value);
  }

  nextTick(() => {
    checkAndLoad();
  });

  window.addEventListener('resize', checkAndLoad);
});

onUnmounted(() => {
  if (observer && loader.value) {
    observer.unobserve(loader.value);
  }
  window.removeEventListener('resize', checkAndLoad);
});
</script>

<template>
  <div ref="container">
    <span v-if="isPending">Loading...</span>
    <span v-else-if="isError">Error: {{ error?.message }}</span>
    <div v-else-if="data">
      <span v-if="isFetching && !isFetchingNextPage">Fetching...</span>
      <ul v-for="(group, index) in data.pages" :key="index">
        <li v-for="product in group.products" :key="product.id">
          {{ product.title }}
        </li>
      </ul>
      <div ref="loader" class="w-full text-center">
        <span v-if="isFetchingNextPage">Loading more...</span>
        <span v-else-if="hasNextPage">Load More</span>
        <span v-else>Nothing more to load</span>
      </div>
    </div>
  </div>
</template>
