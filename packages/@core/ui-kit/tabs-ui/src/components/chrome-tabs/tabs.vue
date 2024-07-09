<script setup lang="ts">
import type { TabItem } from '@vben-core/typings';

import type { TabsProps } from '../../types';

import { computed, nextTick, onMounted, ref, watch } from 'vue';

import { useNamespace } from '@vben-core/toolkit';

import Tab from './tab.vue';

interface Props extends TabsProps {}

defineOptions({
  name: 'ChromeTabs',
});

const props = withDefaults(defineProps<Props>(), {
  maxWidth: 150,
  menus: () => [],
  minWidth: 40,
  tabs: () => [],
});

const emit = defineEmits<{ close: [string]; unpinTab: [TabItem] }>();

const gap = 7;

const active = defineModel<string>('active');
const { b, e, is } = useNamespace('chrome-tabs');

const contentRef = ref();
const tabWidth = ref<number>(0);

const layout = () => {
  const { maxWidth, minWidth, tabs } = props;
  if (!contentRef.value) {
    return Math.max(maxWidth, minWidth);
  }
  const contentWidth = contentRef.value.clientWidth - gap * 3;
  let width = contentWidth / tabs.length;
  width += gap * 2;
  if (width > maxWidth) {
    width = maxWidth;
  }
  if (width < minWidth) {
    width = minWidth;
  }
  tabWidth.value = width;
};

const tabsView = computed(() => {
  return props.tabs.map((tab) => {
    return {
      ...tab,
      affixTab: !!tab.meta?.affixTab,
      icon: tab.meta.icon as string,
      key: tab.fullPath || tab.path,
      title: (tab.meta?.title || tab.name) as string,
    };
  });
});

watch(
  () => props.tabs,
  () => {
    nextTick(() => {
      layout();
    });
  },
);

onMounted(() => {
  layout();
});

function handleClose(key: string) {
  emit('close', key);
}
function handleUnpinTab(tab: TabItem) {
  emit('unpinTab', tab);
}
</script>

<template>
  <div :class="b()" class="relative size-full pt-1">
    <div ref="contentRef" class="relative h-8 overflow-hidden">
      <TransitionGroup name="slide-down">
        <Tab
          v-for="(tab, i) in tabsView"
          :key="tab.key"
          :affix-tab="tab.affixTab"
          :class="[e('tab'), is('active', tab.key === active)]"
          :icon="tab.icon"
          :menus="menus"
          :only-one="tabsView.length <= 1"
          :show-icon="showIcon"
          :style="{
            width: `${tabWidth}px`,
            left: `${(tabWidth - gap * 2) * i}px`,
          }"
          :tab="tab"
          :title="tab.title"
          @click="active = tab.key"
          @close="() => handleClose(tab.key)"
          @unpin-tab="() => handleUnpinTab(tab)"
        />
      </TransitionGroup>
    </div>
  </div>
</template>
<style lang="scss">
@import './chrome-tabs.scss';
</style>
