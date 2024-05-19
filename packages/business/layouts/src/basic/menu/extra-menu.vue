<script lang="ts" setup>
import type { MenuRecordRaw } from '@vben-core/typings';

import { Menu, MenuProps } from '@vben-core/menu-ui';

import { useRoute, useRouter } from 'vue-router';

interface Props extends MenuProps {
  collspae?: boolean;
  menus: MenuRecordRaw[];
}

defineProps<Props>();

const route = useRoute();
const router = useRouter();

function handleSelect(key: string) {
  router.push(key);
}
</script>

<template>
  <Menu
    :rounded="rounded"
    :collapse="collapse"
    :default-active="route.path"
    :menus="menus"
    :theme="theme"
    mode="vertical"
    @select="handleSelect"
  />
</template>
