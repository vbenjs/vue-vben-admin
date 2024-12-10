<script lang="ts" setup>
import { ApiComponent } from '@vben/common-ui';

import { Cascader } from 'ant-design-vue';

import { treeData } from './data';
/**
 * 模拟请求接口
 */
function fetchApi(): Promise<Record<string, any>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(treeData);
    }, 1000);
  });
}
</script>
<template>
  <div class="flex items-center gap-3">
    <span>点击下拉时开始加载远程数据</span>
    <ApiComponent
      :api="fetchApi"
      :component="Cascader"
      :immediate="false"
      children-field="children"
      loading-slot="suffixIcon"
      visible-event="onDropdownVisibleChange"
    />
  </div>
</template>
