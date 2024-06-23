<script setup lang="ts">
import { echartsInstance, ECOption } from './index';
import { onMounted, ref, unref, warn } from 'vue';
import { usePreferences } from '@vben-core/preferences';
const { isDark } = usePreferences();
interface Props {
  height?: string;
  width?: string;
}
withDefaults(defineProps<Props>(), {
  height: '500px',
  width: '100%',
});

const instance = ref();
const instanceRef = ref(HTMLElement);
onMounted(() => {
  instance.value = echartsInstance.init(
    instanceRef.value,
    isDark.value ? 'dark' : '',
  );
});
const setChart = (option: ECOption, clear: boolean = true) => {
  const c = unref(instance);
  if (!c) {
    warn('instance is null');
    return;
  }
  if (clear) c.clear();
  c.setOption(option);
};
defineExpose({ setChart });
</script>

<template>
  <div ref="instanceRef" :style="{ height, width }"></div>
</template>
