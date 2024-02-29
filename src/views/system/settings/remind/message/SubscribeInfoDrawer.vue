<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    :title="title"
    :width="800"
    destroyOnClose
  >
    <BasicTable @register="registerTable" class="!p-0" />
  </BasicDrawer>
</template>
<script lang="tsx" setup>
  import { BasicDrawer, useDrawerInner } from '@/components/Drawer';
  import { BasicTable, useTable } from '@/components/Table';
  import { ref } from 'vue';
  import { message } from 'ant-design-vue';
  import { ApiButton, PopConfirmButton } from '@/components/Button';
  import { deleteWxSubscribe, getWxSubscribe, postWxTest } from '@/api/remind/message';

  const title = ref('订阅列表');
  const refId = ref(0);

  defineEmits(['load', 'register', 'success']);
  const [registerTable, { reload }] = useTable({
    api: getWxSubscribe,
    beforeFetch(where) {
      where.messageId = refId.value;
      return where;
    },
    columns: [
      {
        dataIndex: 'username',
        title: '用户名',
        width: 120,
      },
      {
        dataIndex: 'name',
        title: '姓名',
        width: 120,
      },
      {
        dataIndex: 'phone',
        title: '手机号',
        width: 120,
      },
      {
        dataIndex: 'email',
        title: '邮箱',
        width: 120,
      },
    ],
    rowKey: 'id',
    size: 'small',
    loading: true,
    showIndexColumn: false,
    useSearchForm: true,
    formConfig: {
      autoSubmitOnEnter: true,
      schemas: [
        {
          label: '用户信息',
          field: `userInfo`,
          component: 'Input',
          colProps: { span: 8 },
        },
      ],
    },
    actionColumn: {
      width: 180,
      title: '操作',
      dataIndex: 'action',
      auth: ['RemindMessage_send'],
      customRender: ({ record }) => (
        <div class="flex">
          <ApiButton
            v-show={record.sendSuccess !== 'Y'}
            preIcon="carbon:send-alt-filled"
            type="link"
            api={async () => {
              await postWxTest(record.id);
              message.success('发送成功！');
              reload();
            }}
          >
            发送测试消息
          </ApiButton>
          <PopConfirmButton
            type="link"
            danger
            title="是否确认删除？"
            placement="left"
            onConfirm={async () => {
              await deleteWxSubscribe([record.id]);
              reload();
            }}
          >
            删除
          </PopConfirmButton>
        </div>
      ),
    },
  });

  const [registerDrawer] = useDrawerInner(async (data) => {
    refId.value = data.id;
  });
</script>
