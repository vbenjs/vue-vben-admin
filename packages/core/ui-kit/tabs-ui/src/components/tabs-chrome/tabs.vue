<script setup lang="ts">
import type { TabDefinition } from '@vben-core/typings';

import type { TabConfig, TabsProps } from '../../types';

import { computed, ref, watch } from 'vue';

import { MdiPin, X } from '@vben-core/icons';
import { VbenContextMenu, VbenIcon, VbenScrollbar } from '@vben-core/shadcn-ui';

interface Props extends TabsProps {}

defineOptions({
  name: 'VbenTabsChrome',
  // eslint-disable-next-line perfectionist/sort-objects
  inheritAttrs: false,
});

const props = withDefaults(defineProps<Props>(), {
  contentClass: 'vben-tabs-content',
  contextMenus: () => [],
  gap: 7,
  maxWidth: 150,
  minWidth: 80,
  tabs: () => [],
});

const emit = defineEmits<{ close: [string]; unpin: [TabDefinition] }>();
const active = defineModel<string>('active');

const contentRef = ref();
const tabRef = ref();
const tabWidth = ref<number>(props.maxWidth);

const style = computed(() => {
  const { gap } = props;
  return {
    '--gap': `${gap}px`,
  };
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
  <div :style="style" class="tabs-chrome size-full flex-1 overflow-hidden pt-1">
    <VbenScrollbar
      class="tabs-chrome__scrollbar h-full"
      horizontal
      scroll-bar-class="z-10"
    >
      <!-- footer -> 4px -->
      <div
        ref="contentRef"
        :class="contentClass"
        class="relative !flex h-full w-max"
      >
        <TransitionGroup name="slide-left">
          <div
            v-for="(tab, i) in tabsView"
            :key="tab.key"
            ref="tabRef"
            :class="[
              { 'is-active': tab.key === active, dragable: !tab.affixTab },
            ]"
            :data-active-tab="active"
            :data-index="i"
            :style="{
              width: `${tabWidth}px`,
              left: `${(tabWidth - gap * 2) * i}px`,
            }"
            class="tabs-chrome__item group absolute flex h-full select-none items-center transition-all"
            @click="active = tab.key"
          >
            <VbenContextMenu
              :handler-data="tab"
              :menus="contextMenus"
              :modal="false"
              item-class="pr-6"
            >
              <div class="size-full">
                <!-- divider -->
                <div
                  v-if="i !== 0 && tab.key !== active"
                  class="tabs-chrome__divider bg-foreground/80 absolute left-[var(--gap)] top-1/2 z-0 h-4 w-[1px] translate-y-[-50%] transition-all"
                ></div>
                <!-- background -->
                <div
                  class="tabs-chrome__background absolute z-[1] size-full px-[calc(var(--gap)-1px)] py-0 transition-opacity duration-150"
                >
                  <div
                    class="tabs-chrome__background-content group-[.is-active]:bg-primary/15 dark:group-[.is-active]:bg-accent h-full rounded-tl-[var(--gap)] rounded-tr-[var(--gap)] duration-150"
                  ></div>
                  <svg
                    class="tabs-chrome__background-before group-[.is-active]:fill-primary/15 dark:group-[.is-active]:fill-accent absolute bottom-0 left-[-1px] fill-transparent transition-all duration-150"
                    height="7"
                    width="7"
                  >
                    <path d="M 0 7 A 7 7 0 0 0 7 0 L 7 7 Z" />
                  </svg>
                  <svg
                    class="tabs-chrome__background-after group-[.is-active]:fill-primary/15 dark:group-[.is-active]:fill-accent absolute bottom-0 right-[-1px] fill-transparent transition-all duration-150"
                    height="7"
                    width="7"
                  >
                    <path d="M 0 0 A 7 7 0 0 0 7 7 L 0 7 Z" />
                  </svg>
                </div>

                <!-- extra -->
                <div
                  class="tabs-chrome__extra absolute right-[calc(var(--gap)*1.5)] top-1/2 z-[3] size-4 translate-y-[-50%]"
                >
                  <!-- close-icon -->
                  <X
                    v-show="
                      !tab.affixTab && tabsView.length > 1 && tab.closable
                    "
                    class="hover:bg-accent stroke-accent-foreground/80 hover:stroke-accent-foreground dark:group-[.is-active]:text-accent-foreground group-[.is-active]:text-primary mt-[2px] size-3 cursor-pointer rounded-full transition-all"
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
                  class="tabs-chrome__item-main group-[.is-active]:text-primary dark:group-[.is-active]:text-accent-foreground text-accent-foreground absolute left-0 right-0 z-[2] mx-[calc(var(--gap)*2)] my-0 flex h-full items-center overflow-hidden rounded-tl-[5px] rounded-tr-[5px] pr-4 duration-150 group-hover:pr-3"
                >
                  <VbenIcon
                    v-if="showIcon"
                    :icon="tab.icon"
                    class="ml-[var(--gap)] flex size-4 items-center overflow-hidden"
                    fallback
                  />

                  <span
                    class="tabs-chrome__label ml-[var(--gap)] flex-1 overflow-hidden whitespace-nowrap text-sm"
                  >
                    {{ tab.title }}
                  </span>
                </div>
              </div>
            </VbenContextMenu>
          </div>
        </TransitionGroup>
      </div>
      <!-- footer -->
      <!-- <div class="bg-background h-1"></div> -->
    </VbenScrollbar>
  </div>
</template>

<style scoped>
.tabs-chrome {
  .dragging {
    .tabs-chrome__item-main {
      @apply pr-0;
    }

    .tabs-chrome__extra {
      @apply hidden;
    }
  }

  &__item {
    &:hover:not(.is-active) {
      & + .tabs-chrome__item {
        .tabs-chrome__divider {
          @apply opacity-0;
        }
      }

      .tabs-chrome__divider {
        @apply opacity-0;
      }

      .tabs-chrome__background {
        &-content {
          @apply bg-accent mx-1 rounded-md pb-2;
        }

        &-before,
        &-after {
          @apply fill-primary/0;
        }
      }
    }

    &.is-active {
      @apply z-[2];

      & + .tabs-chrome__item {
        .tabs-chrome__divider {
          @apply opacity-0 !important;
        }
      }

      .tabs-chrome__background {
        @apply opacity-100;

        /* &-content {
          @apply bg-accent;
        }

        &-before,
        &-after {
          @apply fill-heavy;
        } */
      }
    }
  }

  &__scrollbar,
  &__label {
    mask-image: linear-gradient(
      90deg,
      #000 0%,
      #000 calc(100% - 16px),
      transparent
    );
  }
}
</style>
