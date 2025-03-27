<script setup lang="ts">
import { nextTick, onMounted, ref, unref } from 'vue';

import { Page } from '@vben/common-ui';
import { useAppConfig, useScript } from '@vben/hooks';

defineOptions({ name: 'AMap' });
defineProps({
  height: {
    default: 'calc(100vh - 78px)',
    type: String,
  },
  width: {
    default: '100%',
    type: String,
  },
});
const { amapKey } = useAppConfig(import.meta.env, false);
const A_MAP_URL = `https://webapi.amap.com/maps?v=2.0&key=${amapKey}`;

const wrapRef = ref<HTMLDivElement | null>(null);
const { toPromise } = useScript({ src: A_MAP_URL });

async function initMap() {
  await toPromise();
  await nextTick();
  const wrapEl = unref(wrapRef);
  if (!wrapEl) return;
  const AMap = (window as any).AMap;
  const map = new AMap.Map(wrapEl, {
    center: [116.397_428, 39.909_23],
    viewMode: '3D',
    zoom: 11,
  });
  map.on('complete', () => {
    console.warn('地图加载完成');
  });
}

onMounted(async () => {
  await initMap();
});
</script>

<template>
  <Page title="高德地图">
    <div ref="wrapRef" :style="{ width, height }"></div>
  </Page>
</template>

<style scoped></style>
