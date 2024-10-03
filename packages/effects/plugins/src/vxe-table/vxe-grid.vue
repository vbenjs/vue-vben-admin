<script lang="ts" setup>
import type { VxeGridProps as GridProps, VxeGridInstance } from 'vxe-table';

import type { ExtendedVxeGridApi, VxeGridProps } from './types';

import { computed, onMounted, reactive, useSlots, useTemplateRef } from 'vue';

import { usePriorityValues } from '@vben/hooks';
import { EmptyIcon } from '@vben/icons';
import { cn, createMerge, getNestedValue, isFunction } from '@vben/utils';
import { VbenLoading, VbenPagination } from '@vben-core/shadcn-ui';

import { VxeGrid } from 'vxe-table';

import { initVxeTable } from './init';

import 'vxe-table/styles/cssvar.scss';
import 'vxe-pc-ui/styles/cssvar.scss';
import './theme.css';

interface Props extends VxeGridProps {
  api: ExtendedVxeGridApi;
}

const props = withDefaults(defineProps<Props>(), {});

initVxeTable();

const gridRef = useTemplateRef<VxeGridInstance>('gridRef');

const state = props.api?.useStore?.();

const {
  gridOptions,
  class: className,
  paginationClass,
  paginationOptions,
  gridClass,
} = usePriorityValues(props, state);

const paginationInfo = reactive({
  currentPage: 1,
  pageSize: 20,
  total: 0,
});

const slots = useSlots();
const merge = createMerge((originObj, key, updates) => {
  if (Array.isArray(originObj[key]) && Array.isArray(updates)) {
    originObj[key] = updates;
    return true;
  }
});

const options = computed(() => {
  const defaultGridOptions: GridProps = {
    border: true,
    columnConfig: {
      resizable: true,
    },
    height: 'auto',
    minHeight: 180,
    round: true,
    size: 'small',
  };

  const slotActions = slots.actions?.();
  const slotTools = slots.tools?.();

  const forceUseToolbarConfigOptions =
    slotActions || slotTools
      ? {
          toolbarConfig: {
            slots: {
              ...(slotActions ? { buttons: 'actions' } : {}),
              ...(slotTools ? { tools: 'tools' } : {}),
            },
          },
        }
      : {};

  const mergedOptions: GridProps = merge(
    {},
    forceUseToolbarConfigOptions,
    gridOptions.value,
    defaultGridOptions,
  );

  return mergedOptions;
});

const delegatedSlots = computed(() => {
  const resultSlots: string[] = [];

  for (const key of Object.keys(slots)) {
    if (!['empty', 'loading', 'pager'].includes(key)) {
      resultSlots.push(key);
    }
  }
  return resultSlots;
});

function extendProxyOptions(options: GridProps) {
  const configQuery = options?.proxyConfig?.ajax?.query;

  if (
    !options ||
    !options.proxyConfig ||
    !options.proxyConfig.ajax ||
    !configQuery ||
    !isFunction(configQuery)
  ) {
    return options;
  }

  const responseTotal = options.proxyConfig.response?.total ?? 'page.total';
  // const responseResult = options.proxyConfig.response?.result ?? 'result';

  const wrapperQuery = async (params: any, ...args: any[]) => {
    const data = await configQuery(
      {
        ...params,
        page: paginationInfo,
      },
      ...args,
    );
    const total = getNestedValue(data, responseTotal as string);
    paginationInfo.total = total;
    return data;
  };
  props.api.setState({
    gridOptions: {
      proxyConfig: {
        ajax: {
          query: wrapperQuery,
        },
      },
    },
  });
}

function handlePageChange(currentPage: number, pageSize: number) {
  paginationInfo.currentPage = currentPage;
  paginationInfo.pageSize = pageSize;
  gridRef.value?.commitProxy('query', { page: paginationInfo });
}

onMounted(() => {
  props.api?.mount?.(gridRef.value);

  extendProxyOptions(options.value);
});
</script>

<template>
  <div :class="cn('bg-card h-full rounded-sm', className)">
    <VxeGrid
      ref="gridRef"
      :class="
        cn(
          'p-2',
          {
            'pt-0': $slots.actions || $slots.tools,
          },
          gridClass,
        )
      "
      v-bind="options"
    >
      <template
        v-for="slotName in delegatedSlots"
        :key="slotName"
        #[slotName]="slotProps"
      >
        <slot :name="slotName" v-bind="slotProps"></slot>
      </template>
      <template #loading>
        <slot name="loading">
          <VbenLoading :spinning="true" />
        </slot>
      </template>
      <template #empty>
        <slot name="empty">
          <EmptyIcon class="mx-auto" />
          <div class="mt-2">暂无数据</div>
        </slot>
      </template>
      <template #pager>
        <slot name="pager">
          <VbenPagination
            :class="cn('mt-1', paginationClass)"
            v-bind="paginationOptions"
            v-model:current-page="paginationInfo.currentPage"
            v-model:item-per-page="paginationInfo.pageSize"
            :total="paginationInfo.total"
            @page-change="handlePageChange"
          />
        </slot>
      </template>
    </VxeGrid>
  </div>
</template>
