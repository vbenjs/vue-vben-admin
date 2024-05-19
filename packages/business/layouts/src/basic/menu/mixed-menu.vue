<script lang="ts" setup>
import type { NormalMenuProps } from '@vben-core/menu-ui';
import type { MenuRecordRaw } from '@vben-core/typings';

import { NormalMenu } from '@vben-core/menu-ui';

import { useAccessStore } from '@vben/stores';
import { computed, onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';

import { findMenuByPath } from './helper';

interface Props extends NormalMenuProps {}

defineProps<Props>();

const emit = defineEmits<{
  defaultSelect: [MenuRecordRaw, MenuRecordRaw?];
  enter: [MenuRecordRaw];
  select: [MenuRecordRaw];
}>();

const accessStore = useAccessStore();
const route = useRoute();

const menus = computed(() => accessStore.getAccessMenus);

function handleSelect(menu: MenuRecordRaw) {
  emit('select', menu);
}

onBeforeMount(() => {
  const menu = findMenuByPath(menus.value, route.path);
  if (menu) {
    const rootMenu = menus.value.find(
      (item) => item.path === menu.parents?.[0],
    );
    emit('defaultSelect', menu, rootMenu);
  }
});
</script>

<template>
  <NormalMenu
    :rounded="rounded"
    :collapse="collapse"
    :menus="menus"
    :active-path="activePath"
    :theme="theme"
    @select="handleSelect"
    @enter="(menu) => emit('enter', menu)"
  />
</template>
