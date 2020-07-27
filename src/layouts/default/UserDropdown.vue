<script lang="tsx">
  // components
  import { Dropdown, Menu, Divider } from 'ant-design-vue';
  import { SvgIcon, Icon } from '@/components/icon/index';

  import { defineComponent, computed, unref } from 'compatible-vue';

  // res
  import headerImg from '@/assets/images/header.jpg';

  // hook
  import { useDesign } from '@/hooks/core/useDesign';

  import { userStore } from '@/store/modules/user';
  import { DOC_PATH } from '@/settings/docSetting';
  export default defineComponent({
    name: 'UserDropdown',
    setup() {
      // 样式前缀
      const { prefixCls } = useDesign('user-dropdown');

      /**
       * @description: 退出登录
       */
      function handleLoginOut() {
        userStore.confirmLoginOut();
      }

      // 打开文档
      function openDoc() {
        window.open(DOC_PATH, '__blank');
      }

      function handleMenuClick(e) {
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
        const {
          realName,
          // desc
        } = unref(getUserInfo) || {};
        return (
          <Dropdown placement="bottomLeft">
            <section class={prefixCls}>
              <img class={`${prefixCls}__header`} src={headerImg} />
              <section class={`${prefixCls}__info`}>
                <section class={`${prefixCls}__name`}>{realName}</section>
                {
                  // <section class={`${prefixCls}__desc`}>{desc}</section>
                }
              </section>
              {
                //   <div class={`${prefixCls}__divider`}></div>
                // <section class={`${prefixCls}__exit`} onClick={handleLoginOut}>
                //   <section>
                //     <SvgIcon type="exit" size="1.4em" />
                //   </section>
                //   <section>退出系统</section>
                // </section>
              }
            </section>

            <Menu slot="overlay" onClick={handleMenuClick}>
              <Menu.Item key="doc">
                <Icon type="book" />
                文档
              </Menu.Item>
              <Divider />
              <Menu.Item key="loginOut">
                <SvgIcon type="exit" />
                退出系统
              </Menu.Item>
            </Menu>
          </Dropdown>
        );
      };
    },
  });
</script>
