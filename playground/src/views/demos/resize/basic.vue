<script lang="ts" setup>
import { ref } from 'vue';

import { VResize } from '@vben/common-ui';

const width = ref(0);
const height = ref(0);
const top = ref(0);
const left = ref(0);

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
  <VResize
    :h="200"
    :is-active="true"
    :w="200"
    @dragging="resize"
    @resizing="resize"
  />
</template>
