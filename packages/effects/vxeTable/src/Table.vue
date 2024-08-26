<script lang="ts" setup>
import type { VxeGridInstance } from 'vxe-table';

import type { VbenTableProps } from './type';

import { computed, ref, unref, useAttrs, warn, watch } from 'vue';

import { usePreferences } from '@vben-core/preferences';
import { isFunction } from '@vben-core/shared';

import { VxeUI } from 'vxe-pc-ui';
import { VxeGrid } from 'vxe-table';

import { useInterceptor } from './hooks';

interface Props {
  options?: VbenTableProps;
}
defineOptions({ name: 'VxeTable' });

const props = withDefaults(defineProps<Props>(), {
  options: undefined,
});
const emit = defineEmits(['register']);

const { isDark } = usePreferences();
watch(
  isDark,
  (dark) => {
    VxeUI.setTheme(dark ? 'dark' : 'light');
  },
  { immediate: true },
);
//

useInterceptor();
const attrs = useAttrs();
const innerProps = ref<Partial<VbenTableProps>>();

const title = computed(() => props.options?.title || '');

const xGrid = ref<VxeGridInstance>();

const reload = () => {
  const g = unref(xGrid);
  g?.commitProxy('reload');
};

const fetch = (params?: any) => {
  const g = unref(xGrid);
  g?.commitProxy('query', params);
};

const getProxyConfig = (options: VbenTableProps) => {
  const { afterFetch, api, data, proxyConfig } = options;
  if (proxyConfig || data) return;

  if (api && isFunction(api)) {
    options.proxyConfig = {
      ajax: {
        query: async ({ filters, form, page, sorts }, formValue) => {
          const { currentPage, pageSize } = page;
          let res = await api({
            ...options.params,
            ...formValue,
            page: currentPage,
            pageSize,
          });

          if (afterFetch && isFunction(afterFetch)) {
            res = afterFetch(res);
          }
          return res || [];
        },
      },
      form: true,
      props: {
        result: 'items', // 配置响应结果列表字段
        total: 'total', // 配置响应结果总页数字段
      },
    };
  }
};
const getPageConfig = (options: VbenTableProps) => {
  const { pagerConfig, pagination } = options;
  if (pagerConfig) return;

  if (pagination) {
    if (typeof pagination === 'boolean') {
      options.pagerConfig = {
        pageSize: 50,
        pageSizes: [5, 10, 15, 20, 50, 100, 200, 500, 1000],
      };
      return;
    }
    options.pagerConfig = pagination;
  }
};

const setProps = (prop: Partial<VbenTableProps>) => {
  innerProps.value = { ...unref(innerProps), ...prop };
};
const getProps = computed(() => {
  const options = innerProps.value || props.options;
  // delete options?.title;
  if (!options) {
    warn(`[VxeTable] need options`);
    return;
  }
  getProxyConfig(options);
  getPageConfig(options);
  // console.log(options);
  return {
    ...options,
    ...attrs,
  };
});
defineExpose({ fetch, Ref: xGrid, reload });
emit('register', { fetch, reload, setProps });
</script>
<template>
  <div>
    <div v-if="title" class="m-2 flex">
      <div class="ml-2 text-xl">{{ title }}</div>
    </div>
    <VxeGrid v-bind="getProps" ref="xGrid">
      <template v-for="item in Object.keys($slots)" :key="item" #[item]="data">
        <slot :name="item" v-bind="data || {}"></slot>
      </template>
    </VxeGrid>
  </div>
</template>
<style lang="scss"></style>
