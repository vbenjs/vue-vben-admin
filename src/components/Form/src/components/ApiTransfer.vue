<template>
  <Transfer
    :data-source="getdataSource"
    :filter-option="filterOption"
    :render="(item) => item.title"
    :showSelectAll="showSelectAll"
    :selectedKeys="selectedKeys"
    :targetKeys="getTargetKeys"
    :showSearch="showSearch"
    :disabled="disabled"
    @change="handleChange"
  />
</template>

<script lang="ts" setup>
  import { computed, watch, ref, unref, watchEffect, PropType } from 'vue';
  import { Transfer } from 'ant-design-vue';
  import { isFunction } from '@/utils/is';
  import { get, omit } from 'lodash-es';
  import { propTypes } from '@/utils/propTypes';
  import { TransferDirection, TransferItem } from 'ant-design-vue/lib/transfer';

  defineOptions({ name: 'ApiTransfer' });

  const props = defineProps({
    value: { type: Array as PropType<Array<string>> },
    api: {
      type: Function as PropType<(arg) => Promise<TransferItem[] | Recordable<any>>>,
      default: null,
    },
    params: { type: Object },
    dataSource: { type: Array as PropType<Array<TransferItem>> },
    immediate: propTypes.bool.def(true),
    alwaysLoad: propTypes.bool.def(false),
    beforeFetch: {
      type: Function as PropType<Fn>,
      default: null,
    },
    afterFetch: {
      type: Function as PropType<Fn>,
      default: null,
    },
    resultField: propTypes.string.def(''),
    labelField: propTypes.string.def('title'),
    valueField: propTypes.string.def('key'),
    showSearch: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    filterOption: {
      type: Function as PropType<(inputValue: string, item: TransferItem) => boolean>,
    },
    selectedKeys: { type: Array as PropType<Array<string>> },
    showSelectAll: { type: Boolean, default: false },
    targetKeys: { type: Array as PropType<Array<string>> },
  });

  const emit = defineEmits(['options-change', 'change']);

  const _dataSource = ref<TransferItem[]>([]);
  const _targetKeys = ref<string[]>([]);

  const getdataSource = computed(() => {
    const { labelField, valueField } = props;

    return unref(_dataSource).reduce((prev, next) => {
      if (next) {
        prev.push({
          ...omit(next, [labelField, valueField]),
          title: next[labelField],
          key: next[valueField],
        });
      }
      return prev;
    }, [] as TransferItem[]);
  });
  const getTargetKeys = computed<string[]>(() => {
    /* if (unref(_targetKeys).length > 0) {
          return unref(_targetKeys);
        } */
    if (Array.isArray(props.value)) {
      return props.value;
    }
    if (Array.isArray(props.targetKeys)) {
      return props.targetKeys;
    }
    return [];
  });

  function handleChange(keys: string[], direction: TransferDirection, moveKeys: string[]) {
    _targetKeys.value = keys;
    console.log(direction);
    console.log(moveKeys);
    emit('change', keys);
  }

  watchEffect(() => {
    props.immediate && !props.alwaysLoad && fetch();
  });

  watch(
    () => props.params,
    () => {
      fetch();
    },
    { deep: true },
  );

  async function fetch() {
    let { api, beforeFetch, afterFetch, params, resultField, dataSource } = props;
    if (!api || !isFunction(api)) {
      if (Array.isArray(dataSource)) {
        _dataSource.value = dataSource;
      }
      return;
    }
    _dataSource.value = [];
    try {
      if (beforeFetch && isFunction(beforeFetch)) {
        params = (await beforeFetch(params)) || params;
      }
      let res = await api(params);
      if (afterFetch && isFunction(afterFetch)) {
        res = (await afterFetch(res)) || res;
      }
      if (Array.isArray(res)) {
        _dataSource.value = res;
        emitChange();
        return;
      }
      if (resultField) {
        _dataSource.value = get(res, resultField) || [];
      }
      emitChange();
    } catch (error) {
      console.warn(error);
    }
  }
  function emitChange() {
    emit('options-change', unref(getdataSource));
  }
</script>
