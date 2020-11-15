import type { BasicTableProps, FetchParams } from '../types/table';
import type { PaginationProps } from '../types/pagination';

import { watch, ref, unref, ComputedRef, computed, onMounted, Ref } from 'vue';

import { useTimeoutFn } from '@vueuse/core';

import { buildUUID } from '/@/utils/uuid';
import { isFunction, isBoolean } from '/@/utils/is';
import { get } from 'lodash-es';

import { useProps } from './useProps';

import { FETCH_SETTING, ROW_KEY } from '../const';
interface ActionType {
  getPaginationRef: ComputedRef<false | PaginationProps>;
  setPagination: (info: Partial<PaginationProps>) => void;
  loadingRef: Ref<boolean | undefined>;
  getFieldsValue: () => {
    [field: string]: any;
  };
}
export function useDataSource(
  refProps: ComputedRef<BasicTableProps>,
  { getPaginationRef, setPagination, loadingRef, getFieldsValue }: ActionType,
  emit: EmitType
) {
  const { propsRef } = useProps(refProps);

  const dataSourceRef = ref<any[]>([]);

  watch(
    () => unref(propsRef).dataSource,
    (data: any[]) => {
      const { api } = unref(propsRef);
      !api && (dataSourceRef.value = data);
    },
    { immediate: true }
  );

  function setTableKey(items: any[]) {
    if (!items || !Array.isArray(items)) {
      return;
    }
    items.forEach((item) => {
      if (!item[ROW_KEY]) {
        item[ROW_KEY] = buildUUID();
      }
      if (item.children && item.children.length) {
        setTableKey(item.children);
      }
    });
  }
  const getAutoCreateKey = computed(() => {
    return unref(propsRef).autoCreateKey && !unref(propsRef).rowKey;
  });

  const getDataSourceRef = computed(() => {
    const dataSource = unref(dataSourceRef);
    if (!dataSource || dataSource.length === 0) {
      return [];
    }
    if (unref(getAutoCreateKey)) {
      const firstItem = dataSource[0];
      const lastItem = dataSource[dataSource.length - 1];

      if (firstItem && lastItem) {
        if (!firstItem[ROW_KEY] || !lastItem[ROW_KEY]) {
          unref(dataSourceRef).forEach((item) => {
            if (!item[ROW_KEY]) {
              item[ROW_KEY] = buildUUID();
            }
            if (item.children && item.children.length) {
              setTableKey(item.children);
            }
          });
        }
      }
    }
    return unref(dataSourceRef);
  });

  async function fetch(opt?: FetchParams) {
    const { api, searchInfo, fetchSetting, beforeFetch, afterFetch, useSearchForm } = unref(
      propsRef
    );
    if (!api || !isFunction(api)) return;
    try {
      loadingRef.value = true;
      const { pageField, sizeField, listField, totalField } = fetchSetting || FETCH_SETTING;
      let pageParams: any = {};
      if (isBoolean(getPaginationRef)) {
        pageParams = {};
      } else {
        const { current, pageSize } = unref(getPaginationRef) as PaginationProps;
        pageParams[pageField] = (opt && opt.page) || current;
        pageParams[sizeField] = pageSize;
      }

      let params: any = {
        ...pageParams,
        ...(useSearchForm ? getFieldsValue() : {}),
        ...searchInfo,
        ...(opt ? opt.searchInfo : {}),
        ...(opt ? opt.sortInfo : {}),
        ...(opt ? opt.filterInfo : {}),
      };
      if (beforeFetch && isFunction(beforeFetch)) {
        params = beforeFetch(params) || params;
      }

      const res = await api(params);
      let resultItems: any[] = get(res, listField);
      const resultTotal: number = get(res, totalField);
      if (afterFetch && isFunction(afterFetch)) {
        resultItems = afterFetch(resultItems) || resultItems;
      }
      dataSourceRef.value = resultItems;
      setPagination({
        total: resultTotal || 0,
      });
      if (opt && opt.page) {
        setPagination({
          current: opt.page || 1,
        });
      }
      emit('fetch-success', {
        items: unref(resultItems),
        total: resultTotal,
      });
    } catch (error) {
      emit('fetch-error', error);
      dataSourceRef.value = [];
      setPagination({
        total: 0,
      });
    } finally {
      loadingRef.value = false;
      // setSearchFormLoading(false);
    }
  }

  function setTableData(values: any[]) {
    dataSourceRef.value = values;
  }
  onMounted(() => {
    // 转异步任务
    useTimeoutFn(() => {
      unref(propsRef).immediate && fetch();
    }, 0);
  });

  return { getDataSourceRef, setTableData, getAutoCreateKey, fetch: fetch };
}
