<script lang="ts" setup>
import { nextTick, onMounted, watch } from 'vue';

import mediumZoom from 'medium-zoom';
import { useRoute } from 'vitepress';
import DefaultTheme from 'vitepress/theme';

const { Layout } = DefaultTheme;
const route = useRoute();

const initZoom = () => {
  // mediumZoom('[data-zoomable]', { background: 'var(--vp-c-bg)' });
  mediumZoom('.VPContent img', { background: 'var(--vp-c-bg)' });
};

watch(
  () => route.path,
  () => nextTick(() => initZoom()),
);

onMounted(() => {
  initZoom();
});
</script>

<template>
  <Layout />
</template>

<style>
.medium-zoom-overlay,
.medium-zoom-image--opened {
  z-index: 2147483647;
}
</style>
