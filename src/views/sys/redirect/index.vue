<template>
  <div />
</template>
<script lang="ts">
  import { defineComponent, unref } from 'vue';

  import { appStore } from '/@/store/modules/app';

  import { useRouter } from 'vue-router';
  export default defineComponent({
    name: 'Redirect',
    setup() {
      const { currentRoute, replace } = useRouter();
      const { params, query } = unref(currentRoute);
      const { path } = params;
      const _path = Array.isArray(path) ? path.join('/') : path;
      replace({
        path: '/' + _path,
        query,
      });
      const { openRouterTransition, openPageLoading } = appStore.getProjectConfig;
      if (openRouterTransition && openPageLoading) {
        setTimeout(() => {
          appStore.setPageLoadingAction(false);
        }, 0);
      }
      return {};
    },
  });
</script>
