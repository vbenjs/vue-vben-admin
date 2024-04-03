import { type App, defineComponent } from 'vue';
import { withInstall } from '@/utils';

import { useProviderDict } from './hooks/useProviderDict';

const SmartPageProvider = defineComponent({
  name: 'SmartPageProvider',
  setup(props, { slots }) {
    useProviderDict();

    return () => {
      const children = slots.default?.();
      return children && children[0];
    };
  },
});

SmartPageProvider.install = function (app: App) {
  app.component(SmartPageProvider.name, SmartPageProvider);
  return app;
};

export default withInstall(SmartPageProvider);
