<template>
  <Tooltip placement="top">
    <template #title>
      <span>{{ t('component.table.settingFullScreen') }}</span>
    </template>
    <FullscreenOutlined @click="handleFullScreen" v-if="!isFullscreenRef" />
    <FullscreenExitOutlined @click="handleFullScreen" v-else />
  </Tooltip>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { useTableContext } from '../../hooks/useTableContext';
  import { Tooltip } from 'ant-design-vue';
  import { FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons-vue';
  import { useFullscreen } from '/@/hooks/web/useFullScreen';
  import { useI18n } from '/@/hooks/web/useI18n';

  export default defineComponent({
    name: 'FullScreenSetting',
    components: {
      FullscreenExitOutlined,
      FullscreenOutlined,
      Tooltip,
    },

    setup() {
      const table = useTableContext();
      const { t } = useI18n();

      const { toggleFullscreen, isFullscreenRef } = useFullscreen(table.wrapRef);

      function handleFullScreen() {
        toggleFullscreen();
      }

      return {
        handleFullScreen,
        isFullscreenRef,
        t,
      };
    },
  });
</script>
