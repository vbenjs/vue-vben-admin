<template>
  <MenuItem :class="getLevelClass">
    <MenuContent v-bind="$props" :item="item" />
  </MenuItem>
</template>
<script lang="ts">
  import { defineComponent, computed } from 'vue';
  import { Menu } from 'ant-design-vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { itemProps } from '../props';

  import MenuContent from '../MenuContent';
  export default defineComponent({
    name: 'BasicMenuItem',
    components: { MenuItem: Menu.Item, MenuContent },
    props: itemProps,
    setup(props) {
      const { prefixCls } = useDesign('basic-menu-item');

      const getLevelClass = computed(() => {
        const { appendClass, level, item, parentPath, theme } = props;
        const isAppendActiveCls = appendClass && level === 1 && item.path === parentPath;

        const levelCls = [
          `${prefixCls}__level${level}`,
          theme,
          {
            'top-active-menu': isAppendActiveCls,
          },
        ];
        return levelCls;
      });
      return {
        prefixCls,
        getLevelClass,
      };
    },
  });
</script>
