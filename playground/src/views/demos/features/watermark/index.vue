<script lang="ts" setup>
import { useWatermark } from '@vben/hooks';

import { Button } from 'ant-design-vue';

const { destroyWatermark, updateWatermark } = useWatermark();

async function createWaterMark() {
  await updateWatermark({
    advancedStyle: {
      colorStops: [
        {
          color: 'red',
          offset: 0,
        },
        {
          color: 'blue',
          offset: 1,
        },
      ],
      type: 'linear',
    },
    content: 'hello my watermark',
    globalAlpha: 0.5,
    gridLayoutOptions: {
      cols: 2,
      gap: [20, 20],
      matrix: [
        [1, 0],
        [0, 1],
      ],
      rows: 2,
    },
    height: 200,
    layout: 'grid',
    rotate: 22,
    width: 200,
  });
}
</script>

<template>
  <div class="p-5">
    <div class="card-box p-5">
      <h1 class="text-xl font-semibold">水印</h1>
      <div class="text-foreground/80 mt-2">
        水印使用了
        <a
          class="text-primary"
          href="https://zhensherlock.github.io/watermark-js-plus/"
          target="_blank"
        >
          watermark-js-plus
        </a>
        开源插件，详细配置可见插件配置。
      </div>
    </div>

    <div class="card-box mt-5 p-5">
      <div class="mb-3 flex gap-3 text-lg font-semibold">
        <Button type="primary" @click="createWaterMark()">创建水印</Button>
        <Button danger @click="destroyWatermark">移除水印</Button>
      </div>
    </div>
  </div>
</template>
