<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    :title="title"
    :width="800"
    destroyOnClose
  >
    <BasicTable @register="registerTable" />
  </BasicDrawer>
</template>
<script lang="tsx" setup>
  import { BasicDrawer, useDrawerInner } from '@/components/Drawer';
  import { BasicTable, useTable } from '@/components/Table';
  import { ref } from 'vue';
  import { formatToDateTime } from '@/utils/dateUtil';
  import { YNTag } from '@/components/Tag';
  import { getNotificationRecord, resendNotificationRecordById } from '@/api/remind/record';
  import { BasicHelp } from '@/components/Basic';
  import { message } from 'ant-design-vue';
  import { ApiButton } from '@/components/Button';
  import { useFormat } from '@/utils/format';
  import RemindAccount from '@/views/components/RemindAccount.vue';

  const title = ref('');
  const recordId = ref(0);

  defineEmits(['load', 'register', 'success']);
  const { formatRemindMessage } = useFormat();
  const [registerTable, { reload }] = useTable({
    api: getNotificationRecord,
    beforeFetch(where) {
      where.recordId = recordId.value;
      return where;
    },
    columns: [
      {
        dataIndex: 'sendTime',
        title: '通知时间',
        width: 180,
        customRender: ({ text }) => formatToDateTime(text),
      },
      {
        dataIndex: 'account',
        title: '通知目标',
        width: 120,
        customRender: ({ text }) => <RemindAccount account={text} />,
      },
      {
        dataIndex: 'message',
        title: '通知方式',
        width: 180,
        customRender: ({ text }) => formatRemindMessage(text),
      },
      {
        dataIndex: 'sendSuccess',
        title: '通知结果',
        width: 100,
        customRender: ({ text, record }) => (
          <div>
            {text === 'N' ? (
              <BasicHelp text={record.result}>
                <YNTag text={text} />
              </BasicHelp>
            ) : (
              <YNTag text={text} />
            )}
          </div>
        ),
      },
    ],
    rowKey: 'id',
    size: 'small',
    loading: true,
    showIndexColumn: false,
    pagination: false,
    useSearchForm: false,
    actionColumn: {
      width: 140,
      title: '操作',
      dataIndex: 'action',
      customRender: ({ record }) => (
        <ApiButton
          v-show={record.sendSuccess !== 'Y'}
          preIcon="mdi:email-resend-outline"
          type="link"
          api={async () => {
            await resendNotificationRecordById(record.id);
            message.success('重新发送成功！');
            reload();
          }}
        >
          重新发送
        </ApiButton>
      ),
    },
  });

  const [registerDrawer] = useDrawerInner(async (data) => {
    recordId.value = data.recordId;
    title.value = data.title;
  });
</script>
