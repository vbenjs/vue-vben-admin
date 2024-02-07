import { computed, ref, unref, watch } from 'vue';

import type { ComputedRef } from 'vue';
import type { SmartTableProps } from '@/components/SmartTable';
import { isBoolean } from '@/utils/is';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS, DEFAULT_PAGE_LAYOUTS } from '../const';
import { VxeGridPropTypes } from 'vxe-table';

/**
 * 分页支持
 * @author zhongming4762
 * @param propsRef
 */
export const usePagination = (propsRef: ComputedRef<SmartTableProps>) => {
  const configRef = ref<VxeGridPropTypes.PagerConfig>({});
  const show = ref(true);

  watch(
    () => unref(propsRef).pagerConfig,
    (pagerConfig) => {
      if (!isBoolean(pagerConfig) && pagerConfig) {
        configRef.value = {
          ...unref(configRef),
          ...(pagerConfig ?? {}),
        };
      }
    },
  );

  const getPaginationInfo = computed((): VxeGridPropTypes.PagerConfig | undefined => {
    const { pagerConfig } = unref(propsRef);
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

  const setPagination = (info: Partial<VxeGridPropTypes.PagerConfig>) => {
    const paginationInfo = unref(getPaginationInfo);
    configRef.value = {
      ...(!isBoolean(paginationInfo) ? paginationInfo : {}),
      ...info,
    };
  };

  const getPagination = () => unref(getPaginationInfo);

  function getShowPagination() {
    return unref(show);
  }

  async function setShowPagination(flag: boolean) {
    show.value = flag;
  }

  return {
    getPaginationInfo,
    setPagination,
    getPagination,
    getShowPagination,
    setShowPagination,
  };
};
