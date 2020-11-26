import './LockAction.less';

import { defineComponent } from 'vue';
import { BasicModal, useModalInner } from '/@/components/Modal/index';
import { Button } from '/@/components/Button';
import { BasicForm, useForm } from '/@/components/Form/index';

import headerImg from '/@/assets/images/header.jpg';

import { appStore } from '/@/store/modules/app';
import { userStore } from '/@/store/modules/user';
import { useI18n } from '/@/hooks/web/useI18n';

const prefixCls = 'lock-modal';
export default defineComponent({
  name: 'LockModal',
  setup(_, { attrs }) {
    const { t } = useI18n('layout.header');
    const [register, { closeModal }] = useModalInner();

    const [registerForm, { validateFields, resetFields }] = useForm({
      showActionButtonGroup: false,
      schemas: [
        {
          field: 'password',
          label: t('lockScreenPassword'),
          component: 'InputPassword',
          required: true,
        },
      ],
    });

    async function lock(valid = true) {
      let password: string | undefined = '';

      try {
        if (!valid) {
          password = undefined;
        } else {
          const values = (await validateFields()) as any;
          password = values.password;
        }
        closeModal();

        appStore.commitLockInfoState({
          isLock: true,
          pwd: password,
        });
        await resetFields();
      } catch (error) {}
    }

    return () => (
      <BasicModal
        footer={null}
        title={t('lockScreen')}
        {...attrs}
        class={prefixCls}
        onRegister={register}
      >
        {() => (
          <div class={`${prefixCls}__entry`}>
            <div class={`${prefixCls}__header`}>
              <img src={headerImg} class={`${prefixCls}__header-img`} />
              <p class={`${prefixCls}__header-name`}>{userStore.getUserInfoState.realName}</p>
            </div>

            <BasicForm onRegister={registerForm} layout="vertical" />

            <div class={`${prefixCls}__footer`}>
              <Button type="primary" block class="mt-2" onClick={lock}>
                {() => t('lockScreenBtn')}
              </Button>
              <Button block class="mt-2" onClick={lock.bind(null, false)}>
                {() => t('notLockScreenPassword')}
              </Button>
            </div>
          </div>
        )}
      </BasicModal>
    );
  },
});
