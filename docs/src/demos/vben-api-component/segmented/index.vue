<script lang="ts" setup>
import { ApiComponent } from '@vben/common-ui';

import { Segmented } from 'ant-design-vue';

import { listData } from './data';

/**
 * 模拟请求接口
 */
function fetchApi(): Promise<Record<string, any>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(listData);
    }, 1000);
  });
}
</script>
<template>
  <ApiComponent :api="fetchApi" :component="Segmented" />
</template>
