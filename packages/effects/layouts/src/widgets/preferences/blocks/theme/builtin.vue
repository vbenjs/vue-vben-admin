<script setup lang="ts">
import type { BuiltinThemeType } from '@vben/types';

import { computed, ref } from 'vue';

import { UserRoundPen } from '@vben/icons';
import { $t } from '@vben/locales';
import {
  BUILT_IN_THEME_PRESETS,
  type BuiltinThemePreset,
} from '@vben/preferences';
import { convertToHsl, TinyColor } from '@vben/utils';

defineOptions({
  name: 'PreferenceBuiltinTheme',
});

const props = defineProps<{ isDark: boolean }>();

const colorInput = ref();
const modelValue = defineModel<BuiltinThemeType>({ default: 'default' });
const themeColorPrimary = defineModel<string>('themeColorPrimary');

const inputValue = computed(() => {
  return new TinyColor(themeColorPrimary.value).toHexString();
});

const builtinThemePresets = computed(() => {
  return [
    // {
    //   color: 'hsl(231 98% 65%)',
    //   type: 'default',
    // },
    ...BUILT_IN_THEME_PRESETS,
  ];
});

function typeView(name: BuiltinThemeType) {
  switch (name) {
    case 'default': {
      return $t('preferences.theme.builtin.default');
    }
    case 'violet': {
      return $t('preferences.theme.builtin.violet');
    }
    case 'pink': {
      return $t('preferences.theme.builtin.pink');
    }
    case 'rose': {
      return $t('preferences.theme.builtin.rose');
    }
    case 'sky-blue': {
      return $t('preferences.theme.builtin.skyBlue');
    }
    case 'deep-blue': {
      return $t('preferences.theme.builtin.deepBlue');
    }

    case 'green': {
      return $t('preferences.theme.builtin.green');
    }
    case 'deep-green': {
      return $t('preferences.theme.builtin.deepGreen');
    }
    case 'orange': {
      return $t('preferences.theme.builtin.orange');
    }
    case 'yellow': {
      return $t('preferences.theme.builtin.yellow');
    }
    case 'zinc': {
      return $t('preferences.theme.builtin.zinc');
    }
    case 'neutral': {
      return $t('preferences.theme.builtin.neutral');
    }
    case 'slate': {
      return $t('preferences.theme.builtin.slate');
    }
    case 'gray': {
      return $t('preferences.theme.builtin.gray');
    }
    case 'custom': {
      return $t('preferences.theme.builtin.custom');
    }
  }
}

function handleSelect(theme: BuiltinThemePreset) {
  modelValue.value = theme.type;
  const primaryColor = props.isDark
    ? theme.darkPrimaryColor || theme.primaryColor
    : theme.primaryColor;

  themeColorPrimary.value = primaryColor || theme.color;
}

function handleInputChange(e: Event) {
  const target = e.target as HTMLInputElement;
  themeColorPrimary.value = convertToHsl(target.value);
}

function selectColor() {
  colorInput.value?.[0]?.click?.();
}
</script>

<template>
  <div class="flex w-full flex-wrap justify-between">
    <template v-for="theme in builtinThemePresets" :key="theme.type">
      <div class="flex cursor-pointer flex-col" @click="handleSelect(theme)">
        <div
          :class="{
            'outline-box-active': theme.type === modelValue,
          }"
          class="outline-box flex-center group cursor-pointer"
        >
          <template v-if="theme.type !== 'custom'">
            <div
              :style="{ backgroundColor: theme.color }"
              class="mx-10 my-2 size-5 rounded-md"
            ></div>
          </template>
          <template v-else>
            <div class="size-full px-10 py-2" @click.stop="selectColor">
              <div class="flex-center relative size-5 rounded-sm">
                <UserRoundPen
                  class="absolute z-10 size-5 opacity-60 group-hover:opacity-100"
                />
                <input
                  ref="colorInput"
                  :value="inputValue"
                  class="absolute inset-0 opacity-0"
                  type="color"
                  @input="handleInputChange"
                />
              </div>
            </div>
          </template>
        </div>
        <div class="text-muted-foreground my-2 text-center text-xs">
          {{ typeView(theme.type) }}
        </div>
      </div>
    </template>
  </div>
</template>
