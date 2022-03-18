<template>
  <Header :class="getHeaderClass">
    <!-- left start -->
    <div :class="`${prefixCls}-left`">
      <!-- logo -->
      <AppLogo
        v-if="getShowHeaderLogo || getIsMobile"
        :class="`${prefixCls}-logo`"
        :theme="getHeaderTheme"
        :style="getLogoWidth"
      />
      <LayoutTrigger
        v-if="
          (getShowContent &&
            getShowHeaderTrigger &&
            !getSplit &&
            !getIsMixSidebar) ||
          getIsMobile
        "
        :theme="getHeaderTheme"
        :sider="false"
      />
      <LayoutBreadcrumb
        v-if="getShowContent && getShowBread"
        :theme="getHeaderTheme"
      />
    </div>
    <!-- left end -->

    <!-- menu start -->
    <div :class="`${prefixCls}-menu`" v-if="getShowTopMenu && !getIsMobile">
      <LayoutMenu
        :isHorizontal="true"
        :theme="getHeaderTheme"
        :splitType="getSplitType"
        :menuMode="getMenuMode"
      />
    </div>
    <!-- menu-end -->

    <!-- action  -->
    <div :class="`${prefixCls}-action`">
      <AppSearch :class="`${prefixCls}-action__item `" v-if="getShowSearch" />

      <Notify
        v-if="getShowNotice"
        :class="`${prefixCls}-action__item notify-item`"
      />

      <FullScreen
        v-if="getShowFullScreen"
        :class="`${prefixCls}-action__item fullscreen-item`"
      />

      <AppLocalePicker
        v-if="showLocalePicker"
        :reload="true"
        :showText="false"
        :class="`${prefixCls}-action__item`"
      />

      <UserDropDown :theme="getHeaderTheme" />

      <SettingDrawer
        v-if="getShowSetting"
        :class="`${prefixCls}-action__item`"
      />
    </div>
  </Header>
</template>
<script lang="ts">
import { defineComponent, unref, computed } from 'vue'
import { Layout } from 'ant-design-vue'
import { AppLogo } from '@/components/application'
import LayoutMenu from '../menu/index.vue'
import LayoutTrigger from '../trigger/index.vue'
import { AppSearch } from '@/components/application'
import { useHeaderSetting } from '@/hooks/setting/useHeaderSetting'
import { useMenuSetting } from '@/hooks/setting/useMenuSetting'
import { useRootSetting } from '@/hooks/setting/useRootSetting'
import {
  MenuModeEnum,
  MenuSplitTyeEnum,
  SettingButtonPositionEnum,
} from '@pkg/tokens'
import { AppLocalePicker } from '@/components/application'
import {
  UserDropDown,
  LayoutBreadcrumb,
  FullScreen,
  Notify,
} from './components'
import { useAppInject } from '@/hooks/web/use-app-inject'
import { useDesign } from '@/hooks/web/useDesign'
import { useLocale } from '@pkg/locale'
import SettingDrawer from '@/layouts/default/setting/index.vue'

export default defineComponent({
  name: 'LayoutHeader',
  components: {
    Header: Layout.Header,
    AppLogo,
    LayoutTrigger,
    LayoutBreadcrumb,
    LayoutMenu,
    UserDropDown,
    AppLocalePicker,
    FullScreen,
    Notify,
    AppSearch,
    SettingDrawer,
  },
  props: {
    fixed: { type: Boolean },
  },
  setup(props) {
    const { prefixCls } = useDesign('layout-header')
    const {
      getShowTopMenu,
      getShowHeaderTrigger,
      getSplit,
      getIsMixMode,
      getMenuWidth,
      getIsMixSidebar,
    } = useMenuSetting()
    const { getShowSettingButton, getSettingButtonPosition } = useRootSetting()

    const {
      getHeaderTheme,
      getShowFullScreen,
      getShowNotice,
      getShowContent,
      getShowBread,
      getShowHeaderLogo,
      getShowHeader,
      getShowSearch,
    } = useHeaderSetting()

    const { showLocalePicker } = useLocale()

    const { getIsMobile } = useAppInject()

    const getHeaderClass = computed(() => {
      const theme = unref(getHeaderTheme)
      return [
        prefixCls,
        {
          [`${prefixCls}--fixed`]: props.fixed,
          [`${prefixCls}--mobile`]: unref(getIsMobile),
          [`${prefixCls}--${theme}`]: theme,
        },
      ]
    })

    const getShowSetting = computed(() => {
      if (!unref(getShowSettingButton)) {
        return false
      }
      const settingButtonPosition = unref(getSettingButtonPosition)

      if (settingButtonPosition === SettingButtonPositionEnum.AUTO) {
        return unref(getShowHeader)
      }
      return settingButtonPosition === SettingButtonPositionEnum.HEADER
    })

    const getLogoWidth = computed(() => {
      if (!unref(getIsMixMode) || unref(getIsMobile)) {
        return {}
      }
      const width = unref(getMenuWidth) < 180 ? 180 : unref(getMenuWidth)
      return { width: `${width}px` }
    })

    const getSplitType = computed(() => {
      return unref(getSplit) ? MenuSplitTyeEnum.TOP : MenuSplitTyeEnum.NONE
    })

    const getMenuMode = computed(() => {
      return unref(getSplit) ? MenuModeEnum.HORIZONTAL : null
    })

    return {
      prefixCls,
      getHeaderClass,
      getShowHeaderLogo,
      getHeaderTheme,
      getShowHeaderTrigger,
      getIsMobile,
      getShowBread,
      getShowContent,
      getSplitType,
      getSplit,
      getMenuMode,
      getShowTopMenu,
      showLocalePicker,
      getShowFullScreen,
      getShowNotice,
      getLogoWidth,
      getIsMixSidebar,
      getShowSettingButton,
      getShowSetting,
      getShowSearch,
    }
  },
})
</script>
<style lang="less">
@import './index.less';
</style>
