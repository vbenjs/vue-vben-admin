<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    :title="getTitle"
    @ok="handleSubmit"
    :width="570"
    destroyOnClose
    showFooter
  >
    <BasicForm @register="registerForm" />
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { ref, computed, unref, toRaw } from 'vue';
  import { useI18n } from '@/hooks/web/useI18n';
  import { ActionKey, getFormSchema } from '../form';
  import { createAccount, updateAccount } from '@/api/system/account';
  import { BasicDrawer, useDrawerInner } from '@/components/Drawer';
  import { useMessage } from '@/hooks/web/useMessage';
  import { BasicForm, useForm } from '@/components/Form';
  import { Account } from '@/ApiModel/system/accountModel';
  // import { YN } from '@/enums/YN';

  const { t } = useI18n();

  const actionKey = ref<ActionKey>();
  const rowId = ref<number>();
  const emit = defineEmits(['success', 'register']);
  const { createMessage: message } = useMessage();

  const [registerForm, { setFieldsValue, resetFields, validate, resetSchema }] = useForm({
    labelWidth: 80,
    showActionButtonGroup: false,
    actionColOptions: {
      span: 23,
    },
  });

  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    actionKey.value = data?.actionKey;

    resetFields();
    resetSchema(getFormSchema(actionKey.value, data.record));
    setDrawerProps({ confirmLoading: false });
    if (unref(actionKey) !== 'create') {
      const account = toRaw(data.record) as Account;
      rowId.value = account.id;
      account.roleIds = account.roles?.map((item) => item.id);
      // const platform: string[] = [];
      // if (account.platformAdmin === YN.Y) platform.push('admin');
      // if (account.platformWx === YN.Y) platform.push('wx');
      // account.staffId = account.staff?.id;
      setFieldsValue({
        ...account,
        // platform,
      });
    }
  });

  const getTitle = computed(() => {
    const action = unref(actionKey);
    if (action === 'create') return t('common.addNewText') + t('system.account.account');
    if (action === 'edit') return t('common.editText') + t('system.account.account');
    return '';
  });
  async function handleSubmit() {
    try {
      const values = await validate();
      delete values.confirm_password;
      // values.platformAdmin = values.platform.includes('admin') ? YN.Y : YN.N;
      // values.platformWx = values.platform.includes('wx') ? YN.Y : YN.N;
      // delete values.platform;

      setDrawerProps({ confirmLoading: true });
      const action = unref(actionKey);
      const id = rowId.value;
      if (action === 'create') await createAccount({ ...values });
      if (action === 'edit') await updateAccount({ id, ...values });
      message.success(t('common.saveSuccessMessage'));
      closeDrawer();
      emit('success', {
        actionKey: action,
        values: { ...values, id: rowId.value },
      });
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  }
</script>
@/ApiModel/system/accountModel
