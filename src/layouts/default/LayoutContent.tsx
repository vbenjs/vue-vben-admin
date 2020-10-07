import { defineComponent } from 'vue';
import { Layout } from 'ant-design-vue';
// hooks

import { ContentEnum } from '/@/enums/appEnum';
import { appStore } from '/@/store/modules/app';
// import { RouterView } from 'vue-router';
import PageLayout from '/@/layouts/page/index';
import FrameLayout from '/@/layouts/iframe/index.vue';

import { useSetting } from '/@/hooks/core/useSetting';
export default defineComponent({
  name: 'DefaultLayoutContent',
  setup() {
    const { projectSetting } = useSetting();

    return () => {
      const { getProjectConfig } = appStore;
      const { contentMode } = getProjectConfig;

      const wrapClass = contentMode === ContentEnum.FULL ? 'full' : 'fixed';
      return (
        <Layout.Content class={`layout-content ${wrapClass} `}>
          {{
            default: () => [<PageLayout />, projectSetting.canEmbedIFramePage && <FrameLayout />],
          }}
        </Layout.Content>
      );
    };
  },
});
