<script lang="ts" setup>
import { computed } from 'vue';

import { useAntdDesignTokens } from '@vben/hooks';
import { preferences, usePreferences } from '@vben/preferences';

import { App, ConfigProvider, theme } from 'ant-design-vue';

import CommandPalette from '#/components/CommandPalette/index.vue';
import { antdLocale } from '#/locales';

defineOptions({ name: 'App' });

const { isDark } = usePreferences();
const { tokens } = useAntdDesignTokens();

const tokenTheme = computed(() => {
  const algorithm = isDark.value
    ? [theme.darkAlgorithm]
    : [theme.defaultAlgorithm];

  // antd 紧凑模式算法
  if (preferences.app.compact) {
    algorithm.push(theme.compactAlgorithm);
  }

  return {
    algorithm,
    token: tokens,
  };
});
</script>

<template>
  <ConfigProvider :locale="antdLocale" :theme="tokenTheme">
    <App>
      <RouterView />
      <!-- 全局命令面板 (Ctrl+K 唤起) -->
      <CommandPalette />
    </App>
  </ConfigProvider>
</template>

<style>
/* ===== 全局弹窗约束：不超出视口、上下边距一致、内容可滚动 ===== */

/* 弹窗外层容器：使用 flex 垂直居中 */
.ant-modal-wrap {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  overflow: hidden !important;
}

/* 弹窗主体：限制最大高度，上下留出 40px 边距 */
.ant-modal {
  top: 0 !important;
  max-height: calc(100vh - 80px) !important;
  margin: 0 !important;
  padding: 0 !important;
  display: flex !important;
  flex-direction: column !important;
}

/* 弹窗内容区域 */
.ant-modal-content {
  display: flex !important;
  flex-direction: column !important;
  max-height: calc(100vh - 80px) !important;
  overflow: hidden !important;
}

/* 弹窗 body：可滚动 */
.ant-modal-body {
  flex: 1 !important;
  overflow-y: auto !important;
  min-height: 0 !important;
}

/* vben 自带弹窗也适用 */
.vben-modal-body {
  flex: 1 !important;
  overflow-y: auto !important;
  min-height: 0 !important;
}

/* 弹窗底部按钮栏不被挤压 */
.ant-modal-footer {
  flex-shrink: 0 !important;
}

/* 弹窗头部不被挤压 */
.ant-modal-header {
  flex-shrink: 0 !important;
}
</style>
