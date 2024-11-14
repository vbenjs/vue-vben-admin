<script setup lang="ts">
import { ref, useTemplateRef, watch, watchEffect } from 'vue';

import { usePagination } from '@vben/hooks';
import { EmptyIcon, Grip } from '@vben/icons';
import {
  Button,
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

interface Props {
  value?: string;
  pageSize?: number;
  /**
   * 图标列表
   */
  icons?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  value: '',
  pageSize: 36,
  icons: () => [],
});

const emit = defineEmits<{
  change: [string];
  'update:value': [string];
}>();

const refTrigger = useTemplateRef<HTMLElement>('refTrigger');
const currentSelect = ref('');
const currentList = ref(props.icons);
const currentPage = ref(1);

watch(
  () => props.icons,
  (newIcons) => {
    currentList.value = newIcons;
  },
  { immediate: true },
);

const { paginationList, total, setCurrentPage } = usePagination(
  currentList,
  props.pageSize,
);

watchEffect(() => {
  currentSelect.value = props.value;
});

watch(
  () => currentSelect.value,
  (v) => {
    emit('update:value', v);
    emit('change', v);
  },
);

const handleClick = (icon: string) => {
  currentSelect.value = icon;
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
  setCurrentPage(page);
};

function changeOpenState() {
  refTrigger.value?.click?.();
}

defineExpose({ changeOpenState });
</script>
<template>
  <VbenPopover
    :content-props="{ align: 'end', alignOffset: -11, sideOffset: 8 }"
    content-class="p-0 pt-3"
  >
    <template #trigger>
      <div ref="refTrigger">
        <VbenIcon :icon="currentSelect || Grip" class="size-5" />
      </div>
    </template>

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
