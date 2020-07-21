<script lang="tsx">
  import { defineComponent, unref, onMounted, ref, watch } from 'compatible-vue';
  import { Layout } from 'ant-design-vue';
  import LayoutHeader from './LayoutHeader.vue';
  import LayoutSideBar from './LayoutSideBar.vue';
  import LayoutContent from './LayoutContent.vue';
  import MultiTabs from './multitabs/index.vue';
  import SettingButton from './setting/index.vue';
  import { FullLoading } from '@/components/loading/index';
  import { ScrollContainer } from '@/components/container/index';

  // utils

  // hook
  import { useFullContent } from '@/hooks/functions/useFullContent';
  import { useDesign } from '@/hooks/core/useDesign';
  import { useRouter } from '@/hooks/core/useRouter';

  import { userStore } from '@/store/modules/user';
  import { appStore } from '@/store/modules/app';
  import { MenuModeEnum, MenuTypeEnum } from '@/enums/menuEnum';

  export default defineComponent({
    name: 'DefaultLayout',
    setup() {
      const { prefixCls } = useDesign('default-layout');
      const scrollRef = ref<any>(null);
      const { routeRef } = useRouter();
      watch(
        () => unref(routeRef).path,
        () => {
          const scroll = unref(scrollRef);
          if (scroll) {
            scroll.scrollTo(0, 16);
          }
        }
      );

      onMounted(() => {
        // 每次刷新会去请求最新用户信息,如果不需要可以删除
        userStore.getUserInfoAction({ userId: userStore.getUserInfoState.userId });
      });

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
            <SettingButton class={`${prefixCls}__setting-btn`} id="elem-driver-setting-btn" />
            <Layout>
              {!unref(getFullContent) && showMenu && menuMode !== MenuModeEnum.HORIZONTAL && (
                <LayoutSideBar />
              )}
              <Layout class={`${prefixCls}__content`}>
                {!isShowMixHeader && !unref(getFullContent) && <LayoutHeader />}

                {showTabs && !unref(getFullContent) ? (
                  <Layout.Header class={`${prefixCls}__tabs`}>
                    <MultiTabs />
                  </Layout.Header>
                ) : null}
                <div class={`${prefixCls}__main`}>
                  <FullLoading v-show={getPageLoading} class={`${prefixCls}__loading`} />
                  <ScrollContainer ref={scrollRef}>
                    <LayoutContent />
                  </ScrollContainer>
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
    position: relative;

    &__content {
      position: relative;
    }

    &__main {
      position: relative;
      height: 100%;
      overflow: hidden;
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
