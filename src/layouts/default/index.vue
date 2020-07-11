<script lang="tsx">
  import { defineComponent, unref } from 'compatible-vue';
  import { Layout } from 'ant-design-vue';
  import LayoutHeader from './LayoutHeader.vue';
  import LayoutSideBar from './LayoutSideBar.vue';
  import LayoutContent from './LayoutContent.vue';
  import MultiTabs from './multitabs/index.vue';
  import SettingButton from './setting/index.vue';
  import { FullLoading } from '@/components/loading/index';

  // utils

  // hook
  import { useFullContent } from '@/hooks/functions/useFullContent';
  import { useDesign } from '@/hooks/core/useDesign';

  // import { userStore } from '@/store/modules/user';
  // import watermark from '@/common/plugins/watermark';
  import { appStore } from '@/store/modules/app';
  import { MenuModeEnum, MenuTypeEnum } from '@/enums/menuEnum';

  // 解决icon按需引入不生效问题
  // import { dictStore } from '@/store/modules/dict';
  export default defineComponent({
    name: 'DefaultLayout',
    setup() {
      // const info = userStore.getUserInfoState;
      const { prefixCls } = useDesign('default-layout');

      // if (info) {
      //   watermark.set!('vben admin');
      // }

      // 获取项目配置
      const { getFullContent } = useFullContent();
      return () => {
        const { getProjCfg, getPageLoading } = appStore;
        const {
          headerSetting: { show: showHeader } = {},
          menuSetting: { show: showMenu, mode: menuMode, type: menuType } = {},
          multiTabsSetting: { show: showTabs } = {},
        } = getProjCfg;

        const isShowHeader = !unref(getFullContent) && showHeader;
        const isShowMixHeader = isShowHeader && menuType !== MenuTypeEnum.SIDEBAR;
        return (
          <Layout class={prefixCls}>
            {isShowMixHeader && <LayoutHeader />}
            <SettingButton class={`${prefixCls}__setting-btn`} />
            <Layout>
              {!unref(getFullContent) && showMenu && menuMode !== MenuModeEnum.HORIZONTAL && (
                <LayoutSideBar />
              )}
              <Layout class={`${prefixCls}__content`}>
                {!isShowMixHeader && <LayoutHeader />}

                {showTabs && !unref(getFullContent) ? (
                  <Layout.Header class={`${prefixCls}__tabs`}>
                    <MultiTabs />
                  </Layout.Header>
                ) : null}
                <div class={`${prefixCls}__main`}>
                  <FullLoading
                    v-show={getPageLoading}
                    class={`${prefixCls}__loading`}
                    tip="加载中..."
                  />
                  <LayoutContent />
                </div>
              </Layout>
            </Layout>
          </Layout>
        );
      };
    },
  });
</script>
<style lang="less" scoped>
  @import (reference) '~@design';
  @prefix-cls: ~'@{namespace}-default-layout';

  .@{prefix-cls} {
    &__content {
      position: relative;
    }

    &__main {
      position: relative;
    }

    &__loading {
      position: absolute;
      z-index: 10000;
    }

    &__tabs {
      height: 40px;
      padding: 0;
      line-height: 40px;
      background: @border-color-shallow-light;
    }

    &__setting-btn {
      position: absolute;
      top: 45%;
      right: 0;
      z-index: 2;
    }
  }
</style>
