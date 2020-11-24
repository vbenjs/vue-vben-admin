import './index.less';

import { defineComponent, unref } from 'vue';
import { FullLoading } from '/@/components/Loading/index';

import { RouterView } from 'vue-router';

import { useRootSetting } from '/@/hooks/setting/useRootSetting';

export default defineComponent({
  name: 'LayoutContent',
  setup() {
    const { getOpenPageLoading, getLayoutContentMode, getPageLoading } = useRootSetting();

    return () => {
      return (
        <div class={['layout-content', unref(getLayoutContentMode)]}>
          {unref(getOpenPageLoading) && (
            <FullLoading class={[`layout-content__loading`, { hidden: !unref(getPageLoading) }]} />
          )}
          <RouterView />
        </div>
      );
    };
  },
});
