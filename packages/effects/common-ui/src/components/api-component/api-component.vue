<script lang="ts" setup>
import type { AnyPromiseFunction } from '@vben/types';

import { type Component, computed, ref, unref, useAttrs, watch } from 'vue';

import { LoaderCircle } from '@vben/icons';
import { get, isEqual, isFunction } from '@vben-core/shared/utils';

import { objectOmit } from '@vueuse/core';

type OptionsItem = {
  [name: string]: any;
  children?: OptionsItem[];
  disabled?: boolean;
  label?: string;
  value?: string;
};

interface Props {
  /** 组件 */
  component: Component;
  /** multiple时传入的modelValue是否是数组格式的string如1,2,3 */
  arrayString?: boolean;
  /** *树平级结构配置*/
  treeParentField?: string;
  treeTransform?: boolean;
  /** 是否缓存合并每次加载的数据 */
  cacheOptions?: boolean;
  /** 远程搜索方法名 */
  remotePropName?: string;
  /** remoteMethod filter 字段名*/
  remoteFilterField?: string;
  /** remoteMethod 方法*/
  remoteMethod?: (keyword: string) => void;
  /** 是否将value从数字转为string */
  numberToString?: boolean;
  /** 获取options数据的函数 */
  api?: (arg?: any) => Promise<OptionsItem[] | Record<string, any>>;
  /** 传递给api的参数 */
  params?: Record<string, any>;
  /** 从api返回的结果中提取options数组的字段名 */
  resultField?: string;
  /** label字段名 */
  labelField?: string;
  /** children字段名，需要层级数据的组件可用 */
  childrenField?: string;
  /** value字段名 */
  valueField?: string;
  /** 组件接收options数据的属性名 */
  optionsPropName?: string;
  /** 是否立即调用api */
  immediate?: boolean;
  /** 每次`visibleEvent`事件发生时都重新请求数据 */
  alwaysLoad?: boolean;
  /** 在api请求之前的回调函数 */
  beforeFetch?: AnyPromiseFunction<any, any>;
  /** 在api请求之后的回调函数 */
  afterFetch?: AnyPromiseFunction<any, any>;
  /** 直接传入选项数据，也作为api返回空数据时的后备数据 */
  options?: OptionsItem[];
  /** 组件的插槽名称，用来显示一个"加载中"的图标 */
  loadingSlot?: string;
  /** 触发api请求的事件名 */
  visibleEvent?: string;
  /** 组件的v-model属性名，默认为modelValue。部分组件可能为value */
  modelPropName?: string;
}

defineOptions({ name: 'ApiComponent', inheritAttrs: false });

const props = withDefaults(defineProps<Props>(), {
  labelField: 'label',
  valueField: 'value',
  remoteFilterField: '',
  remoteMethod: undefined,
  childrenField: '',
  optionsPropName: 'options',
  resultField: '',
  visibleEvent: '',
  numberToString: false,
  params: () => ({}),
  immediate: true,
  alwaysLoad: false,
  loadingSlot: '',
  beforeFetch: undefined,
  afterFetch: undefined,
  modelPropName: 'modelValue',
  api: undefined,
  treeParentField: 'pid',
  treeTransform: false,
  options: () => [],
  remotePropName: 'remoteMethod',
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

const strToArray = (val: unknown): string[] | unknown => {
  if (val && typeof val === 'string') {
    return val.split(',');
  }
  return val;
};

const arrayToStr = (val: unknown): string | unknown => {
  if (Array.isArray(val)) {
    return val.join(',');
  }
  return val;
};

// 是否缓存
const cacheOptions = computed(() => {
  // return props.cacheOptions || props.remoteFilterField;
  return props.cacheOptions;
});

// 转换数据
const originOptions = computed(() => {
  return transformData(props.options);
});

// 缓存数据
const cachedOptions = ref<OptionsItem[]>([]);

// 合并到缓存
const mergeOptions = (
  source: OptionsItem[],
  target: OptionsItem[],
): OptionsItem[] => {
  if (target?.length === 0) {
    return source;
  }
  if (source.length === 0) {
    return target;
  }
  const res = [...source];
  const existingValues = new Set(source.map((item) => item.value));
  target?.forEach((item) => {
    const value = item.value;
    if (!existingValues.has(value)) {
      res.push(item);
      existingValues.add(value);
    }
  });
  return res;
};

const remoteQuery = ref('');
const handleDefaultRemoteMethod = (query: string) => {
  remoteQuery.value = query;
  if (query) {
    fetchApi();
  }
};

function buildTree(data: OptionsItem[]): OptionsItem[] {
  const nodeMap = new Map<any, any>();
  const result: OptionsItem[] = [];
  const { treeParentField } = props;
  // 将所有节点存入 Map，并初始化每个节点的 childrenField
  data.forEach((item) => nodeMap.set(item.value, { ...item, children: [] }));
  // 构建树结构
  data.forEach((item) => {
    const pid = item[treeParentField];
    const currentNode = nodeMap.get(item.value);
    const parent = nodeMap.get(pid);
    if (parent) {
      // 如果找到父节点，将当前节点挂载到父节点的
      parent.children.push(currentNode);
    } else {
      result.push(currentNode);
    }
  });
  return result;
}

function transformData(data: OptionsItem[]): OptionsItem[] {
  const { labelField, valueField, childrenField, numberToString } = props;
  const res = data.map((item) => {
    const value = item.value === undefined ? get(item, valueField) : item.value;
    // TODO 去掉多余字段
    return {
      ...objectOmit(item, [labelField, valueField, childrenField]),
      label: item.label || get(item, labelField),
      value: numberToString ? `${value}` : value,
      ...(childrenField && item[childrenField]
        ? { children: transformData(item[childrenField]) }
        : {}),
    };
  });
  return props.treeTransform ? buildTree(res) : res;
}

const getOptions = computed(() => {
  const refOptionsData = unref(refOptions);
  const data: OptionsItem[] = transformData(refOptionsData);
  // return data.length > 0 ? data : props.options;
  return data.length > 0 ? data : [];
});

const bindOptions = computed(() => {
  const options = unref(cacheOptions)
    ? mergeOptions(unref(originOptions), unref(cachedOptions))
    : mergeOptions(unref(originOptions), unref(getOptions));
  return unref(remoteQuery)
    ? options.filter((item) => {
        return item.label?.includes(unref(remoteQuery));
      })
    : options;
});

const bindProps = computed(() => {
  return {
    [props.modelPropName]: props.arrayString
      ? strToArray(unref(modelValue))
      : unref(modelValue),
    // [props.optionsPropName]: unref(getOptions),
    [props.optionsPropName]: unref(bindOptions),
    [`onUpdate:${props.modelPropName}`]: (val: any) => {
      modelValue.value = props.arrayString ? arrayToStr(val) : val;
    },
    remote: !!props.remoteFilterField,
    [props.remotePropName]:
      props.remoteMethod ||
      (props.remoteFilterField ? handleDefaultRemoteMethod : undefined),
    ...objectOmit(attrs, ['onUpdate:value']),
    ...(props.visibleEvent
      ? {
          [props.visibleEvent]: handleFetchForVisible,
        }
      : {}),
  };
});

async function fetchApi() {
  let { api, beforeFetch, afterFetch, params, resultField, remoteFilterField } =
    props;
  if (!api || !isFunction(api) || loading.value) {
    return;
  }
  refOptions.value = [];
  try {
    loading.value = true;
    if (beforeFetch && isFunction(beforeFetch)) {
      params = (await beforeFetch(params)) || params;
    }
    let res = await api({ ...params, [remoteFilterField]: unref(remoteQuery) });
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

// 缓存监听
if (unref(cacheOptions)) {
  watch(getOptions, (options) => {
    cachedOptions.value = mergeOptions(unref(cachedOptions), options);
  });
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
