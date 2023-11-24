<template>
  <Menu.Item :key="item.path">
    <MenuItemContent v-bind="$props" :item="item" />
  </Menu.Item>
</template>
<script lang="ts" setup>
  import { Menu } from 'ant-design-vue';
  import { itemProps } from '../props';
  import MenuItemContent from './MenuItemContent.vue';

  defineOptions({ name: 'BasicMenuItem' });

  defineProps(itemProps);
</script>
