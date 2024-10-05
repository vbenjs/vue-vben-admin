<script lang="ts" setup>
import type { VbenFormProps } from '@vben-core/form-ui';
import type {
  VxeGridInstance,
  VxeGridProps as VxeTableGridProps,
} from 'vxe-table';

import type { ExtendedVxeGridApi, VxeGridProps } from './types';

import {
  computed,
  nextTick,
  onMounted,
  toRaw,
  useSlots,
  useTemplateRef,
} from 'vue';

import { usePriorityValues } from '@vben/hooks';
import { EmptyIcon } from '@vben/icons';
import { $t } from '@vben/locales';
import { cloneDeep, cn, mergeWithArrayOverride } from '@vben/utils';
import { VbenLoading } from '@vben-core/shadcn-ui';

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
  gridClass,
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

  const forceUseToolbarOptions = showToolbar.value
    ? {
        toolbarConfig: {
          slots: {
            ...(slotActions ? { buttons: 'toolbar-actions' } : {}),
            ...(slotTools ? { tools: 'toolbar-tools' } : {}),
          },
        },
      }
    : {};

  const mergedOptions: VxeTableGridProps = cloneDeep(
    mergeWithArrayOverride(
      {},
      forceUseToolbarOptions,
      toRaw(gridOptions.value),
    ),
  );

  if (mergedOptions.proxyConfig) {
    const { ajax } = mergedOptions.proxyConfig;
    mergedOptions.proxyConfig.enabled = !!ajax;
    // 不自动加载数据, 由组件控制
    mergedOptions.proxyConfig.autoLoad = false;
  }

  if (!showToolbar.value && mergedOptions.toolbarConfig) {
    mergedOptions.toolbarConfig.enabled = false;
  }

  if (mergedOptions.pagerConfig) {
    mergedOptions.pagerConfig = mergeWithArrayOverride(
      {},
      mergedOptions.pagerConfig,
      {
        pageSize: 20,
        background: true,
        pageSizes: [10, 20, 30, 50, 100, 200],
        className: 'mt-2 w-full',
        layouts: [
          'Total',
          'Sizes',
          'Home',
          'PrevJump',
          'PrevPage',
          'Number',
          'NextPage',
          'NextJump',
          'End',
          // 'FullJump',
        ] as any[],
        size: 'mini' as const,
      },
    );
  }
  if (mergedOptions.formConfig) {
    mergedOptions.formConfig.enabled = false;
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
      const formValues = formApi.form.values;
      props.api.reload(formValues);
    },
    handleReset: async () => {
      formApi.resetForm();
      const formValues = formApi.form.values;
      props.api.reload(formValues);
    },
    collapseTriggerResize: true,
    commonConfig: {
      componentProps: {
        class: 'w-full',
      },
    },
    showCollapseButton: true,
    submitButtonOptions: {
      text: $t('common.query'),
    },
    wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  };
  return {
    ...mergeWithArrayOverride({}, formOptions.value, defaultFormProps),
  };
});

const delegatedSlots = computed(() => {
  const resultSlots: string[] = [];

  for (const key of Object.keys(slots)) {
    if (!['empty', 'form', 'loading'].includes(key)) {
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

async function init() {
  await nextTick();
  const globalGridConfig = VxeUI?.getConfig()?.grid ?? {};
  const defaultGridOptions: VxeTableGridProps = mergeWithArrayOverride(
    {},
    toRaw(gridOptions.value),
    toRaw(globalGridConfig),
  );
  // 内部主动加载数据，防止form的默认值影响
  const autoLoad = defaultGridOptions.proxyConfig?.autoLoad;
  const enableProxyConfig = options.value.proxyConfig?.enabled;
  if (enableProxyConfig && autoLoad) {
    props.api.reload(formApi.form.values);
  }

  // form 由 vben-form代替，所以不适配formConfig，这里给出警告
  const formConfig = options.value.formConfig;
  if (formConfig) {
    console.warn(
      '[Vben Vxe Table]: The formConfig in the grid is not supported, please use the `formOptions` props',
    );
  }
}

onMounted(() => {
  props.api?.mount?.(gridRef.value);
  init();
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
    </VxeGrid>
  </div>
</template>
