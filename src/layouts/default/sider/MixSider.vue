<template>
  <div :class="`${prefixCls}-dom`" />

  <div
    v-click-outside="handleClickOutside"
    :class="[
      prefixCls,
      getMenuTheme,
      {
        open: openMenu,
      },
    ]"
  >
    <AppLogo :showTitle="false" :class="`${prefixCls}-logo`" />
    <ScrollContainer>
      <ul :class="`${prefixCls}-module`">
        <li
          :class="[
            `${prefixCls}-module__item `,
            {
              [`${prefixCls}-module__item--active`]: item.path === activePath,
            },
          ]"
          v-for="item in menuModules"
          :key="item.path"
          @click="hanldeModuleClick(item.path)"
        >
          <MenuTag :item="item" :showTitle="false" :isHorizontal="false" />
          <g-icon
            :class="`${prefixCls}-module__icon`"
            :size="22"
            :icon="item.meta && item.meta.icon"
          />
          <p :class="`${prefixCls}-module__name`">{{ t(item.name) }}</p>
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
      </div>
      <ScrollContainer :class="`${prefixCls}-menu-list__content`">
        <BasicMenu
          :isHorizontal="false"
          mode="inline"
          :items="chilrenMenus"
          :theme="getMenuTheme"
          mixSider
          @menuClick="handleMenuClick"
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
<script lang="ts">
  import { defineComponent, onMounted, ref, computed, CSSProperties, unref } from 'vue';
  import type { Menu } from '/@/router/types';
  import type { RouteLocationNormalized } from 'vue-router';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { getShallowMenus, getChildrenMenus, getCurrentParentPath } from '/@/router/menus';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { ScrollContainer } from '/@/components/Container';
  import { AppLogo } from '/@/components/Application';
  import { useGo } from '/@/hooks/web/usePage';
  import { BasicMenu, MenuTag } from '/@/components/Menu';
  import { listenerLastChangeTab } from '/@/logics/mitt/tabChange';
  import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
  import { useDragLine } from './useLayoutSider';

  import clickOutside from '/@/directives/clickOutside';
  import { useGlobSetting } from '/@/hooks/setting';

  export default defineComponent({
    name: 'LayoutMixSider',
    components: {
      ScrollContainer,
      AppLogo,
      BasicMenu,
      MenuTag,
    },
    directives: {
      clickOutside,
    },
    setup() {
      let menuModules = ref<Menu[]>([]);
      const activePath = ref('');
      const chilrenMenus = ref<Menu[]>([]);
      const openMenu = ref(false);
      const dragBarRef = ref<ElRef>(null);
      const sideRef = ref<ElRef>(null);
      const currentRoute = ref<Nullable<RouteLocationNormalized>>(null);

      const { prefixCls } = useDesign('layout-mix-sider');
      const go = useGo();
      const { t } = useI18n();
      const {
        getMenuWidth,
        getCanDrag,
        getCloseMixSidebarOnChange,
        getMenuTheme,
      } = useMenuSetting();
      const { title } = useGlobSetting();

      useDragLine(sideRef, dragBarRef, true);

      const getMenuStyle = computed(
        (): CSSProperties => {
          return {
            width: unref(openMenu) ? `${unref(getMenuWidth)}px` : 0,
          };
        }
      );

      const getShowDragBar = computed(() => unref(getCanDrag));

      onMounted(async () => {
        menuModules.value = await getShallowMenus();
      });

      listenerLastChangeTab((route) => {
        currentRoute.value = route;
        setActive();
        if (unref(getCloseMixSidebarOnChange)) {
          openMenu.value = false;
        }
      });

      async function hanldeModuleClick(path: string) {
        const children = await getChildrenMenus(path);

        if (unref(activePath) === path) {
          openMenu.value = !unref(openMenu);
          if (!unref(openMenu)) {
            setActive();
          }
        } else {
          openMenu.value = true;
          activePath.value = path;
        }

        if (!children || children.length === 0) {
          go(path);
          chilrenMenus.value = [];
          openMenu.value = false;
          return;
        }
        chilrenMenus.value = children;
      }

      async function setActive() {
        const path = currentRoute.value?.path;
        if (!path) return;
        const parentPath = await getCurrentParentPath(path);
        activePath.value = parentPath;
        // hanldeModuleClick(parentPath);
      }

      function handleMenuClick(path: string) {
        go(path);
      }

      function handleClickOutside() {
        openMenu.value = false;
        setActive();
      }

      return {
        t,
        prefixCls,
        menuModules,
        hanldeModuleClick,
        activePath,
        chilrenMenus,
        getShowDragBar,
        handleMenuClick,
        getMenuStyle,
        handleClickOutside,
        sideRef,
        dragBarRef,
        title,
        openMenu,
        getMenuTheme,
      };
    },
  });
</script>
<style lang="less">
  @import (reference) '../../../design/index.less';
  @prefix-cls: ~'@{namespace}-layout-mix-sider';
  @tag-prefix-cls: ~'@{namespace}-basic-menu-item-tag';
  @width: 80px;
  .@{prefix-cls} {
    position: fixed;
    top: 0;
    left: 0;
    z-index: @layout-mix-sider-fixed-z-index;
    width: @width;
    height: 100%;
    max-width: @width;
    min-width: @width;
    overflow: hidden;
    background: @sider-dark-bg-color;
    transition: all 0.2s ease 0s;
    flex: 0 0 @width;
    .@{tag-prefix-cls} {
      position: absolute;
      top: 6px;
      right: 2px;
    }

    &-dom {
      width: @width;
      height: 100%;
      max-width: @width;
      min-width: @width;
      overflow: hidden;
      transition: all 0.2s ease 0s;
      flex: 0 0 @width;
    }

    &-logo {
      display: flex;
      height: @header-height;
      padding-left: 0 !important;
      justify-content: center;

      img {
        width: @logo-width;
        height: @logo-width;
      }
    }

    &.light {
      .@{prefix-cls}-logo {
        border-bottom: 1px solid rgb(238, 238, 238);
      }

      &.open {
        > .scroll-container {
          border-right: 1px solid rgb(238, 238, 238);
        }
      }

      .@{prefix-cls}-module {
        &__item {
          font-weight: normal;
          color: rgba(0, 0, 0, 0.65);

          &--active {
            color: @primary-color;
            background: unset;
          }
        }
      }
    }
    @border-color: @sider-dark-lighten-1-bg-color;

    &.dark {
      &.open {
        .@{prefix-cls}-logo {
          border-bottom: 1px solid @border-color;
        }

        > .scroll-container {
          border-right: 1px solid @border-color;
        }
      }
      .@{prefix-cls}-menu-list {
        background: @sider-dark-bg-color;

        &__title {
          color: @white;
          border-bottom: none;
          border-bottom: 1px solid @border-color;
        }
      }
    }

    > .scrollbar {
      height: calc(100% - @header-height) !important;
    }

    &-module {
      position: relative;
      padding-top: 1px;

      &__item {
        position: relative;
        padding: 12px 0;
        color: rgba(255, 255, 255, 0.65);
        text-align: center;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          color: @white;
        }
        // &:hover,
        &--active {
          font-weight: 700;
          color: @white;
          background: @sider-dark-darken-bg-color;

          &::before {
            position: absolute;
            top: 0;
            left: 0;
            width: 3px;
            height: 100%;
            background: @primary-color;
            content: '';
          }
        }
      }

      &__icon {
        margin-bottom: 8px;
        font-size: 24px;
      }

      &__name {
        margin-bottom: 0;
        font-size: 12px;
      }
    }

    &-menu-list {
      position: fixed;
      top: 0;
      left: 80px;
      width: 0;
      width: 200px;
      height: calc(100%);
      background: #fff;
      transition: width 0.2s;
      .@{tag-prefix-cls} {
        position: absolute;
        top: 10px;
        right: 30px;
      }

      &__title {
        display: flex;
        height: @header-height;
        margin-left: -6px;
        font-size: 18px;
        color: @primary-color;
        border-bottom: 1px solid rgb(238, 238, 238);
        opacity: 0;
        transition: unset;
        // justify-content: center;
        align-items: center;
        justify-content: start;

        &.show {
          opacity: 1;
          transition: all 0.5s ease;
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
      top: 0;
      right: -3px;
      width: 3px;
      height: 100%;
      cursor: ew-resize;
      background: #f8f8f9;
      border-top: none;
      border-bottom: none;
      box-shadow: 0 0 4px 0 rgba(28, 36, 56, 0.15);
    }
  }
</style>
