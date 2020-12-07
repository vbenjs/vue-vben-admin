import './index.less';

import type { FunctionalComponent } from 'vue';
import type { Component } from '/@/components/types';

import {
  defineComponent,
  unref,
  computed,
  ref,
  nextTick,
  watchEffect,
  // nextTick
} from 'vue';

import { Layout, Tooltip, Badge } from 'ant-design-vue';
import { AppLogo } from '/@/components/Application';
import UserDropdown from './UserDropdown';
import LayoutMenu from '../menu';
import LayoutBreadcrumb from './LayoutBreadcrumb.vue';
import LockAction from '../lock/LockAction';
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
import { useLocaleSetting } from '/@/hooks/setting/useLocaleSetting';

import { useRouter } from 'vue-router';

import { errorStore } from '/@/store/modules/error';

import { PageEnum } from '/@/enums/pageEnum';
import { MenuModeEnum, MenuSplitTyeEnum } from '/@/enums/menuEnum';
import { AppLocalePicker } from '/@/components/Application';
import { useI18n } from '/@/hooks/web/useI18n';
import { propTypes } from '/@/utils/propTypes';
import { useLayoutContext } from '../useLayoutContext';

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
    let logoEl: Element | null | undefined;

    const logoWidthRef = ref(200);
    const logoRef = ref<ComponentRef>(null);

    const injectValue = useLayoutContext();

    const { refreshPage } = useTabs();
    const { t } = useI18n();

    const { getShowTopMenu, getShowHeaderTrigger, getSplit, getIsHorizontal } = useMenuSetting();

    const { getShowLocale } = useLocaleSetting();
    const { getUseErrorHandle, getShowBreadCrumbIcon } = useRootSetting();

    const {
      getHeaderTheme,
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
        calcTopMenuWidth();
      },
      100,
      { immediate: false }
    );

    const headerClass = computed(() => {
      const theme = unref(getHeaderTheme);
      return theme ? `layout-header__header--${theme}` : '';
    });

    const isPc = computed(() => {
      return !unref(injectValue.isMobile);
    });

    const getSplitType = computed(() => {
      return unref(getSplit) ? MenuSplitTyeEnum.TOP : MenuSplitTyeEnum.NONE;
    });

    const getMenuMode = computed(() => {
      return unref(getSplit) ? MenuModeEnum.HORIZONTAL : null;
    });

    watchEffect(() => {
      if (unref(getIsHorizontal)) {
        calcTopMenuWidth();
      }
    });

    function calcTopMenuWidth() {
      nextTick(() => {
        if (!unref(getShowTopMenu)) return;
        let width = 0;
        if (!logoEl) {
          logoEl = unref(logoRef)?.$el;
        }
        if (!logoEl) return;
        width += logoEl.clientWidth;
        logoWidthRef.value = width + 80;
      });
    }

    function handleToErrorList() {
      push(PageEnum.ERROR_LOG_PAGE).then(() => {
        errorStore.commitErrorListCountState(0);
      });
    }

    function handleLockPage() {
      openModal(true);
    }

    function renderHeaderContent() {
      const width = unref(logoWidthRef);
      return (
        <div class="layout-header__content ">
          {unref(getShowHeaderLogo) && (
            <AppLogo class={`layout-header__logo`} ref={logoRef} theme={unref(getHeaderTheme)} />
          )}

          {unref(getShowContent) && (
            <div class="layout-header__left">
              {unref(getShowHeaderTrigger) && (
                <LayoutTrigger theme={unref(getHeaderTheme)} sider={false} />
              )}
              {unref(getShowBread) && unref(isPc) && (
                <LayoutBreadcrumb showIcon={unref(getShowBreadCrumbIcon)} />
              )}
            </div>
          )}

          {unref(getShowTopMenu) && unref(isPc) && (
            <div class={[`layout-header__menu `]} style={{ width: `calc(100% - ${width}px)` }}>
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
        <div class="layout-header__action-item" onClick={event}>
          <Comp class="layout-header__action-icon" />
        </div>
      );
    }

    function renderAction() {
      return (
        <div class={`layout-header__action`}>
          {unref(getUseErrorHandle) && unref(isPc) && (
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

          {unref(getUseLockPage) && unref(isPc) && (
            <TooltipItem title={t('layout.header.tooltipLock')}>
              {() => renderActionDefault(LockOutlined, handleLockPage)}
            </TooltipItem>
          )}

          {unref(getShowNotice) && unref(isPc) && (
            <TooltipItem title={t('layout.header.tooltipNotify')}>
              {() => <NoticeAction />}
            </TooltipItem>
          )}

          {unref(getShowRedo) && unref(isPc) && (
            <TooltipItem title={t('layout.header.tooltipRedo')}>
              {() => renderActionDefault(RedoOutlined, refreshPage)}
            </TooltipItem>
          )}

          {unref(getShowFullScreen) && unref(isPc) && (
            <TooltipItem
              title={
                unref(isFullscreenRef)
                  ? t('layout.header.tooltipExitFull')
                  : t('layout.header.tooltipEntryFull')
              }
            >
              {() => {
                const Icon = !unref(isFullscreenRef) ? (
                  <FullscreenOutlined />
                ) : (
                  <FullscreenExitOutlined />
                );
                return renderActionDefault(Icon, toggleFullscreen);
              }}
            </TooltipItem>
          )}
          <UserDropdown class="layout-header__user-dropdown" />
          {unref(getShowLocale) && (
            <AppLocalePicker
              reload={true}
              showText={false}
              class="layout-header__action-item locale"
            />
          )}
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
        <Layout.Header
          class={['layout-header', 'flex p-0 px-4 ', unref(headerClass), { fixed: props.fixed }]}
        >
          {() => renderHeaderDefault()}
        </Layout.Header>
      );
    };
  },
});
