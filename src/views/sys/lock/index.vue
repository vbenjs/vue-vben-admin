<script lang="tsx">
  // 组件相关
  import { defineComponent, ref, unref, computed } from '@/setup/vue';
  import { SvgIcon } from '@/components/icon/index';
  import { Button, Icon, Alert } from 'ant-design-vue';
  // hook
  import { useDesign } from '@/hooks/core/useDesign';
  import { BasicForm, useForm } from '@/components/form/index';

  import headerImg from '@/assets/images/header.jpg';

  import { userStore } from '@/store/modules/user';
  import { appStore } from '@/store/modules/app';
  export default defineComponent({
    name: 'LockPage',

    setup() {
      // 获取配置文件
      // 样式前缀
      const { prefixCls } = useDesign('lock-page');
      const loadingRef = ref(false);
      const errMsgRef = ref(false);
      const [register, { validateFields }] = useForm({
        // 隐藏按钮
        showActionButtonGroup: false,
        // 表单项
        schemas: [
          {
            field: 'password',
            label: '',
            component: 'InputPassword',
            componentProps: {
              placeholder: '请输入锁屏密码或者用户密码',
            },
            rules: [{ required: true }],
            renderComponentContent: () => {
              return [<SvgIcon type="password" slot="addonBefore" />];
            },
          },
        ],
      });
      /**
       * @description: unLock
       */
      async function unLock(valid = true) {
        let password = '';

        if (valid) {
          const { err, values } = await validateFields();
          if (err) {
            return;
          }
          password = values.password;
        }
        try {
          loadingRef.value = true;
          const res = await appStore.unLockAction({ password, valid });
          errMsgRef.value = !res;
        } finally {
          loadingRef.value = false;
        }
      }
      function goLogin() {
        userStore.loginOut(true);
        appStore.resetLockInfo();
      }
      const getIsNotPwd = computed(() => {
        if (!appStore.getLockInfo) {
          return true;
        }
        return appStore.getLockInfo.pwd === undefined;
      });
      // 账号密码登录
      return () => {
        const { getUserInfoState } = userStore;
        const { realName } = getUserInfoState || {};
        const isNotPwd = unref(getIsNotPwd);
        return (
          <div class={prefixCls}>
            <div class={`${prefixCls}__entry`}>
              <div class={`${prefixCls}__header`}>
                <img src={headerImg} class={`${prefixCls}__header-img`} />
                <p class={`${prefixCls}__header-name`}>{realName}</p>
              </div>
              {!isNotPwd && <BasicForm onRegister={register} />}
              {unref(errMsgRef) && <Alert type="error" message="锁屏密码错误" banner />}
              <div class={`${prefixCls}__footer`}>
                {!isNotPwd && (
                  <Button type="default" class="mt-2 mr-2" onClick={goLogin}>
                    返回登陆
                  </Button>
                )}
                <Button
                  type="primary"
                  class="mt-2"
                  onClick={unLock.bind(null, !isNotPwd)}
                  loading={unref(loadingRef)}
                >
                  <Icon type="unlock" />
                  {isNotPwd ? '进入系统' : '解锁'}
                </Button>
              </div>
            </div>
          </div>
        );
      };
    },
  });
</script>
<style lang="less" scoped>
  @import (reference) '~@design';

  @prefix-cls: ~'@{namespace}-lock-page';

  .@{prefix-cls} {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999999;
    display: flex;
    height: 100vh;
    background: url(~@/assets/images/lock-page.png) no-repeat;
    background-size: 100% 100%;
    align-items: center;
    justify-content: center;

    &__entry {
      position: relative;
      width: 400px;
      height: 220px;
      padding: 80px 50px 0 50px;
      background: #fff;
      border-radius: 10px;
    }

    &__header {
      position: absolute;
      top: -35px;
      left: calc(50% - 45px);
      width: auto;
      text-align: center;

      &-img {
        width: 70px;
        border-radius: 50%;
      }

      &-name {
        margin-top: 5px;
      }
    }

    &__footer {
      text-align: center;
    }
  }
</style>
