<script lang="ts" setup>
import { computed, useSlots } from 'vue';

import { useRefresh } from '@vben/hooks';
import { RotateCw } from '@vben/icons';
import { preferences, usePreferences } from '@vben/preferences';
import { useAccessStore } from '@vben/stores';

import { VbenFullScreen, VbenIconButton } from '@vben-core/shadcn-ui';

import {
  GlobalSearch,
  LanguageToggle,
  PreferencesButton,
  ThemeToggle,
  TimezoneButton,
} from '../../widgets';

interface Props {
  /**
   * Logo 主题
   */
  theme?: string;
}

defineOptions({
  name: 'LayoutHeader',
});

withDefaults(defineProps<Props>(), {
  theme: 'light',
});

const emit = defineEmits<{ clearPreferencesAndLogout: [] }>();

const REFERENCE_VALUE = 100;

const accessStore = useAccessStore();
const { globalSearchShortcutKey, preferencesButtonPosition } = usePreferences();
const slots = useSlots();
const { refresh } = useRefresh();

/**
 * 插槽列表类型
 */
type SlotItem = { index: number; name: string };

const rightSlots = computed(() => {
  const list: Array<SlotItem> = [];
  // 全局搜索
  if (preferences.widget.globalSearch) {
    list.push({
      index: REFERENCE_VALUE,
      name: 'global-search',
    });
  }
  // 偏好设置快捷功能
  if (preferencesButtonPosition.value.header) {
    list.push({
      index: REFERENCE_VALUE + 10,
      name: 'preferences',
    });
    // 将偏好设置中的子功能分组到同一个按钮位置控制逻辑下
    if (preferences.widget.themeToggle) {
      list.push({
        index: REFERENCE_VALUE + 20,
        name: 'theme-toggle',
      });
    }
    if (preferences.widget.languageToggle) {
      list.push({
        index: REFERENCE_VALUE + 30,
        name: 'language-toggle',
      });
    }
    if (preferences.widget.timezone) {
      list.push({
        index: REFERENCE_VALUE + 40,
        name: 'timezone',
      });
    }
  }
  // 全屏
  if (preferences.widget.fullscreen) {
    list.push({
      index: REFERENCE_VALUE + 50,
      name: 'fullscreen',
    });
  }
  // 消息通知
  if (preferences.widget.notification) {
    list.push({
      index: REFERENCE_VALUE + 60,
      name: 'notification',
    });
  }

  Object.keys(slots).forEach((key) => {
    // 适配插槽名称，例如第一个插槽名：header-right-1
    if (key.startsWith('header-right')) {
      // 取第三个占位的数字，若是第三个占位不是数字，则自动分配排序索引
      const slotIndex = Number(key.split('-')[2]);
      const index = Number.isNaN(slotIndex) ? nextIndex(list) : slotIndex;
      list.push({ index, name: key });
    }
  });
  // 最后追加用户下拉框，若是索引值超过1000时则固定在1000（适配用户按钮不在最后的场景）
  const userDropdownIndex = Math.min(1000, nextIndex(list));
  list.push({ index: userDropdownIndex, name: 'user-dropdown' });
  // 按照索引排序，保证插槽顺序
  return list.toSorted((a, b) => a.index - b.index);
});

const leftSlots = computed(() => {
  const list: Array<SlotItem> = [];
  // 刷新
  if (preferences.widget.refresh) {
    list.push({
      index: 0,
      name: 'refresh',
    });
  }

  Object.keys(slots).forEach((key) => {
    // 适配插槽名称，例如第一个插槽名：header-left-1
    if (key.startsWith('header-left')) {
      // 取第三个占位的数字，若是第三个占位不是数字，则自动分配排序索引
      const slotIndex = Number(key.split('-')[2]);
      const index = Number.isNaN(slotIndex) ? nextIndex(list) : slotIndex;
      list.push({ index, name: key });
    }
  });
  // 按照索引排序，保证插槽顺序
  return list.toSorted((a, b) => a.index - b.index);
});

/**
 * 获取列表下一个索引值(用于排序)
 * @param list 列表
 */
function nextIndex(list: Array<SlotItem>) {
  const index =
    list.length > 0 ? Math.max(...list.map((item) => item.index)) : 0;
  return index + 1;
}

function clearPreferencesAndLogout() {
  emit('clearPreferencesAndLogout');
}
</script>

<template>
  <template
    v-for="slot in leftSlots.filter((item) => item.index < REFERENCE_VALUE)"
    :key="slot.name"
  >
    <slot :name="slot.name">
      <template v-if="slot.name === 'refresh'">
        <VbenIconButton class="my-0 mr-1 rounded-md" @click="refresh">
          <RotateCw class="size-4" />
        </VbenIconButton>
      </template>
    </slot>
  </template>
  <div class="flex-center hidden lg:block">
    <slot name="breadcrumb"></slot>
  </div>
  <template
    v-for="slot in leftSlots.filter((item) => item.index > REFERENCE_VALUE)"
    :key="slot.name"
  >
    <slot :name="slot.name"></slot>
  </template>
  <div
    :class="`menu-align-${preferences.header.menuAlign}`"
    class="flex h-full min-w-0 flex-1 items-center"
  >
    <slot name="menu"></slot>
  </div>
  <div class="flex h-full min-w-0 shrink-0 items-center">
    <template v-for="slot in rightSlots" :key="slot.name">
      <slot :name="slot.name">
        <template v-if="slot.name === 'global-search'">
          <GlobalSearch
            :enable-shortcut-key="globalSearchShortcutKey"
            :menus="accessStore.accessMenus"
            class="mr-1 sm:mr-4"
          />
        </template>

        <template v-else-if="slot.name === 'preferences'">
          <PreferencesButton
            class="mr-1"
            @clear-preferences-and-logout="clearPreferencesAndLogout"
          />
        </template>
        <template v-else-if="slot.name === 'theme-toggle'">
          <ThemeToggle class="mt-0.5 mr-1" />
        </template>
        <template v-else-if="slot.name === 'language-toggle'">
          <LanguageToggle class="mr-1" />
        </template>
        <template v-else-if="slot.name === 'fullscreen'">
          <VbenFullScreen class="mr-1" />
        </template>
        <template v-else-if="slot.name === 'timezone'">
          <TimezoneButton class="mt-0.5 mr-1" />
        </template>
      </slot>
    </template>
  </div>
</template>
<style lang="scss" scoped>
.menu-align-start {
  --menu-align: start;
}

.menu-align-center {
  --menu-align: center;
}

.menu-align-end {
  --menu-align: end;
}
</style>
