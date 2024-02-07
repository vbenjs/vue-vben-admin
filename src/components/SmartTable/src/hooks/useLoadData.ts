import type { SmartTableProps, FetchParams, SmartTableProxyConfig } from '@/components/SmartTable';
import type { ComputedRef, Ref } from 'vue';
import type { VxeGridInstance, VxeGridPropTypes } from 'vxe-table';

import { computed, nextTick, ref, unref, watch } from 'vue';
import { isArray } from '@/utils/is';
import { error } from '@/utils/log';

interface ActionType {
  setLoading: (loading: boolean) => void;
  setPagination: (info: Partial<VxeGridPropTypes.PagerConfig>) => void;
}

export const useLoadData = (
  tableProps: ComputedRef<SmartTableProps>,
  tableRef: Ref<VxeGridInstance>,
  pagerConfigRef: ComputedRef<VxeGridPropTypes.PagerConfig | undefined>,
  proxyConfigRef: ComputedRef<SmartTableProxyConfig | undefined>,
  emit: Function,
  { setLoading, setPagination }: ActionType,
) => {
  const tableDataRef = ref<any[]>([]);
  const sortListRef = ref<VxeGridPropTypes.ProxyAjaxQuerySortCheckedParams[]>();
  watch(
    () => unref(tableProps).sortConfig?.defaultSort,
    (defaultSort) => {
      if (defaultSort) {
        if (isArray(defaultSort)) {
          sortListRef.value = defaultSort.map((item) => {
            return {
              ...item,
              sortBy: '',
              column: {},
              property: '',
            } as VxeGridPropTypes.ProxyAjaxQuerySortCheckedParams;
          });
        } else {
          sortListRef.value = [
            {
              ...defaultSort,
              sortBy: '',
              column: {},
              property: '',
            } as VxeGridPropTypes.ProxyAjaxQuerySortCheckedParams,
          ];
        }
      }
    },
  );
  const handleSortChange = (data) => {
    sortListRef.value = data.sortList;
    nextTick(() => query());
    emit('sort-change', data);
  };
  /**
   * 获取表格事件信息
   */
  const getTableLoadDataEvent = computed(() => {
    return {
      onSortChange: handleSortChange,
    };
  });

  /**
   * 查询
   * @param opt
   */
  const query = (opt?: FetchParams) => doQuery(opt);

  const doQuery = async (opt?: FetchParams) => {
    const proxyConfig = unref(proxyConfigRef);
    if (!proxyConfig || !proxyConfig.ajax?.query) {
      if (process.env.NODE_ENV === 'development') {
        error('proxy-config.ajax.query未定义');
      }
    }
    const vxeTable = unref(tableRef);
    // 过滤信息
    const filterList = vxeTable.getCheckedFilters();
    // 分页信息
    let pageParams: any = {};
    const pagerConfig = unref(pagerConfigRef);
    if (pagerConfig) {
      pageParams = {
        currentPage: pagerConfig.currentPage,
        pageSize: pagerConfig.pageSize,
      };
    }
    const sortList = unref(sortListRef)!;
    const params: VxeGridPropTypes.ProxyAjaxQueryParams = {
      $grid: unref(tableRef),
      filters: filterList,
      page: pageParams,
      sorts: sortList,
      form: {},
      // @ts-ignore
      sort: sortList.length > 0 ? sortList[0] : {},
    };
    try {
      setLoading(true);
      const proxyData = await proxyConfig?.ajax?.query!(params, opt);
      if (pagerConfig && !pagerConfig.enabled) {
        const { result, total } = proxyConfig?.props || {};
        tableDataRef.value = proxyData[result || 'rows'];
        setPagination({
          total: proxyData[total || 'total'],
        });
      } else {
        tableDataRef.value = proxyData;
      }
      nextTick(() => {
        emit('after-load');
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    tableDataRef,
    getTableLoadDataEvent,
    query,
  };
};
