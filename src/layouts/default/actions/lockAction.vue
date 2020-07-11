<script lang="tsx">
  // 组件相关
  import { defineComponent, unref } from 'compatible-vue';
  import { SvgIcon } from '@/components/icon/index';
  import { Button, Icon } from 'ant-design-vue';
  import { BasicModal, useModalExt } from '@/components/modal/index';

  // hook
  import { useDesign } from '@/hooks/core/useDesign';
  import { BasicForm, useForm } from '@/components/form/index';

  import headerImg from '@/assets/images/header.jpg';

  import { appStore } from '@/store/modules/app';
  import { userStore } from '@/store/modules/user';
  export default defineComponent({
    name: 'LockModal',
    setup(_, { listeners, emit }) {
      const { register: registerModal, modalInstallRef } = useModalExt(emit);
      // 样式前缀
      const { prefixCls } = useDesign('lock-modal');
      const [register, { validateFields, resetFields }] = useForm({
        // 隐藏按钮
        showActionButtonGroup: false,
        // 表单项
        schemas: [
          {
            field: 'password',
            label: '锁屏密码',
            component: 'InputPassword',
            componentProps: {
              placeholder: '请输入锁屏密码',
            },
            rules: [{ required: true }],
            renderComponentContent: () => {
              return [<SvgIcon type="password" slot="addonBefore" />];
            },
          },
        ],
      });
      /**
       * @description: lock
       */
      async function lock(valid = true) {
        let password: string | undefined = '';
        if (valid) {
          const { err, values } = await validateFields();
          if (err) {
            return;
          }
          password = values.password;
        } else {
          password = undefined;
        }

        unref(modalInstallRef)!.setModalProps({
          visible: false,
        });

        appStore.commitLockInfoState({
          isLock: true,
          pwd: password,
        });
        resetFields();
      }
      // 账号密码登录
      return () => (
        <BasicModal
          class={prefixCls}
          footer={null}
          title="锁定屏幕"
          on={{
            ...listeners,
            register: registerModal,
          }}
        >
          <div class={`${prefixCls}__entry`}>
            <div class={`${prefixCls}__header`}>
              <img src={headerImg} class={`${prefixCls}__header-img`} />
              <p class={`${prefixCls}__header-name`}>{userStore.getUserInfoState.realName}</p>
            </div>
            <BasicForm onRegister={register} />
            <div class={`${prefixCls}__footer`}>
              <Button type="primary" block class="mt-2" onClick={lock}>
                <Icon type="lock" />
                锁屏
              </Button>
              <Button block class="mt-2" onClick={lock.bind(null, false)}>
                <Icon type="lock" />
                不设置密码锁屏
              </Button>
            </div>
          </div>
        </BasicModal>
      );
    },
  });
</script>
<style lang="less" scoped>
  @import (reference) '~@design';

  @prefix-cls: ~'@{namespace}-lock-modal';

  .@{prefix-cls} {
    &__entry {
      position: relative;
      width: 500px;
      height: 240px;
      padding: 80px 30px 0 30px;
      background: #fff;
      border-radius: 10px;
    }

    &__header {
      position: absolute;
      top: 0;
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
