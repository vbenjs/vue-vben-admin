import type { SmartTableProps } from '@/components/SmartTable';
import { computed, ComputedRef, ref, unref } from 'vue';
import type { VxeGridPropTypes } from 'vxe-table';
import { isBoolean } from '@/utils/is';
import {
  DEFAULT_PAGE_LAYOUTS,
  PAGE_SIZE,
  PAGE_SIZE_OPTIONS,
} from '@/components/SmartTable/src/const';

export const useTablePager = (tableProps: ComputedRef<SmartTableProps>, emit: Function) => {
  const configRef = ref<VxeGridPropTypes.PagerConfig>({});
  const show = ref(true);

  /**
   * 获取分页配置
   */
  const getPagerConfig = computed((): VxeGridPropTypes.PagerConfig | undefined => {
    const { pagerConfig } = unref(tableProps);
    if (!pagerConfig) {
      return undefined;
    }
    if (!unref(show) || (isBoolean(pagerConfig) && !pagerConfig)) {
      return undefined;
    }
    return {
      currentPage: 1,
      pageSize: PAGE_SIZE,
      pageSizes: PAGE_SIZE_OPTIONS,
      layouts: DEFAULT_PAGE_LAYOUTS,
      ...(isBoolean(pagerConfig) ? {} : pagerConfig),
      ...unref(configRef),
    };
  });

  /**
   * 分页触发
   */
  const handlePageChange = (eventData) => {
    configRef.value.pageSize = eventData.pageSize;
    configRef.value.currentPage = eventData.currentPage;
    emit('page-change', eventData);
  };

  /**
   * 插槽信息
   */
  const getPagerSlots = computed(() => {
    if (!unref(getPagerConfig)) {
      return {};
    }
    return {
      pager: () => <vxe-pager {...unref(getPagerConfig)} onPageChange={handlePageChange} />,
    };
  });

  async function setShowPagination(flag: boolean) {
    show.value = flag;
  }

  function getShowPagination() {
    return unref(show);
  }

  const getPagination = () => unref(getPagerConfig);

  const setPagination = (info: Partial<VxeGridPropTypes.PagerConfig>) => {
    const paginationInfo = unref(getPagerConfig);
    configRef.value = {
      ...(!isBoolean(paginationInfo) ? paginationInfo : {}),
      ...info,
    };
  };

  return {
    getPagerSlots,
    setShowPagination,
    getShowPagination,
    getPagination,
    setPagination,
    getPagerConfig,
  };
};
