import { defineComponent, computed, unref, toRefs } from 'vue';
import { propTypes } from '@/utils/propTypes';

import './TableSearchLayout.less';

export default defineComponent({
  name: 'TableSearchLayout',
  props: {
    /**
     * 是否显示搜索栏
     */
    showSearch: propTypes.bool.def(true),
  },
  setup(props, { slots }) {
    const { showSearch: showSearchRef } = toRefs(props);
    const { search, default: tableSlot } = slots;
    const hasSearchForm = computed(() => search !== undefined);

    // const getTableContainerStyle = computed((): StyleValue => {
    //   let height = '100%'
    //   if (unref(hasSearchForm) && unref(showSearchRef)) {
    //     height = 'calc(100% - 70px)'
    //   }
    //   return {
    //     height,
    //   }
    // })

    const getSearchContainerClass = computed(() => {
      const classList = ['smart-search-container'];
      if (!unref(showSearchRef)) {
        classList.push('smart-table-search-hidden');
      }
      return classList;
    });

    return () => (
      <div class="smart-table-search-layout">
        {unref(hasSearchForm) ? (
          <div class={unref(getSearchContainerClass)}>{search && search()}</div>
        ) : (
          ''
        )}
        <div class="smart-table-container">{tableSlot && tableSlot()}</div>
      </div>
    );
  },
});
