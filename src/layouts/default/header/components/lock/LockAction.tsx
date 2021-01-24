import './LockAction.less';

import { defineComponent } from 'vue';
import { BasicModal, useModalInner } from '/@/components/Modal/index';
import { Button } from '/@/components/Button';
import { BasicForm, useForm } from '/@/components/Form/index';

import headerImg from '/@/assets/images/header.jpg';

import { userStore } from '/@/store/modules/user';
import { useI18n } from '/@/hooks/web/useI18n';
import { lockStore } from '/@/store/modules/lock';

const prefixCls = 'lock-modal';
export default defineComponent({
  name: 'LockModal',
  setup(_, { attrs }) {
    const { t } = useI18n();
    const [register, { closeModal }] = useModalInner();

    const [registerForm, { validateFields, resetFields }] = useForm({
      showActionButtonGroup: false,
      schemas: [
        {
          field: 'password',
          label: t('layout.header.lockScreenPassword'),
          component: 'InputPassword',
          required: true,
        },
      ],
    });

    async function lock() {
      const values = (await validateFields()) as any;
      const password: string | undefined = values.password;
      closeModal();

      lockStore.commitLockInfoState({
        isLock: true,
        pwd: password,
      });
      await resetFields();
    }

    return () => (
      <BasicModal
        footer={null}
        title={t('layout.header.lockScreen')}
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

            <BasicForm onRegister={registerForm} />

            <div class={`${prefixCls}__footer`}>
              <Button type="primary" block class="mt-2" onClick={lock}>
                {() => t('layout.header.lockScreenBtn')}
              </Button>
            </div>
          </div>
        )}
      </BasicModal>
    );
  },
});
