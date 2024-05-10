<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <BasicUpload :maxNumber="10" emptyHidePreview :api="uploadApi" />
        <Popconfirm
          title="你确定要删除这些数据吗?"
          ok-text="确定"
          cancel-text="取消"
          @confirm="handleDelete"
        >
          <a-button color="error"> 删除 </a-button>
        </Popconfirm>
      </template>

      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'name'">
          <Tooltip>
            <template #title>{{ record.path }}</template>
            <a :href="record.path" target="_blank"> {{ record.name }}</a>
          </Tooltip>
        </template>

        <template v-else-if="column.key === 'path'">
          <Image :src="record.path" />
        </template>
      </template>
    </BasicTable>
  </div>
</template>
<script lang="ts" setup name="存储管理">
  import { ref } from 'vue';
  import { Popconfirm, Image, Tooltip } from 'ant-design-vue';
  import { BasicUpload } from '/@/components/Upload';
  import { BasicTable, useTable } from '/@/components/Table';
  import { getStorageList, deleteStorage } from '/@/api/tools/storage';
  import { uploadApi } from '/@/api/sys/upload';
  import { columns, searchFormSchema } from './storage.data';
  import { Key } from '/@/components/Menu/src/types';

  const checkedKeys = ref<Array<number>>([]);

  const [registerTable, { deleteTableDataRecord }] = useTable({
    title: '存储列表',
    api: getStorageList,
    useSearchForm: true,
    formConfig: {
      labelWidth: 80,
      schemas: searchFormSchema,
      autoSubmitOnEnter: true,
    },
    columns: columns,
    bordered: true,
    striped: false,
    showTableSetting: true,
    showIndexColumn: false,
    rowKey: 'id',
    rowSelection: {
      type: 'checkbox',
      selectedRowKeys: checkedKeys as unknown as Key[],
      onSelect: (record, selected) => {
        if (selected) {
          checkedKeys.value = [...checkedKeys.value, record.id];
        } else {
          checkedKeys.value = checkedKeys.value.filter((id) => id !== record.id);
        }
      },
      onSelectAll: (selected, selectedRows, changeRows) => {
        const changeIds = changeRows.map((item) => item.id);
        if (selected) {
          checkedKeys.value = [...checkedKeys.value, ...changeIds];
        } else {
          checkedKeys.value = checkedKeys.value.filter((id) => {
            return !changeIds.includes(id);
          });
        }
      },
    },
  });

  function handleDelete() {
    if (!(checkedKeys.value.length > 0)) return;

    const ids = checkedKeys.value;
    deleteStorage({ ids: ids });
    deleteTableDataRecord(ids);
    checkedKeys.value.length = 0;
  }
</script>
