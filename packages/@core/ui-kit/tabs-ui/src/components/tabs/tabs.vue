<script lang="ts" setup>
import type { TabConfig, TabsProps } from '../../types';

import { computed, watch } from 'vue';

import { MdiPin, X } from '@vben-core/icons';
import { VbenContextMenu, VbenIcon, VbenScrollbar } from '@vben-core/shadcn-ui';
import { TabDefinition } from '@vben-core/typings';

interface Props extends TabsProps {}

defineOptions({
  name: 'VbenTabs',
  // eslint-disable-next-line perfectionist/sort-objects
  inheritAttrs: false,
});
const props = withDefaults(defineProps<Props>(), {
  contentClass: 'vben-tabs-content',
  contextMenus: () => [],
  tabs: () => [],
});

const emit = defineEmits<{ close: [string]; unpin: [TabDefinition] }>();
const active = defineModel<string>('active');

const typeWithClass = computed(() => {
  const typeClasses: Record<string, { content: string }> = {
    brisk: {
      content: `h-full  after:content-['']  after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1.5px] after:bg-primary after:scale-x-0 after:transition-[transform] after:ease-out after:duration-300 hover:after:scale-x-100 after:origin-left [&.is-active]:after:scale-x-100 border-l border-border`,
    },
    card: {
      content:
        'h-[calc(100%-6px)] rounded-md ml-2 border border-border  transition-all',
    },
    plain: {
      content: 'h-full border-l border-border',
    },
  };

  return typeClasses[props.styleType || 'plain'];
});

const tabsView = computed((): TabConfig[] => {
  return props.tabs.map((tab) => {
    return {
      ...tab,
      affixTab: !!tab.meta?.affixTab,
      closable: Reflect.has(tab.meta, 'tabClosable')
        ? !!tab.meta.tabClosable
        : true,
      icon: tab.meta.icon as string,
      key: tab.fullPath || tab.path,
      title: (tab.meta?.newTabTitle || tab.meta?.title || tab.name) as string,
    };
  });
});

watch(active, () => {
  scrollIntoView();
});

function scrollIntoView() {
  setTimeout(() => {
    const element = document.querySelector(`.tabs-chrome__item.is-active`);

    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
}
</script>

<template>
  <div class="h-full flex-1 overflow-hidden">
    <VbenScrollbar
      class="tabs-scrollbar h-full"
      horizontal
      scroll-bar-class="z-10"
    >
      <div
        :class="contentClass"
        class="relative !flex h-full w-max items-center"
      >
        <TransitionGroup name="slide-left">
          <div
            v-for="(tab, i) in tabsView"
            :key="tab.key"
            :class="[
              {
                'is-active dark:bg-accent bg-primary/15': tab.key === active,
                dragable: !tab.affixTab,
              },
              typeWithClass.content,
            ]"
            :data-index="i"
            class="tabs-chrome__item [&:not(.is-active)]:hover:bg-accent group relative flex cursor-pointer select-none transition-all duration-300"
            @click="active = tab.key"
          >
            <VbenContextMenu
              :handler-data="tab"
              :menus="contextMenus"
              :modal="false"
              item-class="pr-6"
            >
              <div class="relative flex size-full items-center">
                <!-- extra -->
                <div
                  class="absolute right-1.5 top-1/2 z-[3] translate-y-[-50%] overflow-hidden"
                >
                  <!-- <div
                  class="absolute right-1.5 top-1/2 z-[3] translate-y-[-50%] overflow-hidden opacity-0 transition-opacity group-hover:opacity-100 group-[.is-active]:opacity-100"
                > -->
                  <!-- close-icon -->
                  <X
                    v-show="
                      !tab.affixTab && tabsView.length > 1 && tab.closable
                    "
                    class="hover:bg-accent stroke-accent-foreground/80 hover:stroke-accent-foreground dark:group-[.is-active]:text-accent-foreground group-[.is-active]:text-primary size-3 cursor-pointer rounded-full transition-all"
                    @click.stop="() => emit('close', tab.key)"
                  />
                  <MdiPin
                    v-show="tab.affixTab && tabsView.length > 1 && tab.closable"
                    class="hover:bg-accent hover:stroke-accent-foreground group-[.is-active]:text-primary dark:group-[.is-active]:text-accent-foreground mt-[2px] size-3.5 cursor-pointer rounded-full transition-all"
                    @click.stop="() => emit('unpin', tab)"
                  />
                </div>

                <!-- tab-item-main -->
                <div
                  class="text-accent-foreground group-[.is-active]:text-primary dark:group-[.is-active]:text-accent-foreground mx-3 mr-4 flex h-full items-center overflow-hidden rounded-tl-[5px] rounded-tr-[5px] pr-3 transition-all duration-300"
                >
                  <!-- <div
                  class="mx-3 ml-3 mr-2 flex h-full items-center overflow-hidden rounded-tl-[5px] rounded-tr-[5px] transition-all duration-300 group-hover:mr-2 group-hover:pr-4 group-[.is-active]:pr-4"
                > -->
                  <VbenIcon
                    v-if="showIcon"
                    :icon="tab.icon"
                    class="mr-2 flex size-4 items-center overflow-hidden"
                    fallback
                  />

                  <span
                    class="flex-1 overflow-hidden whitespace-nowrap text-sm"
                  >
                    {{ tab.title }}
                  </span>
                </div>
              </div>
            </VbenContextMenu>
          </div>
        </TransitionGroup>
      </div>
    </VbenScrollbar>
  </div>
</template>

<style scoped>
.tabs-scrollbar {
  mask-image: linear-gradient(
    90deg,
    #000 0%,
    #000 calc(100% - 16px),
    transparent
  );
}
</style>
