<!-- eslint-disable prettier/prettier -->
<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button
          type="primary"
          preIcon="ant-design:plus-outlined"
          @click="handleCreate"
          v-auth="'GatewayManager_add'"
        >
          添加网关
        </a-button>
      </template>
    </BasicTable>

    <GatewayDrawer @register="registerDrawer" @success="handleSuccess" />
    <OriginData @register="registerOriginData" />
    <StatisData @register="registerStatisData" />
    <ShowJson @register="registerJsonDrawer" title="其他数据" />
  </div>
</template>
<script lang="tsx" setup name="Gateway">
  import { getFormConfig, getColumns } from './data';
  import { deleteGateway, getGateway, getGatewayById } from '@/api/gateway';
  import { GatewayResult } from '@/api/model/gatewayModel';
  import { useDrawer } from '@/components/Drawer';
  import { BasicTable, TableAction, useTable } from '@/components/Table';
  import { useGo } from '@/hooks/web/usePage';
  import { HashingFactory } from '@/utils/cipher';
  import { createAsyncComponent } from '@/utils/factory/createAsyncComponent';
  import { useFormat } from '@/utils/format';

  const GatewayDrawer = createAsyncComponent(() => import('./Drawer/GatewayDrawer.vue'));
  const OriginData = createAsyncComponent(() => import('./Drawer/OriginData.vue'));
  const StatisData = createAsyncComponent(() => import('./Drawer/StatisData.vue'));
  const ShowJson = createAsyncComponent(() => import('@/views/Drawers/ShowJson.vue'));

  const encryptByMd5 = HashingFactory.createMD5Hashing().hash;

  const go = useGo();
  const { formatStore, formatGateway } = useFormat();
  const [registerDrawer, { openDrawer }] = useDrawer();
  const [registerOriginData, { openDrawer: openOriginData }] = useDrawer();
  const [registerStatisData, { openDrawer: openStatisData }] = useDrawer();
  const [registerJsonDrawer, { openDrawer: openJsonDrawer }] = useDrawer();

  const [registerTable, { reload, updateTableDataRecord }] = useTable({
    api: (where) => getGateway(where, true),
    title: '网关列表',
    columns: getColumns(),
    rowKey: 'id',
    useSearchForm: true,
    formConfig: getFormConfig(),
    showTableSetting: true,
    loading: true,
    showIndexColumn: false,
    actionColumn: {
      width: 160,
      title: '操作',
      dataIndex: 'action',
      customRender: ({ record }) => {
        return createActions(record as GatewayResult);
      },
      // align: 'left',
      // customHeaderCell: (column) => {
      //   column.align = 'center';
      //   return column;
      // },
    },
  });

  const createActions = (record: GatewayResult) => {
    return (
      <TableAction
        stopButtonPropagation
        actions={[
          {
            icon: 'clarity:note-edit-line',
            tooltip: '编辑',
            auth: 'GatewayManager_edit',
            onClick: async () => {
              const data = await getGatewayById(record.id);
              openDrawer(true, {
                record: data,
                actionKey: 'edit',
              });
            },
          },
          {
            icon: 'ant-design:file-search-outlined',
            tooltip: '原始数据',
            auth: 'GatewayManager_origin',
            onClick: async () => {
              openOriginData(true, {
                id: record.id,
                title: `[${formatGateway(record, 'mark')}]原始数据`,
                terminalType: record.terminalType,
              });
            },
          },
          {
            icon: 'icon-park-outline:alarm',
            tooltip: '告警设置',
            auth: 'GatewayAlarm',
            onClick: () => {
              const id = encryptByMd5(record.id + 'GATEWAY');
              go({
                path: '/alarm/equipment/' + id,
                query: {
                  equipmentId: record.id,
                  equipmentType: 'GATEWAY',
                  equipmentName: formatGateway(record),
                  store: formatStore(record.store),
                  permissionCode: 'GatewayAlarm',
                  equipment: JSON.stringify(record),
                },
              });
            },
          },
        ]}
        dropDownActions={[
          {
            label: '数据统计',
            auth: 'GatewayManager_statis',
            onClick: async () => {
              openStatisData(true, {
                id: record.id,
                title: `[${formatGateway(record, 'mark')}]原始数据统计`,
              });
            },
            ifShow: record.terminalType === 'MULTI_BUS',
          },
          {
            icon: 'fa-regular:file-code',
            label: '其他数据',
            //auth: 'GatewayManager_last',
            onClick: () => openJsonDrawer(true, record.otherInfo),
            ifShow: record.terminalType === 'WN' || record.terminalType === 'AIR_BOX',
          },
          {
            icon: 'ant-design:delete-outlined',
            label: '删除',
            color: 'error',
            auth: 'GatewayManager_del',
            popConfirm: {
              title: '是否确认删除？',
              placement: 'left',
              confirm: async () => {
                await deleteGateway(record.id);
                reload();
              },
            },
          },
        ]}
      />
    );
  };

  function handleSuccess({ action, values }) {
    if (action == 'edit') {
      updateTableDataRecord(values.id, values);
    } else {
      reload();
    }
  }

  const handleCreate = () => {
    openDrawer(true, {
      actionKey: 'create',
    });
  };
</script>
