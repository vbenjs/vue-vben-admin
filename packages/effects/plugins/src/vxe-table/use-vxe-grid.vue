<script lang="ts" setup>
import type { VbenFormProps } from '@vben-core/form-ui';
import type {
  VxeGridInstance,
  VxeGridProps as VxeTableGridProps,
} from 'vxe-table';

import type { ExtendedVxeGridApi, VxeGridProps } from './types';

import { computed, onMounted, toRaw, useSlots, useTemplateRef } from 'vue';

import { usePriorityValues } from '@vben/hooks';
import { EmptyIcon } from '@vben/icons';
import { $t } from '@vben/locales';
import {
  cn,
  getNestedValue,
  isFunction,
  mergeWithArrayOverride,
} from '@vben/utils';
import { VbenLoading, VbenPagination } from '@vben-core/shadcn-ui';

import { VxeGrid, VxeUI } from 'vxe-table';

import { useTableForm } from './init';

import 'vxe-table/styles/cssvar.scss';
import 'vxe-pc-ui/styles/cssvar.scss';
import './theme.css';

interface Props extends VxeGridProps {
  api: ExtendedVxeGridApi;
}

const props = withDefaults(defineProps<Props>(), {});

const gridRef = useTemplateRef<VxeGridInstance>('gridRef');

const state = props.api?.useStore?.();

const {
  gridOptions,
  class: className,
  paginationClass,
  paginationOptions,
  gridClass,
  paginationInfo,
  gridEvents,
  formOptions,
} = usePriorityValues(props, state);

const slots = useSlots();

const [Form, formApi] = useTableForm({});

const showToolbar = computed(() => {
  return !!slots['toolbar-actions']?.() || !!slots['toolbar-tools']?.();
});

const options = computed(() => {
  const slotActions = slots['toolbar-actions']?.();
  const slotTools = slots['toolbar-tools']?.();

  const forceUseToolbarConfigOptions = showToolbar.value
    ? {
        toolbarConfig: {
          slots: {
            ...(slotActions ? { buttons: 'toolbar-actions' } : {}),
            ...(slotTools ? { tools: 'toolbar-tools' } : {}),
          },
        },
      }
    : {};

  // const globalConfig = VxeUI.getConfig();

  const mergedOptions: VxeTableGridProps = mergeWithArrayOverride(
    {},
    forceUseToolbarConfigOptions,
    toRaw(gridOptions.value),
    // globalConfig.grid,
  );

  if (mergedOptions.proxyConfig) {
    const { ajax } = mergedOptions.proxyConfig;
    mergedOptions.proxyConfig.enabled = !!ajax;
  }

  if (!showToolbar.value && mergedOptions.toolbarConfig) {
    mergedOptions.toolbarConfig.enabled = false;
  }
  return mergedOptions;
});

const events = computed(() => {
  return {
    ...gridEvents.value,
  };
});

const vbenFormOptions = computed(() => {
  const defaultFormProps: VbenFormProps = {
    handleSubmit: async () => {
      props.api.reload(1);
    },
    handleReset: async () => {
      formApi.resetForm();
      props.api.reload(1);
    },
    collapseTriggerResize: true,
    // 所有表单项共用，可单独在表单内覆盖
    commonConfig: {
      // 所有表单项
      componentProps: {
        class: 'w-full',
      },
    },
    showCollapseButton: true,
    submitButtonOptions: {
      text: $t('common.query'),
    },
    // 大屏一行显示3个，中屏一行显示2个，小屏一行显示1个
    wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  };
  return {
    ...mergeWithArrayOverride({}, formOptions.value, defaultFormProps),
  };
});

const delegatedSlots = computed(() => {
  const resultSlots: string[] = [];

  for (const key of Object.keys(slots)) {
    if (!['empty', 'form', 'loading', 'pager'].includes(key)) {
      resultSlots.push(key);
    }
  }
  return resultSlots;
});

const delegatedFormSlots = computed(() => {
  const resultSlots: string[] = [];

  for (const key of Object.keys(slots)) {
    if (key.startsWith('form-')) {
      resultSlots.push(key);
    }
  }
  return resultSlots;
});

function extendProxyOptions(options: VxeTableGridProps) {
  const configQuery = options?.proxyConfig?.ajax?.query;

  const config = VxeUI.getConfig();
  const mergeOptions = mergeWithArrayOverride(options, config.grid);
  props.api.setState({
    gridOptions: {
      ...mergeOptions,
      pagerConfig: undefined,
    },
  });

  if (
    !options ||
    !options.proxyConfig ||
    !options.proxyConfig.ajax ||
    !configQuery ||
    !isFunction(configQuery)
  ) {
    return options;
  }

  const responseTotal =
    mergeOptions.proxyConfig?.response?.total ?? 'page.total';
  // const responseResult = mergeOptions.proxyConfig.response?.result ?? 'result';

  const wrapperQuery = async (params: any, ...args: any[]) => {
    const formValues = await formApi.getValues();
    const data = await configQuery(
      {
        ...params,
        form: formValues,
        page: props.api.getPaginationInfo(),
      },
      ...args,
    );
    const total = getNestedValue(data, responseTotal as string);
    // paginationInfo.total = total;
    props.api.setPaginationInfo({ total });
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

function handlePageChange(currentPage: number, pageSize?: number) {
  // paginationInfo.currentPage = currentPage;
  // paginationInfo.pageSize = pageSize;
  props.api.setPaginationInfo({ pageSize, currentPage });
  gridRef.value?.commitProxy('query', { page: props.api.getPaginationInfo() });
}

function handleCurrentPageChange(page: number) {
  props.api.setPaginationInfo({ currentPage: page });
}

function handlePerPageChange(pageSize: number) {
  props.api.setPaginationInfo({ pageSize });
}

onMounted(() => {
  props.api?.mount?.(gridRef.value);
  extendProxyOptions(options.value);
});
</script>

<template>
  <div :class="cn('bg-card h-full rounded-md', className)">
    <VxeGrid
      ref="gridRef"
      :class="
        cn(
          'p-2',
          {
            'pt-0': showToolbar && !formOptions,
          },
          gridClass,
        )
      "
      v-bind="options"
      v-on="events"
    >
      <template
        v-for="slotName in delegatedSlots"
        :key="slotName"
        #[slotName]="slotProps"
      >
        <slot :name="slotName" v-bind="slotProps"></slot>
      </template>
      <template #form>
        <div v-if="formOptions" class="relative rounded py-3 pb-6">
          <slot name="form">
            <Form v-bind="vbenFormOptions">
              <template
                v-for="slotName in delegatedFormSlots"
                :key="slotName"
                #[slotName]="slotProps"
              >
                <slot :name="slotName" v-bind="slotProps"></slot>
              </template>
            </Form>
          </slot>
          <div
            class="bg-background-deep z-100 absolute -left-2 bottom-2 h-4 w-[calc(100%+1rem)] overflow-hidden"
          ></div>
        </div>
      </template>
      <template #loading>
        <slot name="loading">
          <VbenLoading :spinning="true" />
        </slot>
      </template>
      <template #empty>
        <slot name="empty">
          <EmptyIcon class="mx-auto" />
          <div class="mt-2">{{ $t('common.noData') }}</div>
        </slot>
      </template>
      <template v-if="options.pagerConfig" #pager>
        <slot name="pager">
          <VbenPagination
            :class="cn('mt-1', paginationClass)"
            v-bind="paginationOptions"
            :current-page="paginationInfo?.currentPage"
            :item-per-page="paginationInfo?.pageSize"
            :total="paginationInfo?.total"
            @page-change="handlePageChange"
            @update:current-page="handleCurrentPageChange"
            @update:item-per-page="handlePerPageChange"
          />
        </slot>
      </template>
    </VxeGrid>
  </div>
</template>
