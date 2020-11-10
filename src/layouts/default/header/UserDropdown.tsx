// components
import { Dropdown, Menu, Divider } from 'ant-design-vue';

import { defineComponent, computed, unref } from 'vue';

// res
import headerImg from '/@/assets/images/header.jpg';

import Icon from '/@/components/Icon/index';

import { userStore } from '/@/store/modules/user';

import { DOC_URL } from '/@/settings/siteSetting';
import { appStore } from '/@/store/modules/app';

const prefixCls = 'user-dropdown';
export default defineComponent({
  name: 'UserDropdown',
  setup() {
    const getProjectConfigRef = computed(() => {
      return appStore.getProjectConfig;
    });

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
      window.open(DOC_URL, '__blank');
    }

    function handleMenuClick(e: any) {
      if (e.key === 'loginOut') {
        handleLoginOut();
      } else if (e.key === 'doc') {
        openDoc();
      }
    }

    function renderItem({ icon, text, key }: { icon: string; text: string; key: string }) {
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
    }

    return () => {
      const { realName } = unref(getUserInfo);
      const {
        headerSetting: { showDoc },
      } = unref(getProjectConfigRef);
      return (
        <Dropdown placement="bottomLeft">
          {{
            default: () => (
              <section class={prefixCls}>
                <img class={`${prefixCls}__header`} src={headerImg} />
                <section class={`${prefixCls}__info`}>
                  <section class={`${prefixCls}__name`}>{realName}</section>
                </section>
              </section>
            ),
            overlay: () => (
              <Menu slot="overlay" onClick={handleMenuClick}>
                {() => (
                  <>
                    {showDoc && renderItem({ key: 'doc', text: '文档', icon: 'gg:loadbar-doc' })}
                    {showDoc && <Divider />}
                    {renderItem({
                      key: 'loginOut',
                      text: '退出系统',
                      icon: 'ant-design:poweroff-outlined',
                    })}
                  </>
                )}
              </Menu>
            ),
          }}
        </Dropdown>
      );
    };
  },
});
