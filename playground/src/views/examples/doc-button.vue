<script lang="ts" setup>
import { VBEN_DOC_URL } from '@vben/constants';
import { openWindow } from '@vben/utils';

import { Button } from 'ant-design-vue';

const props = defineProps<{ path: string }>();

function handleClick() {
  openWindow(VBEN_DOC_URL + props.path);
}
</script>

<template>
  <Button @click="handleClick">查看组件文档</Button>
</template>
