<template>
  <Tooltip placement="top">
    <template #title>
      <span>{{ t('component.table.settingFullScreen') }}</span>
    </template>
    <FullscreenOutlined @click="toggle" v-if="!isFullscreen" />
    <FullscreenExitOutlined @click="toggle" v-else />
  </Tooltip>
</template>
<script lang="ts" setup>
  import { Tooltip } from 'ant-design-vue';
  import { FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons-vue';
  import { useFullscreen } from '@vueuse/core';
  import { useI18n } from '@/hooks/web/useI18n';
  import { useTableContext } from '../../hooks/useTableContext';

  defineOptions({ name: 'FullScreenSetting' });

  const table = useTableContext();
  const { t } = useI18n();
  const { toggle, isFullscreen } = useFullscreen(table.wrapRef);
</script>
