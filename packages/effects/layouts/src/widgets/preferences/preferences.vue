<script lang="ts" setup>
import { computed } from 'vue';

import { Settings } from '@vben/icons';
import { $t, loadLocaleMessages } from '@vben/locales';
import { preferences, updatePreferences } from '@vben/preferences';
import { capitalizeFirstLetter } from '@vben/utils';

import { useVbenDrawer } from '@vben-core/popup-ui';
import { VbenButton } from '@vben-core/shadcn-ui';

import PreferencesDrawer from './preferences-drawer.vue';

interface Props {
  /** 是否显示按钮 */
  showButton?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showButton: true,
});

const emit = defineEmits<{ clearPreferencesAndLogout: [] }>();

const [Drawer, drawerApi] = useVbenDrawer({
  connectedComponent: PreferencesDrawer,
});

// 暴露打开抽屉的方法
defineExpose({
  open: () => drawerApi.open(),
});

/**
 * preferences 转成 vue props
 * preferences.widget.fullscreen=>widgetFullscreen
 */
const attrs = computed(() => {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(preferences)) {
    for (const [subKey, subValue] of Object.entries(value)) {
      result[`${key}${capitalizeFirstLetter(subKey)}`] = subValue;
    }
  }
  return result;
});

/**
 * preferences 转成 vue listener
 * preferences.widget.fullscreen=>@update:widgetFullscreen
 */
const listen = computed(() => {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(preferences)) {
    if (typeof value === 'object') {
      for (const subKey of Object.keys(value)) {
        result[`update:${key}${capitalizeFirstLetter(subKey)}`] = (
          val: any,
        ) => {
          updatePreferences({ [key]: { [subKey]: val } });
          if (key === 'app' && subKey === 'locale') {
            loadLocaleMessages(val);
          }
        };
      }
    } else {
      result[key] = value;
    }
  }
  return result;
});
</script>
<template>
  <div>
    <Drawer
      v-bind="{ ...$attrs, ...attrs }"
      v-on="listen"
      @clear-preferences-and-logout="emit('clearPreferencesAndLogout')"
    />

    <!-- 触发打开抽屉的按钮(可覆盖) -->
    <slot>
      <VbenButton
        v-if="props.showButton"
        :title="$t('preferences.title')"
        class="flex-col-center size-10 cursor-pointer rounded-l-lg rounded-r-none border-none bg-primary"
        @click="() => drawerApi.open()"
      >
        <Settings class="size-5" />
      </VbenButton>
    </slot>
  </div>
</template>
