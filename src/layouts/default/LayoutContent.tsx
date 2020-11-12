import { computed, defineComponent, unref } from 'vue';
import { Layout } from 'ant-design-vue';
import { FullLoading } from '/@/components/Loading/index';

import { RouterView } from 'vue-router';

import { ContentEnum } from '/@/enums/appEnum';
import { appStore } from '/@/store/modules/app';
export default defineComponent({
  name: 'DefaultLayoutContent',
  setup() {
    const getProjectConfigRef = computed(() => {
      return appStore.getProjectConfig;
    });

    return () => {
      const { contentMode, openPageLoading } = unref(getProjectConfigRef);
      const { getPageLoading } = appStore;
      const wrapClass = contentMode === ContentEnum.FULL ? 'full' : 'fixed';
      return (
        <div class={[`default-layout__main`]}>
          {openPageLoading && (
            <FullLoading class={[`default-layout__loading`, !getPageLoading && 'hidden']} />
          )}
          <Layout.Content class={`layout-content ${wrapClass} `}>
            {() => <RouterView />}
          </Layout.Content>
        </div>
      );
    };
  },
});
