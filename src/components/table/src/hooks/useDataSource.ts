import { BasicTableProps, FetchParams } from '../types/table';
import { PaginationProps } from '../types/pagination';
import {
  watch,
  ref,
  unref,
  ComputedRef,
  computed,
  onMounted,
  SetupContext,
  Ref,
} from 'compatible-vue';
import { buildUUID } from '@/utils/uuid';
import { isFunction, isBoolean } from '@/utils/is/index';
import { ROW_KEY } from '../const';
import { get } from '@/utils/lodashChunk';

interface ActionType {
  getPaginationRef: ComputedRef<false | PaginationProps>;
  setPagination: (info: Partial<PaginationProps>) => void;
  loadingRef: Ref<boolean | undefined>;
}
export function useDataSource(
  propsRef: ComputedRef<BasicTableProps>,
  ctx: SetupContext,
  { getPaginationRef, setPagination, loadingRef }: ActionType
) {
  const { emit } = ctx;
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
      item[ROW_KEY] = buildUUID();
      if (item.children && item.children.length) {
        setTableKey(item.children);
      }
    });
  }

  const getDataSourceRef = computed(() => {
    const dataSource = unref(dataSourceRef);
    if (!dataSource || dataSource.length === 0) {
      return [];
    }
    const firstItem = dataSource[0];
    const lastItem = dataSource[dataSource.length - 1];

    if (firstItem && lastItem) {
      if (!firstItem[ROW_KEY] || !lastItem[ROW_KEY]) {
        unref(dataSourceRef).forEach((item) => {
          item[ROW_KEY] = buildUUID();
          if (item.children && item.children.length) {
            setTableKey(item.children);
          }
        });
      }
    }
    return unref(dataSourceRef);
  });

  async function fetch(opt?: FetchParams) {
    const { api, searchInfo, fetchSetting, beforeFetch, afterFetch } = unref(propsRef);
    if (!api && !isFunction(api)) return;

    try {
      loadingRef.value = true;
      const { pageField, sizeField, listField, totalField } = fetchSetting || {
        pageField: 'page',
        sizeField: 'pageSize',
        listField: 'items',
        totalField: 'total',
      };
      let pageParams = {};
      if (isBoolean(getPaginationRef)) {
        pageParams = {};
      } else {
        const { current, pageSize } = unref(getPaginationRef) as PaginationProps;
        pageParams[pageField] = opt?.page || current;
        pageParams[sizeField] = pageSize;
      }

      let params: any = {
        ...pageParams,
        ...searchInfo,
        ...opt?.searchInfo,
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
        total: resultTotal,
      });
      if (opt?.page) {
        setPagination({
          current: opt.page,
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
    }
  }

  function setTableData(values: any[]) {
    dataSourceRef.value = values;
  }
  onMounted(() => {
    const { immediate } = unref(propsRef);
    immediate && fetch();
  });

  return { getDataSourceRef, setTableData, rowKey: ROW_KEY, fetch: fetch };
}
