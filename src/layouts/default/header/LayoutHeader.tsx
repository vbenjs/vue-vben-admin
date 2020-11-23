import './index.less';

import { defineComponent, unref, computed, ref, nextTick } from 'vue';

import { Layout, Tooltip, Badge } from 'ant-design-vue';
import { AppLogo } from '/@/components/Application';
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
  LockOutlined,
  BugOutlined,
} from '@ant-design/icons-vue';
import { useModal } from '/@/components/Modal';

import { useFullscreen } from '/@/hooks/web/useFullScreen';
import { useTabs } from '/@/hooks/web/useTabs';
import { useWindowSizeFn } from '/@/hooks/event/useWindowSizeFn';
import { useHeaderSetting } from '/@/hooks/setting/useHeaderSetting';
import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
import { useRootSetting } from '/@/hooks/setting/useRootSetting';

import { useRouter } from 'vue-router';

import { errorStore } from '/@/store/modules/error';

import { PageEnum } from '/@/enums/pageEnum';
import { MenuModeEnum, MenuSplitTyeEnum } from '/@/enums/menuEnum';
import { Component } from '/@/components/types';

export default defineComponent({
  name: 'LayoutHeader',
  setup() {
    let logoEl: Element | null;

    const logoWidthRef = ref(200);
    const logoRef = ref<any>(null);
    const { refreshPage } = useTabs();

    const { getShowTopMenu, getShowHeaderTrigger, getSplit, getTopMenuAlign } = useMenuSetting();

    const { getUseErrorHandle, getShowBreadCrumbIcon } = useRootSetting();

    const {
      getTheme,
      getShowRedo,
      getUseLockPage,
      getShowFullScreen,
      getShowNotice,
      getShowContent,
      getShowBread,
      getShowHeaderLogo,
    } = useHeaderSetting();

    const { push } = useRouter();
    const [register, { openModal }] = useModal();
    const { toggleFullscreen, isFullscreenRef } = useFullscreen();

    useWindowSizeFn(
      () => {
        nextTick(() => {
          if (!unref(getShowTopMenu)) return;
          let width = 0;
          if (!logoEl) {
            logoEl = logoRef.value.$el;
          }
          if (logoEl) {
            width += logoEl.clientWidth;
          }
          logoWidthRef.value = width + 80;
        });
      },
      200,
      { immediate: true }
    );

    const headerClass = computed(() => {
      const theme = unref(getTheme);
      return theme ? `layout-header__header--${theme}` : '';
    });

    const getSplitType = computed(() => {
      return unref(getSplit) ? MenuSplitTyeEnum.TOP : MenuSplitTyeEnum.NONE;
    });

    const getMenuMode = computed(() => {
      return unref(getSplit) ? MenuModeEnum.HORIZONTAL : null;
    });

    function handleToErrorList() {
      push(PageEnum.ERROR_LOG_PAGE).then(() => {
        errorStore.commitErrorListCountState(0);
      });
    }

    /**
     * @description: 锁定屏幕
     */
    function handleLockPage() {
      openModal(true);
    }

    function renderHeaderContent() {
      const width = unref(logoWidthRef);
      return (
        <div class="layout-header__content ">
          {unref(getShowHeaderLogo) && (
            <AppLogo class={`layout-header__logo`} ref={logoRef} theme={unref(getTheme)} />
          )}

          {unref(getShowContent) && (
            <div class="layout-header__left">
              {unref(getShowHeaderTrigger) && (
                <LayoutTrigger theme={unref(getTheme)} sider={false} />
              )}
              {unref(getShowBread) && <LayoutBreadcrumb showIcon={unref(getShowBreadCrumbIcon)} />}
            </div>
          )}

          {unref(getShowTopMenu) && (
            <div class={[`layout-header__menu `]} style={{ width: `calc(100% - ${width}px)` }}>
              <LayoutMenu
                isHorizontal={true}
                class={`justify-${unref(getTopMenuAlign)}`}
                theme={unref(getTheme)}
                splitType={unref(getSplitType)}
                menuMode={unref(getMenuMode)}
                showSearch={false}
              />
            </div>
          )}
        </div>
      );
    }

    function renderActionDefault(Comp: Component | any, event: Fn) {
      return (
        <div class={`layout-header__action-item`} onClick={event}>
          <Comp class={`layout-header__action-icon`} />
        </div>
      );
    }

    function renderAction() {
      return (
        <div class={`layout-header__action`}>
          {unref(getUseErrorHandle) && (
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
                    {() => renderActionDefault(BugOutlined, handleToErrorList)}
                  </Badge>
                ),
              }}
            </Tooltip>
          )}

          {unref(getUseLockPage) && (
            <Tooltip>
              {{
                title: () => '锁定屏幕',
                default: () => renderActionDefault(LockOutlined, handleLockPage),
              }}
            </Tooltip>
          )}

          {unref(getShowNotice) && (
            <Tooltip>
              {{
                title: () => '消息通知',
                default: () => <NoticeAction />,
              }}
            </Tooltip>
          )}

          {unref(getShowRedo) && (
            <Tooltip>
              {{
                title: () => '刷新',
                default: () => renderActionDefault(RedoOutlined, refreshPage),
              }}
            </Tooltip>
          )}

          {unref(getShowFullScreen) && (
            <Tooltip>
              {{
                title: () => (unref(isFullscreenRef) ? '退出全屏' : '全屏'),
                default: () => {
                  const Icon = !unref(isFullscreenRef) ? (
                    <FullscreenOutlined />
                  ) : (
                    <FullscreenExitOutlined />
                  );
                  return renderActionDefault(Icon, toggleFullscreen);
                },
              }}
            </Tooltip>
          )}
          <UserDropdown class={`layout-header__user-dropdown`} />
        </div>
      );
    }

    function renderHeaderDefault() {
      return (
        <>
          {renderHeaderContent()}
          {renderAction()}
          <LockAction onRegister={register} />
        </>
      );
    }

    return () => {
      return (
        <Layout.Header class={['layout-header', 'flex p-0 px-4 ', unref(headerClass)]}>
          {() => renderHeaderDefault()}
        </Layout.Header>
      );
    };
  },
});
