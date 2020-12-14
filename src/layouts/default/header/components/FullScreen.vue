<template>
  <Tooltip :title="getTitle" placement="bottom" :mouseEnterDelay="0.5">
    <span @click="toggleFullscreen">
      <FullscreenOutlined v-if="!isFullscreen" />
      <FullscreenExitOutlined v-else />
    </span>
  </Tooltip>
</template>
<script lang="ts">
  import { defineComponent, computed, unref } from 'vue';
  import { Tooltip } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useFullscreen } from '/@/hooks/web/useFullScreen';
  import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons-vue';
  export default defineComponent({
    name: 'FullScreen',
    components: { FullscreenExitOutlined, FullscreenOutlined, Tooltip },

    setup() {
      const { t } = useI18n();
      const { toggleFullscreen, isFullscreenRef } = useFullscreen();

      const getTitle = computed(() => {
        return unref(isFullscreenRef)
          ? t('layout.header.tooltipExitFull')
          : t('layout.header.tooltipEntryFull');
      });

      return {
        getTitle,
        isFullscreen: isFullscreenRef,
        toggleFullscreen,
      };
    },
  });
</script>
