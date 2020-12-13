<template>
  <BasicMenuItem v-if="!menuHasChildren(item)" v-bind="$props" />
  <SubMenu v-else :class="[`${prefixCls}__level${level}`, theme]">
    <template #title>
      <MenuContent v-bind="$props" :item="item" />
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

  import { defineComponent } from 'vue';
  import { Menu } from 'ant-design-vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { itemProps } from '../props';
  import BasicMenuItem from './BasicMenuItem.vue';
  import MenuContent from '../MenuContent';
  // import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';

  export default defineComponent({
    name: 'BasicSubMenuItem',

    components: {
      BasicMenuItem,
      SubMenu: Menu.SubMenu,
      MenuItem: Menu.Item,
      MenuContent,
      // ExpandIcon: createAsyncComponent(() => import('./ExpandIcon.vue')),
    },
    props: itemProps,
    setup() {
      const { prefixCls } = useDesign('basic-menu-item');
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
      };
    },
  });
</script>
