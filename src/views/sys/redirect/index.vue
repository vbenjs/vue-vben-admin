<template>
  <div />
</template>
<script lang="ts">
  import { defineComponent, unref } from 'vue';

  import { appStore } from '/@/store/modules/app';

  import { useRouter } from 'vue-router';
  import { useTransitionSetting } from '/@/hooks/setting/useTransitionSetting';
  export default defineComponent({
    name: 'Redirect',
    setup() {
      const { currentRoute, replace } = useRouter();
      const { getOpenPageLoading, getEnableTransition } = useTransitionSetting();

      const { params, query } = unref(currentRoute);
      const { path } = params;
      const _path = Array.isArray(path) ? path.join('/') : path;
      replace({
        path: '/' + _path,
        query,
      });
      if (unref(getEnableTransition) && unref(getOpenPageLoading)) {
        setTimeout(() => {
          appStore.setPageLoadingAction(false);
        }, 0);
      }
      return {};
    },
  });
</script>
