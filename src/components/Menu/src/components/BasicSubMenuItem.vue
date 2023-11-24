<template>
  <BasicMenuItem v-if="!menuHasChildren(item) && getShowMenu" v-bind="$props" />
  <Menu.SubMenu
    v-if="menuHasChildren(item) && getShowMenu"
    :class="[theme]"
    :key="`submenu-${item.path}`"
    popupClassName="app-top-menu-popup"
  >
    <template #title>
      <MenuItemContent v-bind="$props" :item="item" />
    </template>

    <template v-for="childrenItem in item.children || []" :key="childrenItem.path">
      <BasicSubMenuItem v-bind="$props" :item="childrenItem" />
    </template>
  </Menu.SubMenu>
</template>
<script lang="ts" setup>
  import type { Menu as MenuType } from '@/router/types';
  import { computed } from 'vue';
  import { Menu } from 'ant-design-vue';
  import { itemProps } from '../props';
  import BasicMenuItem from './BasicMenuItem.vue';
  import MenuItemContent from './MenuItemContent.vue';

  defineOptions({ name: 'BasicSubMenuItem', isSubMenu: true });

  const props = defineProps(itemProps);

  const getShowMenu = computed(() => !props.item.meta?.hideMenu);
  function menuHasChildren(menuTreeItem: MenuType): boolean {
    return (
      !menuTreeItem.meta?.hideChildrenInMenu &&
      Reflect.has(menuTreeItem, 'children') &&
      !!menuTreeItem.children &&
      menuTreeItem.children.length > 0
    );
  }
</script>
