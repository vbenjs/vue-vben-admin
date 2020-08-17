<script lang="tsx">
  import { defineComponent, onBeforeMount } from 'compatible-vue';

  import { appStore } from '@/store/modules/app';

  export default defineComponent({
    name: 'Redirect',
    setup(props, { root }) {
      const { $route, $router } = root;
      onBeforeMount(() => {
        const { params, query } = $route;
        const { path } = params;
        $router.replace({
          path: '/' + path,
          query,
        });

        // const { openPageLoading } = appStore.getProjCfg;
        // if (openPageLoading) {
        setTimeout(() => {
          appStore.setPageLoadingAction(false);
        }, 0);
        // }
      });
      return () => null;
    },
  });
</script>
