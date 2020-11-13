import { defineComponent, unref, computed, ref } from 'vue';

import { Layout, Tooltip, Badge } from 'ant-design-vue';
import Logo from '/@/layouts/logo/index.vue';
import UserDropdown from './UserDropdown';
import LayoutMenu from '/@/layouts/default/menu/LayoutMenu';
import LayoutBreadcrumb from './LayoutBreadcrumb';
import LockAction from './LockActionItem';
import LayoutTrigger from '../LayoutTrigger';
import NoticeAction from './notice/NoticeActionItem.vue';
import {
  RedoOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined,
  GithubFilled,
  LockOutlined,
  BugOutlined,
} from '@ant-design/icons-vue';

import { useFullscreen } from '/@/hooks/web/useFullScreen';
import { useTabs } from '/@/hooks/web/useTabs';
import { useWindowSizeFn } from '/@/hooks/event/useWindowSizeFn';
import { useRouter } from 'vue-router';
import { useModal } from '/@/components/Modal';

import { appStore } from '/@/store/modules/app';
import { errorStore } from '/@/store/modules/error';

import { MenuModeEnum, MenuSplitTyeEnum, MenuTypeEnum, TriggerEnum } from '/@/enums/menuEnum';
import { GITHUB_URL } from '/@/settings/siteSetting';

import './index.less';
export default defineComponent({
  name: 'DefaultLayoutHeader',
  setup() {
    const widthRef = ref(200);
    let logoEl: Element | null;

    const { refreshPage } = useTabs();
    const { push } = useRouter();
    const [register, { openModal }] = useModal();
    const { toggleFullscreen, isFullscreenRef } = useFullscreen();

    const getProjectConfigRef = computed(() => {
      return appStore.getProjectConfig;
    });

    const showTopMenu = computed(() => {
      const getProjectConfig = unref(getProjectConfigRef);
      const {
        menuSetting: { mode, split: splitMenu },
      } = getProjectConfig;
      return mode === MenuModeEnum.HORIZONTAL || splitMenu;
    });

    useWindowSizeFn(
      () => {
        if (!unref(showTopMenu)) return;
        let width = 0;
        if (!logoEl) {
          logoEl = document.querySelector('.layout-header__logo');
        }
        if (logoEl) {
          width += logoEl.clientWidth;
        }
        widthRef.value = width + 60;
      },
      200,
      { immediate: true }
    );

    function goToGithub() {
      window.open(GITHUB_URL, '__blank');
    }

    const headerClass = computed(() => {
      const theme = unref(getProjectConfigRef).headerSetting.theme;
      return theme ? `layout-header__header--${theme}` : '';
    });

    const showHeaderTrigger = computed(() => {
      const { show, trigger, hidden, type } = unref(getProjectConfigRef).menuSetting;
      if (type === MenuTypeEnum.TOP_MENU || !show || !hidden) return false;
      return trigger === TriggerEnum.HEADER;
    });

    function handleToErrorList() {
      errorStore.commitErrorListCountState(0);
      push('/exception/error-log');
    }

    /**
     * @description: 锁定屏幕
     */
    function handleLockPage() {
      openModal(true);
    }

    return () => {
      const getProjectConfig = unref(getProjectConfigRef);
      const {
        useErrorHandle,
        showLogo,
        multiTabsSetting: { show: showTab },
        headerSetting: {
          theme: headerTheme,
          useLockPage,
          showRedo,
          showGithub,
          showFullScreen,
          showNotice,
        },
        menuSetting: { mode, type: menuType, split: splitMenu, topMenuAlign },
        showBreadCrumb,
        showBreadCrumbIcon,
      } = getProjectConfig;

      const isSidebarType = menuType === MenuTypeEnum.SIDEBAR;

      const width = unref(widthRef);

      return (
        <Layout.Header class={['layout-header', 'flex p-0 px-4 ', unref(headerClass)]}>
          {() => (
            <>
              <div class="layout-header__content ">
                {showLogo && !isSidebarType && (
                  <Logo class={`layout-header__logo`} theme={headerTheme} />
                )}

                <div class="layout-header__left">
                  {unref(showHeaderTrigger) && <LayoutTrigger theme={headerTheme} sider={false} />}
                  {mode !== MenuModeEnum.HORIZONTAL && showBreadCrumb && !splitMenu && (
                    <LayoutBreadcrumb showIcon={showBreadCrumbIcon} />
                  )}
                </div>

                {unref(showTopMenu) && (
                  <div
                    class={[`layout-header__menu `]}
                    style={{ width: `calc(100% - ${unref(width)}px)` }}
                  >
                    <LayoutMenu
                      isTop={true}
                      class={`justify-${topMenuAlign}`}
                      theme={headerTheme}
                      splitType={splitMenu ? MenuSplitTyeEnum.TOP : MenuSplitTyeEnum.NONE}
                      menuMode={splitMenu ? MenuModeEnum.HORIZONTAL : null}
                      showSearch={false}
                    />
                  </div>
                )}
              </div>

              <div class={`layout-header__action`}>
                {useErrorHandle && (
                  <Tooltip>
                    {{
                      title: () => '错误日志',
                      default: () => (
                        <Badge
                          count={errorStore.getErrorListCountState}
                          offset={[0, 10]}
                          dot
                          overflowCount={99}
                        >
                          {() => (
                            <div class={`layout-header__action-item`} onClick={handleToErrorList}>
                              <BugOutlined class={`layout-header__action-icon`} />
                            </div>
                          )}
                        </Badge>
                      ),
                    }}
                  </Tooltip>
                )}

                {showGithub && (
                  <Tooltip>
                    {{
                      title: () => 'github',
                      default: () => (
                        <div class={`layout-header__action-item`} onClick={goToGithub}>
                          <GithubFilled class={`layout-header__action-icon`} />
                        </div>
                      ),
                    }}
                  </Tooltip>
                )}
                {useLockPage && (
                  <Tooltip>
                    {{
                      title: () => '锁定屏幕',
                      default: () => (
                        <div class={`layout-header__action-item`} onClick={handleLockPage}>
                          <LockOutlined class={`layout-header__action-icon`} />
                        </div>
                      ),
                    }}
                  </Tooltip>
                )}
                {showNotice && (
                  <div>
                    <Tooltip>
                      {{
                        title: () => '消息通知',
                        default: () => <NoticeAction />,
                      }}
                    </Tooltip>
                  </div>
                )}
                {showRedo && showTab && (
                  <Tooltip>
                    {{
                      title: () => '刷新',
                      default: () => (
                        <div class={`layout-header__action-item`} onClick={refreshPage}>
                          <RedoOutlined class={`layout-header__action-icon`} />
                        </div>
                      ),
                    }}
                  </Tooltip>
                )}
                {showFullScreen && (
                  <Tooltip>
                    {{
                      title: () => (unref(isFullscreenRef) ? '退出全屏' : '全屏'),
                      default: () => {
                        const Icon: any = !unref(isFullscreenRef) ? (
                          <FullscreenOutlined />
                        ) : (
                          <FullscreenExitOutlined />
                        );
                        return (
                          <div class={`layout-header__action-item`} onClick={toggleFullscreen}>
                            <Icon class={`layout-header__action-icon`} />
                          </div>
                        );
                      },
                    }}
                  </Tooltip>
                )}
                <UserDropdown class={`layout-header__user-dropdown`} />
              </div>
              <LockAction onRegister={register} />
            </>
          )}
        </Layout.Header>
      );
    };
  },
});
