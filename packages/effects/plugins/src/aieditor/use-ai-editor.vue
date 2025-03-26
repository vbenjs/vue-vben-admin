<script setup lang="ts">
import type { CSSProperties } from 'vue';

import type { VbenAIEditorProps } from './types';

import { computed } from 'vue';

const props = withDefaults(defineProps<VbenAIEditorProps>(), {
  isDark: false,
  height: '100%',
  width: 'calc(100% - 2rem - 2px)',
});

const containerPanelStyle = computed((): CSSProperties => {
  return {
    minHeight: 'calc(100vh - 130px)',
    height: '100%',
    margin: '0 auto',
    backgroundColor: props.isDark ? '#1E2022' : '#fff',
    width: props.width,
    // border: '1px solid rgb(229 231 235)',
  };
});

const aieContainerStyle = computed((): CSSProperties => {
  return {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: props.isDark ? '#1A1B1E' : '#f3f4f6',
    borderColor: 'var(--aie-border-color)',
    border: '0',
  };
});

const aieMainStyle = computed((): CSSProperties => {
  return {
    position: 'relative',
    height: '100%',
    padding: '1rem 0 0 0',
  };
});

const headerPanelStyle = computed((): CSSProperties => {
  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '60px',
    backgroundColor: props.isDark ? '#1A1B1E' : '#fff',
  };
});
</script>

<template>
  <div :style="aieContainerStyle" class="aie-container">
    <div :style="headerPanelStyle" class="aie-container-header">
      <div class="aie-container-header"></div>
    </div>
    <div class="aie-main" :style="aieMainStyle">
      <div class="aie-container-main" :style="containerPanelStyle">
        <div class="aie-container-main"></div>
      </div>
    </div>
    <div class="aie-container-footer"></div>
  </div>
</template>

<style>
.tippy-box {
  background-color: transparent;
}

.aie-container-header > aie-header > div {
  border-bottom: 0;
}

.aie-container-footer > aie-footer > div {
  /* display: none; */
  border: 0;
}

@media screen and (max-width: 1280px) {
  .aie-directory {
    display: none;
  }
}

@media screen and (max-width: 1400px) {
  .aie-directory {
    width: 200px;
  }
}
</style>
