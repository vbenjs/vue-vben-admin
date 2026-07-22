<script setup lang="ts">
import type { SelectOption } from '@vben/types';

import { computed, nextTick, onMounted, ref } from 'vue';

import { GripVertical } from '@vben/icons';
import { $t } from '@vben/locales';

import Sortable from 'sortablejs';

interface Item {
  key: string;
  label: string;
  position: 'auto' | 'fixed' | 'header' | 'none' | 'user-dropdown';
  /** 每项可选的 position 选项；不传则用 props.positionItems */
  positionItems?: SelectOption[];
}

const props = defineProps<{
  items: Item[];
  positionItems: SelectOption[];
}>();

const emit = defineEmits<{
  updateOrder: [keys: string[]];
  updatePosition: [
    key: string,
    position: 'auto' | 'fixed' | 'header' | 'none' | 'user-dropdown',
  ];
}>();

const listRef = ref<HTMLElement>();
let sortableInstance: null | Sortable = null;

// 划分规则：
// - hidden：position === 'none'（不显示）
// - sortable：其它（含 auto/fixed，偏好按钮的智能模式视觉归入顶栏组参与排序，
//   避免 preferences 从 widget.order 丢失）
const sortableList = computed(() =>
  props.items.filter((item) => item.position !== 'none'),
);

const hiddenList = computed(() =>
  props.items.filter((item) => item.position === 'none'),
);
function initSortable() {
  if (!listRef.value) return;
  sortableInstance?.destroy();
  sortableInstance = Sortable.create(listRef.value, {
    animation: 200,
    handle: '.drag-handle',
    onEnd() {
      // Sortable 已经改了 DOM，但 sortableList computed 还是旧顺序。
      // 直接从 DOM 读 children 的 data-key 拿新顺序，再追加 hidden 部分。
      const newOrder = [...listRef.value!.children]
        .map((el) => (el as HTMLElement).dataset.key)
        .filter(Boolean) as string[];
      emit('updateOrder', [...newOrder, ...hiddenList.value.map((i) => i.key)]);
    },
  });
}

onMounted(initSortable);

function setPosition(key: string, event: Event) {
  const value = (event.target as HTMLSelectElement).value as
    | 'auto'
    | 'fixed'
    | 'header'
    | 'none'
    | 'user-dropdown';
  emit('updatePosition', key, value);
  nextTick(() => {
    emit(
      'updateOrder',
      [...sortableList.value, ...hiddenList.value].map((i) => i.key),
    );
  });
}
</script>

<template>
  <div class="space-y-1">
    <div ref="listRef" class="space-y-1">
      <div
        v-for="item in sortableList"
        :key="item.key"
        :data-key="item.key"
        class="bg-accent flex items-center gap-2 rounded-md px-2 py-1.5"
      >
        <GripVertical
          class="drag-handle size-4 shrink-0 cursor-grab text-muted-foreground active:cursor-grabbing"
        />
        <span class="min-w-0 flex-1 truncate text-sm">{{ item.label }}</span>
        <select
          :value="item.position"
          class="bg-background h-7 w-28 shrink-0 rounded border px-1 text-xs"
          @change="(e) => setPosition(item.key, e)"
        >
          <option
            v-for="opt in item.positionItems ?? positionItems"
            :key="opt.value"
            :value="opt.value"
          >
            {{ opt.label }}
          </option>
        </select>
      </div>
    </div>
    <div v-if="hiddenList.length > 0" class="pt-2">
      <div class="text-muted-foreground mb-1 text-xs font-medium">
        {{ $t('preferences.widget.hidden') }}
      </div>
      <div
        v-for="item in hiddenList"
        :key="item.key"
        class="flex items-center gap-2 rounded-md px-2 py-1"
      >
        <span
          class="text-muted-foreground min-w-0 flex-1 truncate text-sm line-through decoration-dotted"
        >
          {{ item.label }}
        </span>
        <select
          :value="item.position"
          class="bg-background h-7 w-28 shrink-0 rounded border px-1 text-xs"
          @change="(e) => setPosition(item.key, e)"
        >
          <option
            v-for="opt in item.positionItems ?? positionItems"
            :key="opt.value"
            :value="opt.value"
          >
            {{ opt.label }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>
