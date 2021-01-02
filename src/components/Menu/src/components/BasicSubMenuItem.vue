<template>
  <BasicMenuItem v-if="!menuHasChildren(item) && getShowMenu" v-bind="$props" />
  <SubMenu
    v-if="menuHasChildren(item) && getShowMenu"
    :class="[`${prefixCls}__level${level}`, theme]"
  >
    <template #title>
      <MenuItemContent v-bind="$props" :item="item" />
    </template>
    <!-- <template #expandIcon="{ key }">
      <ExpandIcon :key="key" />
    </template> -->

    <template v-for="childrenItem in item.children || []" :key="childrenItem.path">
      <BasicSubMenuItem v-bind="$props" :item="childrenItem" :level="level + 1" />
    </template>
  </SubMenu>
</template>
<script lang="ts">
  import type { Menu as MenuType } from '/@/router/types';

  import { defineComponent, computed } from 'vue';
  import { Menu } from 'ant-design-vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { itemProps } from '../props';
  import BasicMenuItem from './BasicMenuItem.vue';
  import MenuItemContent from './MenuItemContent.vue';

  // import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';
  export default defineComponent({
    name: 'BasicSubMenuItem',
    isSubMenu: true,
    components: {
      BasicMenuItem,
      SubMenu: Menu.SubMenu,
      MenuItem: Menu.Item,
      MenuItemContent,
      // ExpandIcon: createAsyncComponent(() => import('./ExpandIcon.vue')),
    },
    props: itemProps,
    setup(props) {
      const { prefixCls } = useDesign('basic-menu-item');

      const getShowMenu = computed(() => {
        return !props.item.meta?.hideMenu;
      });
      function menuHasChildren(menuTreeItem: MenuType): boolean {
        return (
          Reflect.has(menuTreeItem, 'children') &&
          !!menuTreeItem.children &&
          menuTreeItem.children.length > 0
        );
      }
      return {
        prefixCls,
        menuHasChildren,
        getShowMenu,
      };
    },
  });
</script>
