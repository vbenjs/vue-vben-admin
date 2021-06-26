<template>
  <MenuItem :key="item.path">
    <!-- <MenuItem :class="getLevelClass"> -->
    <MenuItemContent v-bind="$props" :item="item" />
  </MenuItem>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { Menu } from 'ant-design-vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { itemProps } from '../props';

  import MenuItemContent from './MenuItemContent.vue';
  export default defineComponent({
    name: 'BasicMenuItem',
    components: { MenuItem: Menu.Item, MenuItemContent },
    props: itemProps,
    setup() // props
    {
      const { prefixCls } = useDesign('basic-menu-item');

      // const getLevelClass = computed(() => {
      //   const { level, theme } = props;

      //   const levelCls = [`${prefixCls}__level${level}`, theme];
      //   return levelCls;
      // });
      return {
        prefixCls,
        // getLevelClass,
      };
    },
  });
</script>
