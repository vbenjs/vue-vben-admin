<template>
  <span :class="`${prefixCls}__extra-fold`" @click="handleFold">
    <VbenIcon :icon="getIcon" />
  </span>
</template>
<script lang="ts">
  import { VbenIcon } from '@vben/icons';
  import { computed, defineComponent, unref } from 'vue';

  import { useHeaderSetting } from '@/hooks/setting/useHeaderSetting';
  import { useMenuSetting } from '@/hooks/setting/useMenuSetting';
  import { useDesign } from '@/hooks/web/useDesign';
  import { triggerWindowResize } from '@/utils/event';

  export default defineComponent({
    name: 'FoldButton',
    components: { VbenIcon },
    setup() {
      const { prefixCls } = useDesign('multiple-tabs-content');
      const { getShowMenu, setMenuSetting } = useMenuSetting();
      const { getShowHeader, setHeaderSetting } = useHeaderSetting();

      const getIsUnFold = computed(() => !unref(getShowMenu) && !unref(getShowHeader));

      const getIcon = computed(() =>
        unref(getIsUnFold) ? 'codicon:screen-normal' : 'codicon:screen-full',
      );

      function handleFold() {
        const isUnFold = unref(getIsUnFold);
        setMenuSetting({
          show: isUnFold,
          hidden: !isUnFold,
        });
        setHeaderSetting({ show: isUnFold });
        triggerWindowResize();
      }

      return { prefixCls, getIcon, handleFold };
    },
  });
</script>
