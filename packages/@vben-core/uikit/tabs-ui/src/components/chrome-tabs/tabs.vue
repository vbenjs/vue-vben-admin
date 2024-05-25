<script setup lang="ts">
import type { TabItem } from '@vben-core/typings';

import { useNamespace } from '@vben-core/toolkit';

import { computed, nextTick, onMounted, ref, watch } from 'vue';

import Tab from './tab.vue';

import type { TabsProps } from '../../interface';

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

const emit = defineEmits<{ close: [string]; unPushPin: [TabItem] }>();

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
function handleUnPushPin(tab: TabItem) {
  emit('unPushPin', tab);
}
</script>

<template>
  <div :class="b()">
    <div ref="contentRef" :class="e('content')">
      <TransitionGroup name="slide-down">
        <Tab
          v-for="(tab, i) in tabsView"
          :key="tab.key"
          :menus="menus"
          :tab="tab"
          :icon="tab.icon"
          :title="tab.title"
          :show-icon="showIcon"
          :affix-tab="tab.affixTab"
          :only-one="tabsView.length <= 1"
          :class="[e('tab'), is('active', tab.key === active)]"
          :style="{
            width: `${tabWidth}px`,
            left: `${(tabWidth - gap * 2) * i}px`,
          }"
          @click="active = tab.key"
          @close="() => handleClose(tab.key)"
          @un-push-pin="() => handleUnPushPin(tab)"
        />
      </TransitionGroup>
    </div>
  </div>
</template>
<style lang="scss">
@import './chrome-tabs.scss';
</style>
