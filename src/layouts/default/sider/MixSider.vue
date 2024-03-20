<template>
  <div :class="`${prefixCls}-dom`" :style="getDomStyle"></div>
  <div
    v-click-outside="handleClickOutside"
    :style="getWrapStyle"
    :class="[
      prefixCls,
      getMenuTheme,
      {
        open: openMenu,
        mini: getCollapsed,
      },
    ]"
    v-bind="getMenuEvents"
  >
    <AppLogo :showTitle="false" :class="`${prefixCls}-logo`" />

    <LayoutTrigger :class="`${prefixCls}-trigger`" />

    <ScrollContainer>
      <ul :class="`${prefixCls}-module`">
        <li
          :class="[
            `${prefixCls}-module__item `,
            {
              [`${prefixCls}-module__item--active`]: item.path === activePath,
            },
          ]"
          v-bind="getItemEvents(item)"
          v-for="item in menuModules"
          :key="item.path"
        >
          <SimpleMenuTag :item="item" collapseParent dot />
          <img
            v-if="item.img"
            :src="item.img"
            :class="[`${prefixCls}-module__icon`, getCollapsed ? 'w-16px h-16px' : 'w-20px h-20px']"
          />
          <Icon
            v-else
            :class="`${prefixCls}-module__icon`"
            :size="getCollapsed ? 16 : 20"
            :icon="item.icon || (item.meta && item.meta.icon)"
          />
          <p :class="`${prefixCls}-module__name`">
            {{ t(item?.meta?.title || item.name) }}
          </p>
        </li>
      </ul>
    </ScrollContainer>

    <div :class="`${prefixCls}-menu-list`" ref="sideRef" :style="getMenuStyle">
      <div
        v-show="openMenu"
        :class="[
          `${prefixCls}-menu-list__title`,
          {
            show: openMenu,
          },
        ]"
      >
        <span class="text"> {{ title }}</span>
        <Icon
          :size="16"
          :icon="getMixSideFixed ? 'ri:pushpin-2-fill' : 'ri:pushpin-2-line'"
          class="pushpin"
          @click="handleFixedMenu"
        />
      </div>
      <ScrollContainer :class="`${prefixCls}-menu-list__content`">
        <SimpleMenu
          :items="childrenMenus"
          :theme="getMenuTheme"
          mixSider
          @menu-click="handleMenuClick"
        />
      </ScrollContainer>
      <div
        v-show="getShowDragBar && openMenu"
        :class="`${prefixCls}-drag-bar`"
        ref="dragBarRef"
      ></div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import type { Menu } from '@/router/types';
  import type { CSSProperties } from 'vue';
  import { computed, onMounted, ref, unref, watch } from 'vue';
  import type { RouteLocationNormalized } from 'vue-router';
  import { ScrollContainer } from '@/components/Container';
  import { SimpleMenu } from '@/components/SimpleMenu';
  import Icon from '@/components/Icon/Icon.vue';
  import { AppLogo } from '@/components/Application';
  import { useMenuSetting } from '@/hooks/setting/useMenuSetting';
  import { usePermissionStore } from '@/store/modules/permission';
  import { useDragLine } from './useLayoutSider';
  import { useGlobSetting } from '@/hooks/setting';
  import { useDesign } from '@/hooks/web/useDesign';
  import { useI18n } from '@/hooks/web/useI18n';
  import { useGo } from '@/hooks/web/usePage';
  import { SIDE_BAR_MINI_WIDTH, SIDE_BAR_SHOW_TIT_MINI_WIDTH } from '@/enums/appEnum';
  import vClickOutside from '@/directives/clickOutside';
  import { getChildrenMenus, getCurrentParentPath, getShallowMenus } from '@/router/menus';
  import { listenerRouteChange } from '@/logics/mitt/routeChange';
  import LayoutTrigger from '../trigger/index.vue';
  import { createAsyncComponent } from '@/utils/factory/createAsyncComponent';

  const SimpleMenuTag = createAsyncComponent(
    () => import('@/components/SimpleMenu/src/SimpleMenuTag.vue'),
  );

  defineOptions({ name: 'LayoutMixSider' });

  let menuModules = ref<Menu[]>([]);
  const activePath = ref('');
  const childrenMenus = ref<Menu[]>([]);
  const openMenu = ref(false);
  const dragBarRef = ref(null);
  const sideRef = ref(null);
  const currentRoute = ref<RouteLocationNormalized | null>(null);

  const { prefixCls } = useDesign('layout-mix-sider');
  const go = useGo();
  const { t } = useI18n();
  const {
    getMenuWidth,
    getCanDrag,
    getCloseMixSidebarOnChange,
    getMenuTheme,
    getMixSideTrigger,
    getRealWidth,
    getMixSideFixed,
    mixSideHasChildren,
    setMenuSetting,
    getIsMixSidebar,
    getCollapsed,
  } = useMenuSetting();

  const { title } = useGlobSetting();
  const permissionStore = usePermissionStore();

  useDragLine(sideRef, dragBarRef, true);

  const getMenuStyle = computed((): CSSProperties => {
    return {
      width: unref(openMenu) ? `${unref(getMenuWidth)}px` : 0,
      left: `${unref(getMixSideWidth)}px`,
    };
  });

  const getIsFixed = computed(() => {
    /* eslint-disable-next-line */
    mixSideHasChildren.value = unref(childrenMenus).length > 0;
    const isFixed = unref(getMixSideFixed) && unref(mixSideHasChildren);
    if (isFixed) {
      /* eslint-disable-next-line */
      openMenu.value = true;
    }
    return isFixed;
  });

  const getMixSideWidth = computed(() => {
    return unref(getCollapsed) ? SIDE_BAR_MINI_WIDTH : SIDE_BAR_SHOW_TIT_MINI_WIDTH;
  });

  const getDomStyle = computed((): CSSProperties => {
    const fixedWidth = unref(getIsFixed) ? unref(getRealWidth) : 0;
    const width = `${unref(getMixSideWidth) + fixedWidth}px`;
    return getWrapCommonStyle(width);
  });

  const getWrapStyle = computed((): CSSProperties => {
    const width = `${unref(getMixSideWidth)}px`;
    return getWrapCommonStyle(width);
  });

  const getMenuEvents = computed(() => {
    return !unref(getMixSideFixed)
      ? {
          onMouseleave: () => {
            setActive(true);
            closeMenu();
          },
        }
      : {};
  });

  const getShowDragBar = computed(() => unref(getCanDrag));

  onMounted(async () => {
    menuModules.value = await getShallowMenus();
  });

  // Menu changes
  watch(
    [() => permissionStore.getLastBuildMenuTime, () => permissionStore.getBackMenuList],
    async () => {
      menuModules.value = await getShallowMenus();
    },
    {
      immediate: true,
    },
  );

  listenerRouteChange((route) => {
    currentRoute.value = route;
    setActive(true);
    if (unref(getCloseMixSidebarOnChange)) {
      closeMenu();
    }
  });

  function getWrapCommonStyle(width: string): CSSProperties {
    return {
      width,
      maxWidth: width,
      minWidth: width,
      flex: `0 0 ${width}`,
    };
  }

  // Process module menu click
  async function handleModuleClick(path: string, hover = false) {
    const children = await getChildrenMenus(path);
    if (unref(activePath) === path) {
      if (!hover) {
        if (!unref(openMenu)) {
          openMenu.value = true;
        } else {
          closeMenu();
        }
      } else {
        if (!unref(openMenu)) {
          openMenu.value = true;
        }
      }
      if (!unref(openMenu)) {
        setActive();
      }
    } else {
      openMenu.value = true;
      activePath.value = path;
    }

    if (!children || children.length === 0) {
      if (!hover) go(path);
      childrenMenus.value = [];
      closeMenu();
      return;
    }
    childrenMenus.value = children;
  }

  // Set the currently active menu and submenu
  async function setActive(setChildren = false) {
    const path = currentRoute.value?.path;
    if (!path) return;
    activePath.value = await getCurrentParentPath(path);
    // hanldeModuleClick(parentPath);
    if (unref(getIsMixSidebar)) {
      const activeMenu = unref(menuModules).find((item) => item.path === unref(activePath));
      const p = activeMenu?.path;
      if (p) {
        const children = await getChildrenMenus(p);
        if (setChildren) {
          childrenMenus.value = children;

          if (unref(getMixSideFixed)) {
            openMenu.value = children.length > 0;
          }
        }
        if (children.length === 0) {
          childrenMenus.value = [];
        }
      }
    }
  }

  function handleMenuClick(path: string) {
    go(path);
  }

  function handleClickOutside() {
    setActive(true);
    closeMenu();
  }

  function getItemEvents(item: Menu) {
    if (unref(getMixSideTrigger) === 'hover') {
      return {
        onMouseenter: () => handleModuleClick(item.path, true),
        onClick: async () => {
          const children = await getChildrenMenus(item.path);
          if (item.path && (!children || children.length === 0)) go(item.path);
        },
      };
    }
    return {
      onClick: () => handleModuleClick(item.path),
    };
  }

  function handleFixedMenu() {
    setMenuSetting({
      mixSideFixed: !unref(getIsFixed),
    });
  }

  // Close menu
  function closeMenu() {
    if (!unref(getIsFixed)) {
      openMenu.value = false;
    }
  }
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-layout-mix-sider';
  @width: 80px;
  .@{prefix-cls} {
    position: fixed;
    z-index: @layout-mix-sider-fixed-z-index;
    top: 0;
    left: 0;
    height: 100%;
    overflow: hidden;
    transition: all 0.2s ease 0s;
    background-color: @sider-dark-bg-color;

    &-dom {
      height: 100%;
      overflow: hidden;
      transition: all 0.2s ease 0s;
    }

    &-logo {
      display: flex;
      justify-content: center;
      height: @header-height;
      padding-left: 0 !important;

      img {
        width: @logo-width;
        height: @logo-width;
      }
    }

    &.light {
      .@{prefix-cls}-logo {
        border-bottom: 1px solid rgb(238 238 238);
      }

      &.open {
        > .scrollbar {
          border-right: 1px solid rgb(238 238 238);
        }
      }

      .@{prefix-cls}-module {
        &__item {
          color: rgb(0 0 0 / 65%);
          font-weight: normal;

          &--active {
            background-color: unset;
            color: @primary-color;
          }

          &:not(&--active):hover {
            background-color: rgb(0 0 0 / 6%);
          }
        }
      }
      .@{prefix-cls}-menu-list {
        &__content {
          box-shadow: 0 0 4px 0 rgb(0 0 0 / 10%);
        }

        &__title {
          .pushpin {
            color: rgb(0 0 0 / 35%);

            &:hover {
              color: rgb(0 0 0 / 85%);
            }
          }
        }
      }
    }
    @border-color: @sider-dark-lighten-bg-color;

    &.dark {
      &.open {
        // .@{prefix-cls}-logo {
        //   border-bottom: 1px solid @border-color;
        // }

        > .scrollbar {
          border-right: 1px solid @border-color;
        }
      }
      .@{prefix-cls}-menu-list {
        background-color: @sider-dark-bg-color;

        &__title {
          border-bottom: none;
          border-bottom: 1px solid @border-color;
          color: @white;
        }
      }
    }

    > .scrollbar {
      height: calc(100% - @header-height - 38px);
    }

    &.mini &-module {
      &__name {
        display: none;
      }

      &__icon {
        margin-bottom: 0;
      }
    }

    &-module {
      position: relative;
      padding-top: 1px;

      &__item {
        position: relative;
        padding: 12px 0;
        transition: all 0.3s ease;
        color: rgb(255 255 255 / 65%);
        text-align: center;
        cursor: pointer;

        &:hover {
          color: @white;
        }
        // &:hover,
        &--active {
          background-color: @sider-dark-darken-bg-color;
          color: @white;
          font-weight: 700;

          &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 3px;
            height: 100%;
            background-color: @primary-color;
          }
        }
      }

      &__icon {
        margin-bottom: 8px;
        transition: all 0.2s;
        font-size: 24px;
      }

      &__name {
        margin-bottom: 0;
        transition: all 0.2s;
        font-size: 12px;
      }
    }

    &-trigger {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 36px;
      background-color: @trigger-dark-bg-color;
      color: rgb(255 255 255 / 65%);
      font-size: 14px;
      line-height: 36px;
      text-align: center;
      cursor: pointer;
    }

    &.light &-trigger {
      border-top: 1px solid #eee;
      background-color: #fff;
      color: rgb(0 0 0 / 65%);
    }

    &-menu-list {
      position: fixed;
      top: 0;
      width: 200px;
      height: calc(100%);
      transition: all 0.2s;
      background-color: #fff;

      &__title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: @header-height;
        transition: unset;
        border-bottom: 1px solid rgb(238 238 238);
        opacity: 0;
        color: @primary-color;
        // margin-left: -6px;
        font-size: 18px;

        &.show {
          min-width: 130px;
          transition: all 0.5s ease;
          opacity: 1;
        }

        .pushpin {
          margin-right: 6px;
          color: rgb(255 255 255 / 65%);
          cursor: pointer;

          &:hover {
            color: #fff;
          }
        }
      }

      &__content {
        height: calc(100% - @header-height) !important;

        .scrollbar__wrap {
          height: 100%;
          overflow-x: hidden;
        }

        .scrollbar__bar.is-horizontal {
          display: none;
        }

        .ant-menu {
          height: 100%;
        }

        .ant-menu-inline,
        .ant-menu-vertical,
        .ant-menu-vertical-left {
          border-right: 1px solid transparent;
        }
      }
    }

    &-drag-bar {
      position: absolute;
      top: 50px;
      right: -1px;
      width: 1px;
      height: calc(100% - 50px);
      border-top: none;
      border-bottom: none;
      background-color: #f8f8f9;
      box-shadow: 0 0 4px 0 rgb(28 36 56 / 15%);
      cursor: ew-resize;
    }
  }
</style>
