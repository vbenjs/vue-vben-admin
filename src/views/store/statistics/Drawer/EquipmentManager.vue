<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    title="分组设备管理"
    :width="980"
    destroyOnClose
  >
    <BasicTable @register="registerTable">
      <template #tableTitle>
        <a-button type="primary" preIcon="ant-design:plus-outlined" @click="handleCreate">
          添加设备
        </a-button>

        <a-button class="ml-2" @click="handleStatistics" v-auth="'StoreStatistics_chart'">
          分组统计
        </a-button>
      </template>
    </BasicTable>
    <SelectEquipment @register="registerSelectDrawer" @success="handleSuccess" />
  </BasicDrawer>
</template>
<script lang="tsx" setup>
  import { addStoreGroupMember, deleteStoreGroupMember, getStoreGroupMember } from '@/api/group';
  import { BasicDrawer, useDrawer, useDrawerInner } from '@/components/Drawer';
  import { BasicTable, TableAction, useTable } from '@/components/Table';
  import { ref } from 'vue';
  import { createAsyncComponent } from '@/utils/factory/createAsyncComponent';
  import { EquipmentResult } from '@/api/model/equipmentModel';
  import { message } from 'ant-design-vue';
  import { groupStatistics } from '../data';

  const SelectEquipment = createAsyncComponent(() => import('@/views/Drawers/SelectEquipment.vue'));

  const groupId = ref<number>(0);
  const storeId = ref(0);

  const emit = defineEmits(['load', 'register']);
  const [registerSelectDrawer, { openDrawer }] = useDrawer();

  const [registerTable, { reload }] = useTable({
    api: () => getStoreGroupMember(groupId.value),
    columns: [
      { dataIndex: 'equipmentName', title: '设备名称', width: 120 },
      { dataIndex: 'workingAmpere', title: '工作电流(A)', width: 110 },
      { dataIndex: 'electricalEnergy', title: '总耗电量(kW·h)', width: 130 },
      {
        dataIndex: 'workingHours',
        title: '工作时长(小时)',
        width: 130,
        customRender: ({ text }) => (text ? (text / 3600).toFixed(2) : ''),
      },
    ],
    rowKey: 'id',
    loading: true,
    showIndexColumn: false,
    showTableSetting: true,
    pagination: { hideOnSinglePage: true },
    actionColumn: {
      width: 60,
      title: '操作',
      dataIndex: 'action',
      customRender: ({ record }) => {
        return (
          <TableAction
            stopButtonPropagation
            actions={[
              {
                icon: 'ant-design:delete-outlined',
                color: 'error',
                popConfirm: {
                  title: '是否确认删除？',
                  placement: 'left',
                  confirm: handleDelete.bind(null, record.groupMemberId),
                },
              },
            ]}
          />
        );
      },
    },
  });

  const [registerDrawer] = useDrawerInner(async (data) => {
    groupId.value = data.id;
    storeId.value = data.storeId;
    emit('load');
  });

  const handleCreate = () => {
    openDrawer(true, {
      storeId: storeId.value,
      key: 'bind',
    });
  };

  const handleDelete = async (id: number) => {
    await deleteStoreGroupMember(id);
    reload();
  };

  const handleSuccess = async (array: EquipmentResult[]) => {
    const equipmentIds = array.map((item) => item.id);

    await addStoreGroupMember({
      groupId: groupId.value,
      equipmentIds,
    });

    message.success('添加成功！');
    reload();
  };

  const handleStatistics = () => {
    groupStatistics(groupId.value);
  };
</script>
