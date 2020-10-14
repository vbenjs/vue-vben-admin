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

    /**
     * @description: 退出登录
     */
    function handleLoginOut() {
      userStore.confirmLoginOut();
    }

    // 打开文档
    function openDoc() {
      window.open(DOC_URL, '__blank');
    }

    function handleMenuClick(e: any) {
      if (e.key === 'loginOut') {
        handleLoginOut();
      }
      if (e.key === 'doc') {
        openDoc();
      }
    }
    const getUserInfo = computed(() => {
      const { realName = '', desc } = userStore.getUserInfoState || {};
      return { realName, desc };
    });
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
                    {showDoc && (
                      <Menu.Item key="doc">
                        {() => (
                          <span class="flex items-center">
                            <Icon icon="gg:loadbar-doc" class="mr-1" />
                            <span>文档</span>
                          </span>
                        )}
                      </Menu.Item>
                    )}
                    {showDoc && <Divider />}

                    <Menu.Item key="loginOut">
                      {() => (
                        <>
                          <span class="flex items-center">
                            <Icon icon="ant-design:poweroff-outlined" class="mr-1" />
                            <span>退出系统</span>
                          </span>
                        </>
                      )}
                    </Menu.Item>
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
