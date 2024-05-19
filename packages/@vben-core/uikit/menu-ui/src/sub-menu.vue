<script setup lang="ts">
import type { MenuRecordRaw } from '@vben-core/typings';

import { VbenMenuBadge } from '@vben-core/shadcn-ui';

import { computed } from 'vue';

import { MenuItem, SubMenu as SubMenuComp } from './components';
// eslint-disable-next-line import/no-self-import
import SubMenu from './sub-menu.vue';

interface Props {
  /**
   * 菜单项
   */
  menu: MenuRecordRaw;
}

defineOptions({
  name: 'SubMenuUi',
});

const props = withDefaults(defineProps<Props>(), {});

/**
 * 判断是否有子节点，动态渲染 menu-item/sub-menu-item
 */
const hasChildren = computed(() => {
  const { menu } = props;
  return (
    Reflect.has(menu, 'children') && !!menu.children && menu.children.length > 0
  );
});
</script>

<template>
  <MenuItem
    v-if="!hasChildren"
    :key="menu.path"
    :path="menu.path"
    :icon="menu.icon"
    :badge="menu.badge"
    :badge-type="menu.badgeType"
    :badge-variants="menu.badgeVariants"
  >
    <template #title>{{ menu.name }}</template>
  </MenuItem>
  <SubMenuComp
    v-else
    :key="`${menu.path}_sub`"
    :path="menu.path"
    :icon="menu.icon"
  >
    <template #content>
      <VbenMenuBadge
        :badge="menu.badge"
        :badge-type="menu.badgeType"
        :badge-variants="menu.badgeVariants"
      />
    </template>
    <template #title>{{ menu.name }}</template>
    <template v-for="childItem in menu.children || []" :key="childItem.path">
      <SubMenu :menu="childItem" />
    </template>
  </SubMenuComp>
</template>
