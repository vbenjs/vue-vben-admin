<script setup lang="ts">
import { ref, watch, watchEffect } from 'vue';

import { usePagination } from '@vben/hooks';
import { Grip, Package2 } from '@vben/icons';
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

const currentSelect = ref('');
const currentList = ref(props.icons);
const refTrigger = ref<HTMLDivElement>();

watch(
  () => props.icons,
  (newIcons) => {
    currentList.value = newIcons;
  },
  { immediate: true },
);

const { getPaginationList, getTotal, setCurrentPage } = usePagination(
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
  setCurrentPage(page);
};

const changeOpenState = () => {
  if (refTrigger.value) {
    refTrigger.value.click();
  }
};

defineExpose({ changeOpenState });
</script>
<template>
  <VbenPopover
    :content-props="{ align: 'end', alignOffset: -11, sideOffset: 8 }"
    content-class="p-0 py-4"
  >
    <template #trigger>
      <div ref="refTrigger">
        <VbenIcon :icon="currentSelect || Grip" class="size-6" />
      </div>
    </template>

    <div v-if="getPaginationList.length > 0">
      <div class="grid max-h-[360px] w-full grid-cols-6 justify-items-center">
        <VbenIconButton
          v-for="(item, index) in getPaginationList"
          :key="index"
          :tooltip="item"
          tooltip-side="top"
          @click="handleClick(item)"
        >
          <VbenIcon :icon="item" />
        </VbenIconButton>
      </div>
      <div v-if="getTotal >= pageSize" class="flex-center pt-1">
        <Pagination
          v-slot="{ page }"
          :items-per-page="36"
          :sibling-count="1"
          :total="getTotal"
          show-edges
          @update:page="handlePageChange"
        >
          <PaginationList v-slot="{ items }" class="flex items-center gap-1">
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
                  :variant="item.value === page ? 'default' : 'outline'"
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
    </div>

    <template v-else>
      <div class="flex-col-center text-muted-foreground min-h-[150px] w-full">
        <Package2 />
        <div>{{ $t('common.noData') }}</div>
      </div>
    </template>
  </VbenPopover>
</template>
