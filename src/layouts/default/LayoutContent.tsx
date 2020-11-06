import { defineComponent } from 'vue';
// import { Layout } from 'ant-design-vue';
// hooks

import { ContentEnum } from '/@/enums/appEnum';
import { appStore } from '/@/store/modules/app';
import PageLayout from '/@/layouts/page/index';
export default defineComponent({
  name: 'DefaultLayoutContent',
  setup() {
    return () => {
      const { getProjectConfig } = appStore;
      const { contentMode } = getProjectConfig;
      const wrapClass = contentMode === ContentEnum.FULL ? 'full' : 'fixed';
      return (
        // <Layout.Content class={`layout-content ${wrapClass} `}>
        <PageLayout class={`layout-content ${wrapClass} `} />
        // </Layout.Content>
      );
    };
  },
});
