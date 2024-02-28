<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    :title="t('system.account.login_record')"
    :width="800"
    destroyOnClose
  >
    <BasicTable @register="registerTable" />
  </BasicDrawer>
</template>
<script lang="tsx" setup>
  import { ref, unref } from 'vue';
  import { useI18n } from '@/hooks/web/useI18n';
  import { loginRecord } from '@/api/system/user';
  import { BasicDrawer, useDrawerInner } from '@/components/Drawer';
  import { BasicTable, useTable } from '@/components/Table';
  import { YNTag } from '@/components/Tag';
  import { intToIp } from '@/utils';
  import { formatToDateTime } from '@/utils/dateUtil';

  const { t } = useI18n();
  const emit = defineEmits(['load', 'register']);

  const username = ref<string>();
  const [registerTable] = useTable({
    api: loginRecord,
    beforeFetch: (where) => {
      where.username = unref(username);
      return where;
    },
    searchInfo: {
      field: 'loginTime',
      order: 'desc',
    },
    columns: [
      { title: t('system.account.username'), dataIndex: 'username', width: 100 },
      {
        title: t('system.account.loginRecord.loginTime'),
        dataIndex: 'loginTime',
        width: 200,
        customRender: ({ text }) => formatToDateTime(text),
      },
      {
        title: t('system.account.loginRecord.loginIp'),
        dataIndex: 'loginIp',
        width: 160,
        customRender: ({ text }) => intToIp(text),
      },
      {
        title: t('system.account.loginRecord.msg'),
        dataIndex: 'msg',
        width: 200,
      },
      {
        title: t('system.account.loginRecord.isSuccess'),
        dataIndex: 'isSuccess',
        width: 100,
        customRender: ({ text }) => <YNTag text={text} />,
      },
    ],
    rowKey: 'id',
    loading: true,
    showIndexColumn: false,
  });

  const [registerDrawer, { setDrawerProps }] = useDrawerInner(async (data) => {
    username.value = data.record.username;
    setDrawerProps({ confirmLoading: false });
    emit('load');
  });
</script>
