<template>
  <Menu
    v-bind="getBindValues"
    :activeName="menuState.activeName"
    :openNames="getOpenKeys"
    :class="prefixCls"
    :activeSubMenuNames="menuState.activeSubMenuNames"
    @select="handleSelect"
  >
    <template v-for="item in items" :key="item.path">
      <SimpleSubMenu
        :item="item"
        :parent="true"
        :collapsedShowTitle="collapsedShowTitle"
        :collapse="collapse"
      />
    </template>
  </Menu>
</template>
<script lang="ts" setup>
  import type { MenuState } from './types';
  import type { Menu as MenuType } from '@/router/types';
  import type { RouteLocationNormalizedLoaded } from 'vue-router';
  import { computed, ref, unref, reactive, toRefs, watch, PropType, useAttrs } from 'vue';
  import { useDesign } from '@/hooks/web/useDesign';
  import Menu from './components/Menu.vue';
  import SimpleSubMenu from './SimpleSubMenu.vue';
  import { listenerRouteChange } from '@/logics/mitt/routeChange';
  import { propTypes } from '@/utils/propTypes';
  import { REDIRECT_NAME } from '@/router/constant';
  import { useRouter } from 'vue-router';
  import { isFunction, isHttpUrl } from '@/utils/is';
  import { openWindow } from '@/utils';
  import { useOpenKeys } from './useOpenKeys';

  defineOptions({ name: 'SimpleMenu', inheritAttrs: false });

  const props = defineProps({
    items: {
      type: Array as PropType<MenuType[]>,
      default: () => [],
    },
    collapse: propTypes.bool,
    mixSider: propTypes.bool,
    theme: propTypes.string,
    accordion: propTypes.bool.def(true),
    collapsedShowTitle: propTypes.bool,
    beforeClickFn: {
      type: Function as PropType<(key: string) => Promise<boolean>>,
    },
    isSplitMenu: propTypes.bool,
  });

  const emit = defineEmits(['menuClick']);

  const attrs = useAttrs();

  const currentActiveMenu = ref('');
  const isClickGo = ref(false);

  const menuState = reactive<MenuState>({
    activeName: '',
    openNames: [],
    activeSubMenuNames: [],
  });

  const { currentRoute } = useRouter();
  const { prefixCls } = useDesign('simple-menu');
  const { items, accordion, mixSider, collapse } = toRefs(props);

  const { setOpenKeys, getOpenKeys } = useOpenKeys(
    menuState,
    items,
    accordion,
    mixSider as any,
    collapse as any,
  );

  const getBindValues = computed(() => ({ ...attrs, ...props }));

  watch(
    () => props.collapse,
    (collapse) => {
      if (collapse) {
        menuState.openNames = [];
      } else {
        setOpenKeys(currentRoute.value.path);
      }
    },
    { immediate: true },
  );

  watch(
    () => props.items,
    () => {
      if (!props.isSplitMenu) {
        return;
      }
      setOpenKeys(currentRoute.value.path);
    },
    { flush: 'post' },
  );

  listenerRouteChange((route) => {
    if (route.name === REDIRECT_NAME) return;

    currentActiveMenu.value = route.meta?.currentActiveMenu as string;
    handleMenuChange(route);

    if (unref(currentActiveMenu)) {
      menuState.activeName = unref(currentActiveMenu);
      setOpenKeys(unref(currentActiveMenu));
    }
  });

  async function handleMenuChange(route?: RouteLocationNormalizedLoaded) {
    if (unref(isClickGo)) {
      isClickGo.value = false;
      return;
    }
    const path = (route || unref(currentRoute)).path;

    menuState.activeName = path;

    setOpenKeys(path);
  }

  async function handleSelect(key: string) {
    if (isHttpUrl(key)) {
      openWindow(key);
      return;
    }
    const { beforeClickFn } = props;
    if (beforeClickFn && isFunction(beforeClickFn)) {
      const flag = await beforeClickFn(key);
      if (!flag) return;
    }

    emit('menuClick', key);

    isClickGo.value = true;
    setOpenKeys(key);
    menuState.activeName = key;
  }
</script>
<style lang="less">
  @import url('./index.less');
</style>
