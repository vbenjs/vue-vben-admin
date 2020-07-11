<script lang="tsx">
  import { defineComponent, unref, computed } from 'compatible-vue';
  import { Layout, Tooltip } from 'ant-design-vue';
  import { Icon } from '@/components/icon/index';
  import UserDropdown from './UserDropdown.vue';
  import Logo from '@/layouts/Logo.vue';
  import LockAction from './actions/lockAction.vue';
  import { useModal } from '@/components/modal/index';

  import LayoutMenu from './LayoutMenu.vue';
  import { appStore } from '@/store/modules/app';
  import { MenuModeEnum, MenuTypeEnum } from '@/enums/menuEnum';

  // hooks
  import { useDesign } from '@/hooks/core/useDesign';
  import { useTabs } from '@/hooks/functions/useTabs';
  import { useFullscreen } from '@/hooks/event/useFullScreen';

  export default defineComponent({
    name: 'DefaultLayoutHeader',
    setup() {
      const { prefixCls } = useDesign('layout-header');
      const { toggleFullscreen, isFullscreenRef } = useFullscreen();

      const [register, { isFirstLoadRef, openModal }] = useModal();
      const { refreshPage } = useTabs();
      const headerClass = computed(() => {
        const theme = appStore.projCfgState!.headerSetting.theme;
        return theme ? `${prefixCls}__header--${theme}` : '';
      });

      /**
       * @description: 锁定屏幕
       */
      function handleLockPage() {
        openModal({
          visible: true,
        });
      }
      return () => {
        const { getProjCfg } = appStore;
        const {
          showLogo,
          headerSetting: { theme: headerTheme } = {},
          menuSetting: { mode, type: menuType } = {},
        } = getProjCfg;
        const isSidebarType = menuType !== MenuTypeEnum.SIDEBAR;

        return (
          <Layout.Header class={[prefixCls, unref(headerClass)]}>
            {
              // <div class={`${prefixCls}-lm`}>
            }
            {showLogo && isSidebarType ? (
              <Logo class={`${prefixCls}__logo`} />
            ) : (
              <span>&nbsp;</span>
            )}

            {mode === MenuModeEnum.HORIZONTAL && (
              <div class={`${prefixCls}__menu`}>
                <LayoutMenu theme={headerTheme} />
              </div>
            )}
            {
              // </div>
            }
            <div class={`${prefixCls}__action`}>
              <Tooltip>
                <template slot="title">刷新</template>
                <div class={`${prefixCls}__action-item`} onClick={refreshPage}>
                  <Icon type="redo" class={`${prefixCls}__action-icon`} />
                </div>
              </Tooltip>

              <Tooltip>
                <template slot="title">锁定屏幕</template>
                <div class={`${prefixCls}__action-item`} onClick={handleLockPage}>
                  <Icon type="lock" class={`${prefixCls}__action-icon`} />
                </div>
              </Tooltip>

              <Tooltip>
                <template slot="title">{unref(isFullscreenRef) ? '退出全屏' : '全屏'}</template>
                <div class={`${prefixCls}__action-item`} onClick={toggleFullscreen}>
                  <Icon
                    type={!unref(isFullscreenRef) ? 'fullscreen' : 'fullscreen-exit'}
                    class={`${prefixCls}__action-icon`}
                  />
                </div>
              </Tooltip>

              <UserDropdown class={`${prefixCls}__user-dropdown`} />
            </div>
            {!unref(isFirstLoadRef) && <LockAction onRegister={register} />}
          </Layout.Header>
        );
      };
    },
  });
</script>
<style lang="less">
  @import './layout-header.less';
</style>
