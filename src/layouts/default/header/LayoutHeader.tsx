import './index.less';

import type { FunctionalComponent } from 'vue';
import type { Component } from '/@/components/types';

import { defineComponent, unref, computed } from 'vue';

import { Layout, Tooltip, Badge } from 'ant-design-vue';
import { AppLogo } from '/@/components/Application';
import LayoutMenu from '../menu';
import LockAction from './actions/LockAction';
import LayoutTrigger from '../trigger/index.vue';
import NoticeAction from './notice/NoticeActionItem.vue';
import { LockOutlined, BugOutlined } from '@ant-design/icons-vue';

import { AppSearch } from '/@/components/Application';
import { useModal } from '/@/components/Modal';

import { useHeaderSetting } from '/@/hooks/setting/useHeaderSetting';
import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
import { useRootSetting } from '/@/hooks/setting/useRootSetting';
import { useLocaleSetting } from '/@/hooks/setting/useLocaleSetting';

import { useRouter } from 'vue-router';

import { errorStore } from '/@/store/modules/error';

import { PageEnum } from '/@/enums/pageEnum';
import { MenuModeEnum, MenuSplitTyeEnum } from '/@/enums/menuEnum';
import { AppLocalePicker } from '/@/components/Application';
import { useI18n } from '/@/hooks/web/useI18n';
import { propTypes } from '/@/utils/propTypes';

import { UserDropDown, LayoutBreadcrumb, FullScreen } from './components';
import { useAppInject } from '/@/hooks/web/useAppInject';
import { useDesign } from '../../../hooks/web/useDesign';
interface TooltipItemProps {
  title: string;
}

const TooltipItem: FunctionalComponent<TooltipItemProps> = (props, { slots }) => {
  return (
    <Tooltip>
      {{
        title: () => props.title,
        default: () => slots.default?.(),
      }}
    </Tooltip>
  );
};

export default defineComponent({
  name: 'LayoutHeader',
  props: {
    fixed: propTypes.bool,
  },
  setup(props) {
    const { t } = useI18n();
    const { prefixCls } = useDesign('layout-header');
    const { getShowTopMenu, getShowHeaderTrigger, getSplit } = useMenuSetting();
    const { getShowLocale } = useLocaleSetting();
    const { getUseErrorHandle } = useRootSetting();

    const {
      getHeaderTheme,
      getUseLockPage,
      getShowFullScreen,
      getShowNotice,
      getShowContent,
      getShowBread,
      getShowHeaderLogo,
    } = useHeaderSetting();

    const { push } = useRouter();
    const [register, { openModal }] = useModal();
    const { getIsMobile } = useAppInject();

    const headerClass = computed(() => {
      const theme = unref(getHeaderTheme);
      return theme ? `${prefixCls}__header--${theme}` : '';
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

    function handleLockPage() {
      openModal(true);
    }

    function renderHeaderLeft() {
      return (
        <>
          {unref(getShowContent) && (
            <div class={`${prefixCls}__left`}>
              {unref(getShowHeaderTrigger) && (
                <LayoutTrigger theme={unref(getHeaderTheme)} sider={false} />
              )}
              {unref(getShowBread) && !unref(getIsMobile) && (
                <LayoutBreadcrumb theme={unref(getHeaderTheme)} />
              )}
            </div>
          )}
        </>
      );
    }

    function renderHeaderContent() {
      return (
        <div class={`${prefixCls}__content`}>
          {unref(getShowTopMenu) && !unref(getIsMobile) && (
            <div class={[`${prefixCls}__menu `]}>
              {/* <div class={[`layout-header__menu `]}> */}
              <LayoutMenu
                isHorizontal={true}
                // class={`justify-${unref(getTopMenuAlign)}`}
                theme={unref(getHeaderTheme)}
                splitType={unref(getSplitType)}
                menuMode={unref(getMenuMode)}
              />
            </div>
          )}
        </div>
      );
    }

    function renderActionDefault(Comp: Component | any, event: Fn) {
      return (
        <div class={`${prefixCls}__action-item`} onClick={event}>
          <Comp class={`${prefixCls}__action-icon`} />
        </div>
      );
    }

    function renderAction() {
      return (
        <div class={`${prefixCls}__action`}>
          {!unref(getIsMobile) && <AppSearch class={`${prefixCls}__action-item`} />}

          {unref(getUseErrorHandle) && !unref(getIsMobile) && (
            <TooltipItem title={t('layout.header.tooltipErrorLog')}>
              {() => (
                <Badge
                  count={errorStore.getErrorListCountState}
                  offset={[0, 10]}
                  dot
                  overflowCount={99}
                >
                  {() => renderActionDefault(BugOutlined, handleToErrorList)}
                </Badge>
              )}
            </TooltipItem>
          )}

          {unref(getUseLockPage) && !unref(getIsMobile) && (
            <TooltipItem title={t('layout.header.tooltipLock')}>
              {() => renderActionDefault(LockOutlined, handleLockPage)}
            </TooltipItem>
          )}

          {unref(getShowNotice) && !unref(getIsMobile) && (
            <TooltipItem title={t('layout.header.tooltipNotify')}>
              {() => <NoticeAction />}
            </TooltipItem>
          )}

          {unref(getShowFullScreen) && !unref(getIsMobile) && <FullScreen />}

          <UserDropDown theme={unref(getHeaderTheme)} />

          {unref(getShowLocale) && (
            <AppLocalePicker
              reload={true}
              showText={false}
              class={`${prefixCls}__action-item locale`}
            />
          )}
        </div>
      );
    }

    function renderHeaderDefault() {
      return (
        <>
          {unref(getShowHeaderLogo) && (
            <AppLogo class={`${prefixCls}__logo`} theme={unref(getHeaderTheme)} />
          )}
          {renderHeaderLeft()}
          {renderHeaderContent()}
          {renderAction()}
          <LockAction onRegister={register} />
        </>
      );
    }

    return () => {
      return (
        <Layout.Header class={[prefixCls, unref(headerClass), { fixed: props.fixed }]}>
          {() => renderHeaderDefault()}
        </Layout.Header>
      );
    };
  },
});
