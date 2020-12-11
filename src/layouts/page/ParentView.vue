<!--
 * @Description: The reason is that tsx will report warnings under multi-level nesting.
-->
<template>
  <div>
    <router-view>
      <template v-slot="{ Component, route }">
        <keep-alive v-if="openCache" :include="getCaches">
          <component :is="Component" :key="route.fullPath" />
        </keep-alive>
        <component v-else :is="Component" :key="route.fullPath" />
      </template>
    </router-view>
  </div>
</template>
<script lang="ts">
  import { computed, defineComponent, unref } from 'vue';

  import { useRootSetting } from '/@/hooks/setting/useRootSetting';
  import { useMultipleTabSetting } from '/@/hooks/setting/useMultipleTabSetting';

  import { useTransitionSetting } from '/@/hooks/setting/useTransitionSetting';
  import { useCache } from './useCache';

  export default defineComponent({
    parentView: true,
    setup() {
      const { getCaches } = useCache(false);

      const { getShowMultipleTab } = useMultipleTabSetting();

      const { getOpenKeepAlive } = useRootSetting();

      const { getBasicTransition, getEnableTransition } = useTransitionSetting();

      const openCache = computed(() => unref(getOpenKeepAlive) && unref(getShowMultipleTab));

      return {
        getCaches,
        getBasicTransition,
        openCache,
        getEnableTransition,
      };
    },
  });
</script>
