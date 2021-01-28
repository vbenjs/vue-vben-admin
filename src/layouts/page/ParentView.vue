<!--
 * @Description: The reason is that tsx will report warnings under multi-level nesting.
-->
<template>
  <div>
    <router-view>
      <template #default="{ Component, route }">
        <transition
          :name="
            getTransitionName({
              route,
              openCache: openCache,
              enableTransition: getEnableTransition,
              cacheTabs: getCaches,
              def: getBasicTransition,
            })
          "
          mode="out-in"
          appear
        >
          <keep-alive v-if="openCache" :include="getCaches">
            <component :is="Component" v-bind="getKey(Component, route)" />
          </keep-alive>
          <component v-else :is="Component" v-bind="getKey(Component, route)" />
        </transition>
      </template>
    </router-view>
  </div>
</template>
<script lang="ts">
  import { computed, defineComponent, unref } from 'vue';

  import { useRootSetting } from '/@/hooks/setting/useRootSetting';
  import { useMultipleTabSetting } from '/@/hooks/setting/useMultipleTabSetting';

  import { useTransitionSetting } from '/@/hooks/setting/useTransitionSetting';
  import { useCache, getKey } from './useCache';
  import { getTransitionName } from './transition';

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
        getTransitionName,
        getKey,
      };
    },
  });
</script>
