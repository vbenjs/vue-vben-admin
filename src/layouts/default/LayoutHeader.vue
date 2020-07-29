<script lang="tsx">
  import { defineComponent, unref, computed } from 'compatible-vue';
  import { Layout, Tooltip, Badge } from 'ant-design-vue';
  import { Icon } from '@/components/icon/index';
  import UserDropdown from './UserDropdown.vue';
  import Logo from '@/layouts/Logo.vue';
  import LayoutBread from './LayoutBread.vue';

  import LockAction from './actions/LockAction.vue';
  import GithubModal from './actions/GithubModal.vue';
  import { useModal } from '@/components/modal/index';

  import LayoutMenu from './LayoutMenu.vue';
  import { appStore } from '@/store/modules/app';
  import { errorStore } from '@/store/modules/error';
  import { MenuModeEnum, MenuTypeEnum } from '@/enums/menuEnum';

  // hooks
  import { useDesign } from '@/hooks/core/useDesign';
  import { useTabs } from '@/hooks/functions/useTabs';
  import { useFullscreen } from '@/hooks/event/useFullScreen';

  export default defineComponent({
    name: 'DefaultLayoutHeader',
    setup(_, { root }) {
      const { prefixCls } = useDesign('layout-header');
      const { toggleFullscreen, isFullscreenRef } = useFullscreen();

      const [register, { isFirstLoadRef, openModal }] = useModal();
      const [
        registerGithubModal,
        { isFirstLoadRef: isFirstLoadGithubModalRef, openModal: openGithubModal },
      ] = useModal();
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
      function handleHelp() {
        openGithubModal({
          visible: true,
        });
      }
      function handleToErrorList() {
        errorStore.commitErrorListCountState(0);
        root.$router.push('/error-log/index');
      }
      return () => {
        const { getProjCfg } = appStore;
        const {
          useErrorHandle,
          showGithubButton,
          showLogo,
          headerSetting: { theme: headerTheme } = {},
          menuSetting: { mode, type: menuType } = {},
          showBreadCrumb,
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
            {mode !== MenuModeEnum.HORIZONTAL && showBreadCrumb && (
              <LayoutBread class={`${prefixCls}__bread`} />
            )}
            <div class={`${prefixCls}__action`}>
              {useErrorHandle && (
                <Tooltip>
                  <template slot="title">错误日志</template>
                  <Badge
                    count={errorStore.getErrorListCountState}
                    offset={[0, 10]}
                    overflowCount={99}
                  >
                    <div class={`${prefixCls}__action-item`} onClick={handleToErrorList}>
                      <Icon type="bug" class={`${prefixCls}__action-icon`} />
                    </div>
                  </Badge>
                </Tooltip>
              )}

              {showGithubButton && (
                <Tooltip>
                  <template slot="title">帮助</template>
                  <div
                    class={`${prefixCls}__action-item`}
                    onClick={handleHelp}
                    id="elem-driver-action-github"
                  >
                    <Icon type="github" class={`${prefixCls}__action-icon`} />
                  </div>
                </Tooltip>
              )}

              <Tooltip>
                <template slot="title">刷新</template>
                <div
                  class={`${prefixCls}__action-item`}
                  onClick={refreshPage}
                  id="elem-driver-action-refresh"
                >
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
            {!unref(isFirstLoadGithubModalRef) && <GithubModal onRegister={registerGithubModal} />}
          </Layout.Header>
        );
      };
    },
  });
</script>
<style lang="less">
  @import './layout-header.less';
</style>
