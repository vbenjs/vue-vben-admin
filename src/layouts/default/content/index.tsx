import './index.less';

import { defineComponent, unref, computed } from 'vue';
import { FullLoading } from '/@/components/Loading/index';

import { RouterView } from 'vue-router';

import { useRootSetting } from '/@/hooks/setting/useRootSetting';
import { useTransitionSetting } from '/@/hooks/setting/useTransitionSetting';
import { useMultipleTabSetting } from '/@/hooks/setting/useMultipleTabSetting';

export default defineComponent({
  name: 'LayoutContent',
  setup() {
    const { getOpenPageLoading } = useTransitionSetting();
    const { getShowMultipleTab } = useMultipleTabSetting();
    const { getLayoutContentMode, getPageLoading } = useRootSetting();

    const getLoadingClass = computed(() => {
      return [
        `layout-content__loading`,
        { fill: unref(getShowMultipleTab), hidden: !unref(getPageLoading) },
      ];
    });
    return () => {
      return (
        <div class={['layout-content', unref(getLayoutContentMode)]}>
          {unref(getOpenPageLoading) && <FullLoading class={unref(getLoadingClass)} />}
          <RouterView />
        </div>
      );
    };
  },
});
