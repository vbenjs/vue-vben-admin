<template>
  <slot name="header" v-if="!getIsHorizontal" />
  <ScrollContainer :class="`${prefixCls}-wrapper`" :style="getWrapperStyle">
    <Menu
      :selectedKeys="selectedKeys"
      :defaultSelectedKeys="defaultSelectedKeys"
      :mode="mode"
      :openKeys="getOpenKeys"
      :inlineIndent="inlineIndent"
      :theme="theme"
      @openChange="handleOpenChange"
      :class="getMenuClass"
      @click="handleMenuClick"
      :subMenuOpenDelay="0.2"
      v-bind="getInlineCollapseOptions"
    >
      <template v-for="item in items" :key="item.path">
        <BasicSubMenuItem
          :item="item"
          :theme="theme"
          :level="1"
          :appendClass="appendClass"
          :parentPath="currentParentPath"
          :showTitle="showTitle"
          :isHorizontal="isHorizontal"
        />
      </template>
    </Menu>
  </ScrollContainer>
</template>
<script lang="ts">
  import type { MenuState } from './types';

  import {
    computed,
    defineComponent,
    unref,
    reactive,
    watch,
    toRefs,
    ref,
    CSSProperties,
  } from 'vue';
  import { Menu } from 'ant-design-vue';
  import BasicSubMenuItem from './components/BasicSubMenuItem.vue';
  import { ScrollContainer } from '/@/components/Container';

  import { MenuModeEnum, MenuTypeEnum } from '/@/enums/menuEnum';

  import { appStore } from '/@/store/modules/app';

  import { useOpenKeys } from './useOpenKeys';
  import { useRouter } from 'vue-router';

  import { isFunction } from '/@/utils/is';
  import { getCurrentParentPath } from '/@/router/menus';

  import { basicProps } from './props';
  import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
  import { REDIRECT_NAME } from '/@/router/constant';
  import { tabStore } from '/@/store/modules/tab';
  import { useDesign } from '/@/hooks/web/useDesign';
  // import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';

  export default defineComponent({
    name: 'BasicMenu',
    components: {
      Menu,
      ScrollContainer,
      BasicSubMenuItem,
      // BasicSubMenuItem: createAsyncComponent(() => import('./components/BasicSubMenuItem.vue')),
    },
    props: basicProps,
    emits: ['menuClick'],
    setup(props, { emit }) {
      const currentParentPath = ref('');
      const isClickGo = ref(false);

      const menuState = reactive<MenuState>({
        defaultSelectedKeys: [],
        openKeys: [],
        selectedKeys: [],
        collapsedOpenKeys: [],
      });

      const { prefixCls } = useDesign('basic-menu');
      const { items, mode, accordion } = toRefs(props);

      const { getCollapsed, getIsHorizontal, getTopMenuAlign, getSplit } = useMenuSetting();

      const { currentRoute } = useRouter();

      const { handleOpenChange, setOpenKeys, getOpenKeys } = useOpenKeys(
        menuState,
        items,
        mode,
        accordion
      );

      const getMenuClass = computed(() => {
        const { type, mode } = props;
        return [
          prefixCls,
          `justify-${unref(getTopMenuAlign)}`,
          {
            [`${prefixCls}--hide-title`]: !unref(showTitle),
            [`${prefixCls}--collapsed-show-title`]: props.collapsedShowTitle,
            [`${prefixCls}__second`]:
              !props.isHorizontal && appStore.getProjectConfig.menuSetting.split,
            [`${prefixCls}__sidebar-hor`]:
              type === MenuTypeEnum.TOP_MENU && mode === MenuModeEnum.HORIZONTAL,
          },
        ];
      });

      const showTitle = computed(() => props.collapsedShowTitle && unref(getCollapsed));

      const getInlineCollapseOptions = computed(() => {
        const isInline = props.mode === MenuModeEnum.INLINE;

        const inlineCollapseOptions: { inlineCollapsed?: boolean } = {};
        if (isInline) {
          inlineCollapseOptions.inlineCollapsed = unref(getCollapsed);
        }
        return inlineCollapseOptions;
      });

      const getWrapperStyle = computed(
        (): CSSProperties => {
          return {
            height: `calc(100% - ${props.showLogo ? '48px' : '0px'})`,
            overflowY: 'hidden',
          };
        }
      );

      watch(
        () => tabStore.getCurrentTab,
        () => {
          if (unref(currentRoute).name === REDIRECT_NAME) return;
          handleMenuChange();
          unref(getSplit) && getParentPath();
        }
      );

      watch(
        () => props.items,
        () => {
          handleMenuChange();
        },
        {
          immediate: true,
        }
      );

      getParentPath();

      async function getParentPath() {
        const { appendClass } = props;
        if (!appendClass) return '';
        const parentPath = await getCurrentParentPath(unref(currentRoute).path);

        currentParentPath.value = parentPath;
      }

      async function handleMenuClick({ key, keyPath }: { key: string; keyPath: string[] }) {
        const { beforeClickFn } = props;
        if (beforeClickFn && isFunction(beforeClickFn)) {
          const flag = await beforeClickFn(key);
          if (!flag) return;
        }
        emit('menuClick', key);

        isClickGo.value = true;
        menuState.openKeys = keyPath;
        menuState.selectedKeys = [key];
      }

      function handleMenuChange() {
        if (unref(isClickGo)) {
          isClickGo.value = false;
          return;
        }
        const path = unref(currentRoute).path;
        if (props.mode !== MenuModeEnum.HORIZONTAL) {
          setOpenKeys(path);
        }
        menuState.selectedKeys = [path];
      }

      return {
        prefixCls,
        getIsHorizontal,
        getWrapperStyle,
        handleMenuClick,
        getInlineCollapseOptions,
        getMenuClass,
        handleOpenChange,
        getOpenKeys,
        currentParentPath,
        showTitle,
        ...toRefs(menuState),
      };
    },
  });
</script>
<style lang="less">
  @import './index.less';
</style>
