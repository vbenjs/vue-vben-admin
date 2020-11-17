// 组件相关
import { defineComponent } from 'vue';
import { BasicModal, useModalInner } from '/@/components/Modal/index';

// hook
import { BasicForm, useForm } from '/@/components/Form/index';

import headerImg from '/@/assets/images/header.jpg';

import { appStore } from '/@/store/modules/app';
import { userStore } from '/@/store/modules/user';
import Button from '/@/components/Button/index.vue';
import './LockActionItem.less';
const prefixCls = 'lock-modal';
export default defineComponent({
  name: 'LockModal',
  setup(_, { attrs }) {
    const [register, { setModalProps }] = useModalInner();
    // 样式前缀
    const [registerForm, { validateFields, resetFields }] = useForm({
      // 隐藏按钮
      showActionButtonGroup: false,
      // 表单项
      schemas: [
        {
          field: 'password',
          label: '',
          component: 'InputPassword',
          componentProps: {
            placeholder: '请输入锁屏密码',
          },
          rules: [{ required: true }],
        },
      ],
    });
    /**
     * @description: lock
     */
    async function lock(valid = true) {
      let password: string | undefined = '';

      try {
        if (!valid) {
          password = undefined;
        } else {
          const values = (await validateFields()) as any;
          password = values.password;
        }
        setModalProps({
          visible: false,
        });

        appStore.commitLockInfoState({
          isLock: true,
          pwd: password,
        });
        await resetFields();
      } catch (error) {}
    }
    // 账号密码登录
    return () => (
      <BasicModal footer={null} title="锁定屏幕" {...attrs} class={prefixCls} onRegister={register}>
        {() => (
          <div class={`${prefixCls}__entry`}>
            <div class={`${prefixCls}__header`}>
              <img src={headerImg} class={`${prefixCls}__header-img`} />
              <p class={`${prefixCls}__header-name`}>{userStore.getUserInfoState.realName}</p>
            </div>
            <BasicForm onRegister={registerForm} />
            <div class={`${prefixCls}__footer`}>
              <Button type="primary" block class="mt-2" onClick={lock}>
                {() => '锁屏'}
              </Button>
              <Button block class="mt-2" onClick={lock.bind(null, false)}>
                {() => ' 不设置密码锁屏'}
              </Button>
            </div>
          </div>
        )}
      </BasicModal>
    );
  },
});
