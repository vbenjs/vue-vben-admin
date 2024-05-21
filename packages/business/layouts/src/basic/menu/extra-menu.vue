<script lang="ts" setup>
import type { MenuRecordRaw } from '@vben-core/typings';

import { Menu, MenuProps } from '@vben-core/menu-ui';

import { useRoute } from 'vue-router';

import { useNavigation } from './use-navigation';

interface Props extends MenuProps {
  collspae?: boolean;
  menus: MenuRecordRaw[];
}

defineProps<Props>();

const route = useRoute();
const { navigation } = useNavigation();

async function handleSelect(key: string) {
  await navigation(key);
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
