<template>
  <span :class="`${prefixCls}__extra-fold`" @click="handleFold">
    <Icon :icon="getIcon" />
  </span>
</template>
<script lang="ts">
  import { defineComponent, unref, computed } from 'vue';
  import { RedoOutlined } from '@ant-design/icons-vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { Tooltip } from 'ant-design-vue';
  import { useHeaderSetting } from '/@/hooks/setting/useHeaderSetting';
  import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';

  import Icon from '/@/components/Icon';

  export default defineComponent({
    name: 'FoldButton',
    components: { RedoOutlined, Tooltip, Icon },

    setup() {
      const { prefixCls } = useDesign('multiple-tabs-content');
      const { getShowMenu, setMenuSetting } = useMenuSetting();
      const { getShowHeader, setHeaderSetting } = useHeaderSetting();

      const getIsUnFold = computed(() => {
        return !unref(getShowMenu) && !unref(getShowHeader);
      });

      const getIcon = computed(() => {
        return unref(getIsUnFold) ? 'codicon:screen-normal' : 'codicon:screen-full';
      });

      function handleFold() {
        const isScale = !unref(getShowMenu) && !unref(getShowHeader);
        setMenuSetting({
          show: isScale,
          hidden: !isScale,
        });
        setHeaderSetting({
          show: isScale,
        });
      }

      return { prefixCls, getIcon, handleFold };
    },
  });
</script>
