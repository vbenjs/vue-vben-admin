<script lang="ts" setup>
import { ref } from 'vue';

import { Page, VResize } from '@vben/common-ui';

const width = ref(200);
const height = ref(200);
const top = ref(200);
const left = ref(200);

const resize = (newRect: {
  height: number;
  left: number;
  top: number;
  width: number;
}) => {
  width.value = newRect.width;
  height.value = newRect.height;
  top.value = newRect.top;
  left.value = newRect.left;
};
</script>

<template>
  <Page description="Resize组件基础示例" title="Resize组件">
    <div class="m-4 bg-blue-500 p-48 text-xl">
      {{
        `width: ${width}px, height: ${height}px, top: ${top}px, left: ${left}px`
      }}
    </div>

    <VResize
      :h="200"
      :is-active="true"
      :w="200"
      :x="200"
      :y="200"
      @dragging="resize"
      @resizing="resize"
    >
      <div class="h-full w-full bg-red-500"></div>
    </VResize>
  </Page>
</template>
