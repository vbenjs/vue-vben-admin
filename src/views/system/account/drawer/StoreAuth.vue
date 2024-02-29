<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    title="地点权限"
    :width="800"
    destroyOnClose
  >
    <BasicTable @register="registerTable" class="!p-0">
      <template #toolbar>
        <a-button
          type="primary"
          preIcon="ant-design:plus-outlined"
          @click="handleCreate"
          v-auth="'UserStore_add'"
        >
          添加地点
        </a-button>
      </template>
    </BasicTable>
    <StoreFormDrawer @register="registerFormDrawer" @success="reload" />
  </BasicDrawer>
</template>
<script lang="tsx" setup>
  import { BasicDrawer, useDrawer, useDrawerInner } from '@/components/Drawer';
  import { BasicTable, TableAction, useTable } from '@/components/Table';
  import { formatToDate } from '@/utils/dateUtil';
  import { ref } from 'vue';
  import { deleteUserStore, getUserStore } from '@/api/userStore';
  import { createAsyncComponent } from '@/utils/factory/createAsyncComponent';
  import { useFormat } from '@/utils/format';
  import { userStoreTypeMap } from '@/enums/userStoreType';

  const StoreFormDrawer = createAsyncComponent(() => import('./StoreFormDrawer.vue'));

  const accountId = ref<number>();

  const emit = defineEmits(['load', 'register']);

  const [registerFormDrawer, { openDrawer }] = useDrawer();
  const { formatStore } = useFormat();

  const [registerTable, { reload }] = useTable({
    api: (where) => getUserStore(where, true),
    beforeFetch: (params) => {
      params.accountId = accountId.value;
      return params;
    },
    columns: [
      {
        dataIndex: 'storeType',
        title: '权限类型',
        width: 140,
        customRender: ({ text }) => userStoreTypeMap.get(text),
      },
      {
        dataIndex: 'store',
        title: '地点',
        width: 200,
        customRender: ({ text }) => formatStore(text),
      },
      {
        dataIndex: 'mark',
        title: '备注',
      },
      {
        dataIndex: 'createTime',
        title: '创建时间',
        width: 130,
        customRender: ({ text }) => formatToDate(text),
      },
      { dataIndex: 'createBy', title: '创建者', width: 120 },
    ],
    rowKey: 'id',
    loading: true,
    showIndexColumn: false,
    useSearchForm: true,
    formConfig: {
      autoSubmitOnEnter: true,
      // showAdvancedButton: false,
      schemas: [
        {
          label: '地点',
          field: `storeInfo`,
          component: 'Input',
          colProps: { span: 8 },
        },
      ],
    },
    actionColumn: {
      width: 60,
      title: '操作',
      dataIndex: 'action',
      auth: ['UserStore_del'],
      customRender: ({ record }) => {
        return createActions(record);
      },
    },
  });

  const createActions = (record: Recordable) => {
    return (
      <TableAction
        stopButtonPropagation
        actions={[
          {
            icon: 'ant-design:delete-outlined',
            color: 'error',
            auth: 'UserStore_del',
            popConfirm: {
              title: '是否确认删除？',
              placement: 'left',
              confirm: handleDelete.bind(null, record.id),
            },
          },
        ]}
      />
    );
  };

  const [registerDrawer, { setDrawerProps }] = useDrawerInner(async (data) => {
    setDrawerProps({ confirmLoading: false });
    accountId.value = data.record.id;
    emit('load');
  });
  const handleCreate = () => {
    openDrawer(true, accountId.value);
  };
  const handleDelete = async (id: number) => {
    await deleteUserStore([id]);
    reload();
  };
</script>
