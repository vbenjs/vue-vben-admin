<template>
  <TreeSelect
    v-bind="getAttrs"
    @change="handleChange"
    :field-names="fieldNames"
    :load-data="async ? onLoadData : undefined"
  >
    <template #[item]="data" v-for="item in Object.keys($slots)">
      <slot :name="item" v-bind="data || {}"></slot>
    </template>
    <template #suffixIcon v-if="loading">
      <LoadingOutlined spin />
    </template>
  </TreeSelect>
</template>

<script lang="ts" setup>
  import { type Recordable } from '@vben/types';
  import { type PropType, computed, watch, ref, onMounted, unref, useAttrs } from 'vue';
  import { TreeSelect } from 'ant-design-vue';
  import { isArray, isFunction } from '@/utils/is';
  import { get } from 'lodash-es';
  import { propTypes } from '@/utils/propTypes';
  import { LoadingOutlined } from '@ant-design/icons-vue';

  defineOptions({ name: 'ApiTreeSelect' });

  const props = defineProps({
    api: { type: Function as PropType<(arg?: any) => Promise<Recordable<any>>> },
    params: { type: Object },
    immediate: { type: Boolean, default: true },
    async: { type: Boolean, default: false },
    resultField: propTypes.string.def(''),
    labelField: propTypes.string.def('title'),
    valueField: propTypes.string.def('value'),
    childrenField: propTypes.string.def('children'),
    beforeFetch: {
      type: Function as PropType<Fn>,
      default: null,
    },
    afterFetch: {
      type: Function as PropType<Fn>,
      default: null,
    },
  });

  const emit = defineEmits(['options-change', 'change', 'load-data']);

  const attrs = useAttrs();
  const treeData = ref<Recordable<any>[]>([]);
  const isFirstLoaded = ref<Boolean>(false);
  const loading = ref(false);
  const getAttrs = computed(() => {
    return {
      ...(props.api ? { treeData: unref(treeData) } : {}),
      ...attrs,
    };
  });
  const fieldNames = {
    children: props.childrenField,
    value: props.valueField,
    label: props.labelField,
  };

  function handleChange(...args) {
    emit('change', ...args);
  }

  watch(
    () => props.params,
    () => {
      !unref(isFirstLoaded) && fetch();
    },
    { deep: true },
  );

  watch(
    () => props.immediate,
    (v) => {
      v && !isFirstLoaded.value && fetch();
    },
  );

  onMounted(() => {
    props.immediate && fetch();
  });

  function onLoadData(treeNode) {
    return new Promise((resolve: (value?: unknown) => void) => {
      if (isArray(treeNode.children) && treeNode.children.length > 0) {
        resolve();
        return;
      }
      emit('load-data', { treeData, treeNode, resolve });
    });
  }

  async function fetch() {
    let { api, beforeFetch, afterFetch, params, resultField } = props;
    if (!api || !isFunction(api) || loading.value) return;
    loading.value = true;
    treeData.value = [];
    let res;
    try {
      if (beforeFetch && isFunction(beforeFetch)) {
        params = (await beforeFetch(params)) || params;
      }
      res = await api(params);
      if (afterFetch && isFunction(afterFetch)) {
        res = (await afterFetch(res)) || res;
      }
    } catch (e) {
      console.error(e);
    }
    loading.value = false;
    if (!res) return;
    if (resultField) {
      res = get(res, resultField) || [];
    }
    treeData.value = (res as Recordable<any>[]) || [];
    isFirstLoaded.value = true;
    emit('options-change', treeData.value);
  }
</script>
