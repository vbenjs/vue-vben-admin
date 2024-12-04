<script setup lang="ts">
import { computed, ref, watch, watchEffect } from 'vue';

import { usePagination } from '@vben/hooks';
import { EmptyIcon, Grip, listIcons } from '@vben/icons';
import { $t } from '@vben/locales';
import {
  Button,
  Input,
  Pagination,
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev,
  VbenIcon,
  VbenIconButton,
  VbenPopover,
} from '@vben-core/shadcn-ui';

import { refDebounced } from '@vueuse/core';

interface Props {
  pageSize?: number;
  prefix?: string;
  /**
   * 图标列表
   */
  icons?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  prefix: 'ant-design',
  pageSize: 36,
  icons: () => [],
});

const emit = defineEmits<{
  change: [string];
}>();

const modelValue = defineModel({ default: '', type: String });

const visible = ref(false);
const currentSelect = ref('');
const currentPage = ref(1);
const keyword = ref('');
const keywordDebounce = refDebounced(keyword, 300);
const currentList = computed(() => {
  try {
    if (props.prefix) {
      const icons = listIcons('', props.prefix);
      if (icons.length === 0) {
        console.warn(`No icons found for prefix: ${props.prefix}`);
      }
      return icons;
    } else {
      return props.icons;
    }
  } catch (error) {
    console.error('Failed to load icons:', error);
    return [];
  }
});

const showList = computed(() => {
  return currentList.value.filter((item) =>
    item.includes(keywordDebounce.value),
  );
});

const { paginationList, total, setCurrentPage } = usePagination(
  showList,
  props.pageSize,
);

watchEffect(() => {
  currentSelect.value = modelValue.value;
});

watch(
  () => currentSelect.value,
  (v) => {
    emit('change', v);
  },
);

const handleClick = (icon: string) => {
  currentSelect.value = icon;
  modelValue.value = icon;
  close();
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
  setCurrentPage(page);
};

function toggleOpenState() {
  visible.value = !visible.value;
}

function open() {
  visible.value = true;
}

function close() {
  visible.value = false;
}

defineExpose({ toggleOpenState, open, close });
</script>
<template>
  <VbenPopover
    v-model:open="visible"
    :content-props="{ align: 'end', alignOffset: -11, sideOffset: 8 }"
    content-class="p-0 pt-3"
  >
    <template #trigger>
      <slot :close="close" :icon="currentSelect" :open="open" name="trigger">
        <div class="flex items-center gap-2">
          <Input
            :value="currentSelect"
            class="flex-1 cursor-pointer"
            v-bind="$attrs"
            :placeholder="$t('ui.iconPicker.placeholder')"
          />
          <VbenIcon :icon="currentSelect || Grip" class="size-8" />
        </div>
      </slot>
    </template>
    <div class="mb-2 flex w-full">
      <Input
        v-model="keyword"
        :placeholder="$t('ui.iconPicker.search')"
        class="mx-2"
      />
    </div>

    <template v-if="paginationList.length > 0">
      <div class="grid max-h-[360px] w-full grid-cols-6 justify-items-center">
        <VbenIconButton
          v-for="(item, index) in paginationList"
          :key="index"
          :tooltip="item"
          tooltip-side="top"
          @click="handleClick(item)"
        >
          <VbenIcon
            :class="{
              'text-primary transition-all': currentSelect === item,
            }"
            :icon="item"
          />
        </VbenIconButton>
      </div>
      <div
        v-if="total >= pageSize"
        class="flex-center flex justify-end overflow-hidden border-t py-2 pr-3"
      >
        <Pagination
          :items-per-page="36"
          :sibling-count="1"
          :total="total"
          show-edges
          size="small"
          @update:page="handlePageChange"
        >
          <PaginationList
            v-slot="{ items }"
            class="flex w-full items-center gap-1"
          >
            <PaginationFirst class="size-5" />
            <PaginationPrev class="size-5" />
            <template v-for="(item, index) in items">
              <PaginationListItem
                v-if="item.type === 'page'"
                :key="index"
                :value="item.value"
                as-child
              >
                <Button
                  :variant="item.value === currentPage ? 'default' : 'outline'"
                  class="size-5 p-0 text-sm"
                >
                  {{ item.value }}
                </Button>
              </PaginationListItem>
              <PaginationEllipsis
                v-else
                :key="item.type"
                :index="index"
                class="size-5"
              />
            </template>
            <PaginationNext class="size-5" />
            <PaginationLast class="size-5" />
          </PaginationList>
        </Pagination>
      </div>
    </template>

    <template v-else>
      <div class="flex-col-center text-muted-foreground min-h-[150px] w-full">
        <EmptyIcon class="size-10" />
        <div class="mt-1 text-sm">{{ $t('common.noData') }}</div>
      </div>
    </template>
  </VbenPopover>
</template>
