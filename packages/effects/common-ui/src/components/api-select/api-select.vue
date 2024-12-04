<script lang="ts" setup>
import type { AnyPromiseFunction } from '@vben/types';

import { computed, ref, unref, useAttrs, type VNode, watch } from 'vue';

import { LoaderCircle } from '@vben/icons';
import { get, isEqual, isFunction } from '@vben-core/shared/utils';

import { objectOmit } from '@vueuse/core';

type OptionsItem = {
  [name: string]: any;
  disabled?: boolean;
  label?: string;
  value?: string;
};

interface Props {
  // 组件
  component: VNode;
  numberToString?: boolean;
  api?: (arg?: any) => Promise<OptionsItem[] | Record<string, any>>;
  params?: Record<string, any>;
  resultField?: string;
  labelField?: string;
  valueField?: string;
  immediate?: boolean;
  alwaysLoad?: boolean;
  beforeFetch?: AnyPromiseFunction<any, any>;
  afterFetch?: AnyPromiseFunction<any, any>;
  options?: OptionsItem[];
  // 尾部插槽
  loadingSlot?: string;
  // 可见时触发的事件名
  visibleEvent?: string;
  modelField?: string;
}

defineOptions({ name: 'ApiSelect', inheritAttrs: false });

const props = withDefaults(defineProps<Props>(), {
  labelField: 'label',
  valueField: 'value',
  resultField: '',
  visibleEvent: '',
  numberToString: false,
  params: () => ({}),
  immediate: true,
  alwaysLoad: false,
  loadingSlot: '',
  beforeFetch: undefined,
  afterFetch: undefined,
  modelField: 'modelValue',
  api: undefined,
  options: () => [],
});

const emit = defineEmits<{
  optionsChange: [OptionsItem[]];
}>();

const modelValue = defineModel({ default: '' });

const attrs = useAttrs();

const refOptions = ref<OptionsItem[]>([]);
const loading = ref(false);
// 首次是否加载过了
const isFirstLoaded = ref(false);

const getOptions = computed(() => {
  const { labelField, valueField, numberToString } = props;

  const data: OptionsItem[] = [];
  const refOptionsData = unref(refOptions);

  for (const next of refOptionsData) {
    if (next) {
      const value = get(next, valueField);
      data.push({
        ...objectOmit(next, [labelField, valueField]),
        label: get(next, labelField),
        value: numberToString ? `${value}` : value,
      });
    }
  }

  return data.length > 0 ? data : props.options;
});

const bindProps = computed(() => {
  return {
    [props.modelField]: unref(modelValue),
    [`onUpdate:${props.modelField}`]: (val: string) => {
      modelValue.value = val;
    },
    ...objectOmit(attrs, ['onUpdate:value']),
    ...(props.visibleEvent
      ? {
          [props.visibleEvent]: handleFetchForVisible,
        }
      : {}),
  };
});

async function fetchApi() {
  let { api, beforeFetch, afterFetch, params, resultField } = props;

  if (!api || !isFunction(api) || loading.value) {
    return;
  }
  refOptions.value = [];
  try {
    loading.value = true;
    if (beforeFetch && isFunction(beforeFetch)) {
      params = (await beforeFetch(params)) || params;
    }
    let res = await api(params);
    if (afterFetch && isFunction(afterFetch)) {
      res = (await afterFetch(res)) || res;
    }
    isFirstLoaded.value = true;
    if (Array.isArray(res)) {
      refOptions.value = res;
      emitChange();
      return;
    }
    if (resultField) {
      refOptions.value = get(res, resultField) || [];
    }
    emitChange();
  } catch (error) {
    console.warn(error);
    // reset status
    isFirstLoaded.value = false;
  } finally {
    loading.value = false;
  }
}

async function handleFetchForVisible(visible: boolean) {
  if (visible) {
    if (props.alwaysLoad) {
      await fetchApi();
    } else if (!props.immediate && !unref(isFirstLoaded)) {
      await fetchApi();
    }
  }
}

watch(
  () => props.params,
  (value, oldValue) => {
    if (isEqual(value, oldValue)) {
      return;
    }
    fetchApi();
  },
  { deep: true, immediate: props.immediate },
);

function emitChange() {
  emit('optionsChange', unref(getOptions));
}
</script>
<template>
  <div v-bind="{ ...$attrs }">
    <component
      :is="component"
      v-bind="bindProps"
      :options="getOptions"
      :placeholder="$attrs.placeholder"
    >
      <template v-for="item in Object.keys($slots)" #[item]="data">
        <slot :name="item" v-bind="data || {}"></slot>
      </template>
      <template v-if="loadingSlot && loading" #[loadingSlot]>
        <LoaderCircle class="animate-spin" />
      </template>
    </component>
  </div>
</template>
