<script setup lang="ts">
import { MdiEditBoxOutline } from '@vben-core/iconify';
import { TinyColor, convertToHsl } from '@vben-core/toolkit';

import type { CSSProperties } from 'vue';

import { computed, ref, watch, watchEffect } from 'vue';

defineOptions({
  name: 'PreferenceColor',
});

const props = withDefaults(defineProps<{ colorPrimaryPresets: string[] }>(), {
  colorPrimaryPresets: () => [],
});

const colorInput = ref();
const currentColor = ref(props.colorPrimaryPresets?.[0]);

const modelValue = defineModel<string>();

const activeColor = computed((): CSSProperties => {
  return {
    outlineColor: currentColor.value,
    outlineWidth: '2px',
  };
});

function isActive(color: string): string[] {
  return color === currentColor.value ? ['outline-box-active'] : [];
}

const inputStyle = computed((): CSSProperties => {
  return props.colorPrimaryPresets.includes(currentColor.value)
    ? {}
    : activeColor.value;
});

const inputValue = computed(() => {
  return new TinyColor(modelValue.value).toHexString();
});

function selectColor() {
  colorInput.value.click();
}

function handleInputChange(e: Event) {
  const target = e.target as HTMLInputElement;
  modelValue.value = convertToHsl(target.value);
}

// 监听颜色变化，转成系统可识别的 hsl 格式
watch(currentColor, (val) => {
  modelValue.value = convertToHsl(val);
});

watchEffect(() => {
  if (modelValue.value) {
    currentColor.value = modelValue.value;
  }
});
</script>

<template>
  <div class="flex w-full flex-wrap justify-between">
    <template v-for="color in colorPrimaryPresets" :key="color">
      <div
        :class="isActive(color)"
        class="outline-box p-2"
        @click="currentColor = color"
      >
        <div
          :style="{ backgroundColor: color }"
          class="h-6 w-6 rounded-md"
        ></div>
      </div>
    </template>
    <div :style="inputStyle" class="outline-box p-2" @click="selectColor">
      <div class="flex-center bg-accent relative h-6 w-6 rounded-md">
        <MdiEditBoxOutline class="absolute z-10" />
        <input
          ref="colorInput"
          :value="inputValue"
          class="absolute inset-0 opacity-0"
          type="color"
          @input="handleInputChange"
        />
      </div>
    </div>
  </div>
</template>
