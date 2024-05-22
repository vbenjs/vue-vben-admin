<script lang="ts" setup>
import type { MenuRecordRaw } from '@vben-core/typings';

import { Menu, MenuProps } from '@vben-core/menu-ui';

interface Props extends MenuProps {
  menus?: MenuRecordRaw[];
}

const props = withDefaults(defineProps<Props>(), {
  accordion: true,
  menus: () => [],
});

const emit = defineEmits<{
  select: [string, string?];
}>();

function handleMenuSelect(key: string) {
  emit('select', key, props.mode);
}
</script>

<template>
  <Menu
    :rounded="rounded"
    :collapse-show-title="collapseShowTitle"
    :collapse="collapse"
    :accordion="accordion"
    :default-active="defaultActive"
    :menus="menus"
    :theme="theme"
    :mode="mode"
    @select="handleMenuSelect"
  />
</template>
