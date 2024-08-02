<script setup lang="ts">
import type { MenuRecordRaw } from '@vben/types';

import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue';

import {
  ArrowDown,
  ArrowUp,
  CornerDownLeft,
  MdiKeyboardEsc,
  Search,
} from '@vben/icons';
import { $t } from '@vben/locales';
import { isWindowsOs } from '@vben/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@vben-core/shadcn-ui';

import { useMagicKeys, useToggle, whenever } from '@vueuse/core';

import SearchPanel from './search-panel.vue';

defineOptions({
  name: 'GlobalSearch',
});

const props = withDefaults(
  defineProps<{ enableShortcutKey?: boolean; menus: MenuRecordRaw[] }>(),
  {
    enableShortcutKey: true,
    menus: () => [],
  },
);

const [open, toggleOpen] = useToggle();
const keyword = ref('');
const searchInputRef = ref<HTMLInputElement>();

function handleClose() {
  open.value = false;
  keyword.value = '';
}

const keys = useMagicKeys();
const cmd = isWindowsOs() ? keys['ctrl+k'] : keys['cmd+k'];
whenever(cmd, () => {
  if (props.enableShortcutKey) {
    open.value = true;
  }
});

whenever(open, () => {
  nextTick(() => {
    searchInputRef.value?.focus();
  });
});

const preventDefaultBrowserSearchHotKey = (event: KeyboardEvent) => {
  if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
    event.preventDefault();
  }
};

const toggleKeydownListener = () => {
  if (props.enableShortcutKey) {
    window.addEventListener('keydown', preventDefaultBrowserSearchHotKey);
  } else {
    window.removeEventListener('keydown', preventDefaultBrowserSearchHotKey);
  }
};

watch(() => props.enableShortcutKey, toggleKeydownListener);

onMounted(() => {
  toggleKeydownListener();

  onUnmounted(() => {
    window.removeEventListener('keydown', preventDefaultBrowserSearchHotKey);
  });
});
</script>

<template>
  <div>
    <Dialog :open="open">
      <DialogTrigger as-child>
        <div
          class="md:bg-accent group flex h-8 cursor-pointer items-center gap-3 rounded-2xl border-none bg-none px-2 py-0.5 outline-none"
          @click="toggleOpen()"
        >
          <Search
            class="text-muted-foreground group-hover:text-foreground size-3 group-hover:opacity-100"
          />
          <span
            class="text-muted-foreground group-hover:text-foreground hidden text-xs duration-300 md:block"
          >
            {{ $t('widgets.search.title') }}
          </span>
          <span
            v-if="enableShortcutKey"
            class="bg-background border-foreground/60 text-muted-foreground group-hover:text-foreground relative hidden rounded-sm rounded-r-xl px-1.5 py-1 text-xs leading-none group-hover:opacity-100 md:block"
          >
            {{ isWindowsOs() ? 'Ctrl' : '⌘' }}
            <kbd>K</kbd>
          </span>
          <span v-else></span>
        </div>
      </DialogTrigger>
      <DialogContent
        class="top-0 h-full w-full -translate-y-0 border-none p-0 shadow-xl sm:top-[10%] sm:h-[unset] sm:w-[600px] sm:rounded-2xl"
        @close="handleClose"
      >
        <DialogHeader>
          <DialogTitle
            class="border-border flex h-12 items-center gap-3 border-b px-5 font-normal"
          >
            <Search class="text-muted-foreground size-4" />
            <input
              ref="searchInputRef"
              v-model="keyword"
              :placeholder="$t('widgets.search.searchNavigate')"
              class="ring-none placeholder:text-muted-foreground w-[80%] rounded-md border border-none bg-transparent p-2 pl-0 text-sm outline-none ring-0 ring-offset-transparent focus-visible:ring-transparent"
            />
          </DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <SearchPanel :keyword="keyword" :menus="menus" @close="handleClose" />
        <DialogFooter
          class="text-muted-foreground border-border hidden flex-row rounded-b-2xl border-t px-4 py-2 text-xs sm:flex sm:justify-start sm:gap-x-4"
        >
          <div class="flex items-center">
            <CornerDownLeft class="mr-1 size-3" />
            {{ $t('widgets.search.select') }}
          </div>
          <div class="flex items-center">
            <ArrowUp class="mr-2 size-3" />
            <ArrowDown class="mr-2 size-3" />
            {{ $t('widgets.search.navigate') }}
          </div>
          <div class="flex items-center">
            <MdiKeyboardEsc class="mr-1 size-3" />
            {{ $t('widgets.search.close') }}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
