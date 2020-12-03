<!--
 * @Description: The reason is that tsx will report warnings under multi-level nesting.
-->
<template>
  <div>
    <router-view>
      <template #default="{ Component, route }">
        <transition v-bind="transitionEvent" :name="getName(route)" mode="out-in" appear>
          <keep-alive v-if="openCache" :include="getCaches">
            <component :max="getMax" :is="Component" :key="route.fullPath" />
          </keep-alive>
          <component v-else :max="getMax" :is="Component" :key="route.fullPath" />
        </transition>
      </template>
    </router-view>
  </div>
</template>
<script lang="ts">
  import { computed, defineComponent, unref } from 'vue';
  import { RouteLocationNormalized } from 'vue-router';

  import { useTransition } from './useTransition';
  import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
  import { useRootSetting } from '/@/hooks/setting/useRootSetting';
  import { useMultipleTabSetting } from '/@/hooks/setting/useMultipleTabSetting';

  import { useTransitionSetting } from '/@/hooks/setting/useTransitionSetting';
  import { useCache } from './useCache';

  export default defineComponent({
    props: {
      isPage: {
        type: Boolean,
      },
    },
    setup(props) {
      const { getCaches } = useCache(props.isPage);

      const { getShowMenu } = useMenuSetting();

      const { getOpenKeepAlive } = useRootSetting();

      const { getBasicTransition, getEnableTransition } = useTransitionSetting();

      const { getMax } = useMultipleTabSetting();

      const transitionEvent = useTransition();

      const openCache = computed(() => unref(getOpenKeepAlive) && unref(getShowMenu));

      function getName(route: RouteLocationNormalized) {
        if (!unref(getEnableTransition)) {
          return null;
        }
        const cacheTabs = unref(getCaches);
        const isInCache = cacheTabs.includes(route.name as string);
        const name = isInCache && route.meta.inTab ? 'fade-slide' : null;

        return name || route.meta.transitionName || unref(getBasicTransition);
      }

      return {
        getCaches,
        getMax,
        transitionEvent,
        getBasicTransition,
        getName,
        openCache,
        getEnableTransition,
      };
    },
  });
</script>
