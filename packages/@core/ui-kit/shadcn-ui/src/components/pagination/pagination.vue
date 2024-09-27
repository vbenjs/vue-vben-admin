<script setup lang="ts">
import { computed } from 'vue';

import { cn } from '@vben-core/shared/utils';

import { Button } from '../ui/button';
import {
  Pagination,
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev,
} from '../ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { type PaginationProps, SIZE_CLASS_MAP } from './pagination';

interface Props extends PaginationProps {}

const {
  disabled = false,
  pageSizeOptions = [10, 20, 30, 50, 100, 200],
  showEdges = true,
  showRowsPerPage = true,
  showTotalText = true,
  siblingCount = 1,
  size = 'default',
  total = 500,
} = defineProps<Props>();

const currentPage = defineModel<number>('currentPage', { default: 1 });
const itemPerPage = defineModel<number>('itemPerPage', { default: 20 });

const itemSize = computed(() => {
  return SIZE_CLASS_MAP[size];
});

const options = computed(() => {
  return pageSizeOptions.map((item) => ({
    label: `${item} 条/页`,
    value: `${item}`,
  }));
});

function handleUpdateModelValue(value: string) {
  itemPerPage.value = Number(value);
}
</script>

<template>
  <Pagination
    v-model:page="currentPage"
    :disabled="disabled"
    :items-per-page="itemPerPage"
    :show-edges="showEdges"
    :sibling-count="siblingCount"
    :total="total"
  >
    <PaginationList
      v-slot="{ items }"
      class="flex w-full items-center justify-end gap-1"
    >
      <span v-if="showTotalText" class="mr-2">共 {{ total }} 条</span>

      <Select
        v-if="showRowsPerPage"
        :model-value="`${itemPerPage}`"
        @update:model-value="handleUpdateModelValue"
      >
        <SelectTrigger class="w-30 mr-auto h-8">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <template v-for="item in options" :key="item.value">
            <SelectItem :value="item.value"> {{ item.label }} </SelectItem>
          </template>
        </SelectContent>
      </Select>

      <PaginationFirst :class="cn('size-8', itemSize)" />
      <PaginationPrev :class="cn('size-8', itemSize)" />
      <template v-for="(item, index) in items">
        <PaginationListItem
          v-if="item.type === 'page'"
          :key="index"
          :value="item.value"
          as-child
        >
          <Button
            :class="cn('size-8 p-0 shadow-none', itemSize)"
            :variant="item.value === currentPage ? 'default' : 'outline'"
          >
            {{ item.value }}
          </Button>
        </PaginationListItem>
        <PaginationEllipsis v-else :key="item.type" :index="index" />
      </template>

      <PaginationNext :class="cn('size-8', itemSize)" />
      <PaginationLast :class="cn('size-8', itemSize)" />
    </PaginationList>
  </Pagination>
</template>
