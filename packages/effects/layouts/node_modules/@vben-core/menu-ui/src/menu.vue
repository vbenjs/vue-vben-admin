<script setup lang="ts">
import type { MenuRecordRaw } from '@vben-core/typings';

import type { MenuProps } from './types';

import { useForwardProps } from '@vben-core/composables';

import { Menu } from './components';
import SubMenu from './sub-menu.vue';

interface Props extends MenuProps {
  menus: MenuRecordRaw[];
}

defineOptions({
  name: 'MenuView',
});

const props = withDefaults(defineProps<Props>(), {
  collapse: false,
  // theme: 'dark',
});

const forward = useForwardProps(props);

// const emit = defineEmits<{
//   'update:openKeys': [key: Key[]];
//   'update:selectedKeys': [key: Key[]];
// }>();
</script>

<template>
  <Menu v-bind="forward">
    <template v-for="menu in menus" :key="menu.path">
      <SubMenu :menu="menu" />
    </template>
  </Menu>
</template>
