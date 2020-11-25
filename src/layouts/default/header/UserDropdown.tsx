// components
import { Dropdown, Menu } from 'ant-design-vue';

import { defineComponent, computed, unref } from 'vue';

// res
import headerImg from '/@/assets/images/header.jpg';

import Icon from '/@/components/Icon/index';

import { userStore } from '/@/store/modules/user';

import { DOC_URL } from '/@/settings/siteSetting';

import { openWindow } from '/@/utils';

import { useHeaderSetting } from '/@/hooks/setting/useHeaderSetting';
import { FunctionalComponent } from 'vue';
import { useI18n } from '/@/hooks/web/useI18n';

type MenuEvent = 'loginOut' | 'doc';
interface MenuItemProps {
  icon: string;
  text: string;
  key: MenuEvent;
}

const prefixCls = 'user-dropdown';

const MenuItem: FunctionalComponent<MenuItemProps> = (props) => {
  const { key, icon, text } = props;
  return (
    <Menu.Item key={key}>
      {() => (
        <span class="flex items-center">
          <Icon icon={icon} class="mr-1" />
          <span>{text}</span>
        </span>
      )}
    </Menu.Item>
  );
};

export default defineComponent({
  name: 'UserDropdown',
  setup() {
    const { t } = useI18n('layout.header');
    const { getShowDoc } = useHeaderSetting();

    const getUserInfo = computed(() => {
      const { realName = '', desc } = userStore.getUserInfoState || {};
      return { realName, desc };
    });

    //  login out
    function handleLoginOut() {
      userStore.confirmLoginOut();
    }

    // open doc
    function openDoc() {
      openWindow(DOC_URL);
    }

    function handleMenuClick(e: { key: MenuEvent }) {
      switch (e.key) {
        case 'loginOut':
          handleLoginOut();
          break;
        case 'doc':
          openDoc();
          break;
      }
    }

    function renderSlotsDefault() {
      const { realName } = unref(getUserInfo);
      return (
        <section class={prefixCls}>
          <img class={`${prefixCls}__header`} src={headerImg} />
          <section class={`${prefixCls}__info`}>
            <section class={`${prefixCls}__name`}>{realName}</section>
          </section>
        </section>
      );
    }

    function renderSlotOverlay() {
      const showDoc = unref(getShowDoc);
      return (
        <Menu onClick={handleMenuClick}>
          {() => (
            <>
              {showDoc && <MenuItem key="doc" text={t('dropdownItemDoc')} icon="gg:loadbar-doc" />}
              {/* @ts-ignore */}
              {showDoc && <Menu.Divider />}
              <MenuItem
                key="loginOut"
                text={t('dropdownItemLoginOut')}
                icon="ant-design:poweroff-outlined"
              />
            </>
          )}
        </Menu>
      );
    }

    return () => {
      return (
        <Dropdown placement="bottomLeft" overlayClassName="app-layout-header-user-dropdown-overlay">
          {{
            default: () => renderSlotsDefault(),
            overlay: () => renderSlotOverlay(),
          }}
        </Dropdown>
      );
    };
  },
});
