<template>
  <div class="p-4 flex flex-col">
    <div class="mb-4">
      <a-button class="mr-2" @click="reloadTable"> 还原 </a-button>
      <a-button class="mr-2" @click="changeLoading"> 开启loading </a-button>
      <a-button class="mr-2" @click="changeColumns"> 更改Columns </a-button>
      <a-button class="mr-2" @click="getColumn"> 获取Columns </a-button>
      <a-button class="mr-2" @click="getTableData"> 获取表格数据 </a-button>
      <a-button class="mr-2" @click="getTableRawData"> 获取接口原始数据 </a-button>
      <a-button class="mr-2" @click="setPaginationInfo"> 跳转到第2页 </a-button>
    </div>
    <div class="mb-4">
      <a-button class="mr-2" @click="getSelectRowList"> 获取选中行 </a-button>
      <a-button class="mr-2" @click="getSelectRowKeyList"> 获取选中行Key </a-button>
      <a-button class="mr-2" @click="setSelectedRowKeyList"> 设置选中行 </a-button>
      <a-button class="mr-2" @click="clearSelect"> 清空选中行 </a-button>
      <a-button class="mr-2" @click="getPagination"> 获取分页信息 </a-button>
    </div>
    <BasicTable
      :canResize="true"
      title="RefTable示例"
      titleHelpMessage="使用Ref调用表格内方法"
      ref="tableRef"
      :api="demoListApi"
      :columns="columns"
      rowKey="id"
      :rowSelection="{ type: 'checkbox' }"
      showSelectionBar
    />
  </div>
</template>
<script lang="ts" setup>
  import { ref, unref } from 'vue';
  import { BasicTable, TableActionType } from '@/components/Table';
  import { getBasicColumns, getBasicShortColumns } from './tableData';
  import { useMessage } from '@/hooks/web/useMessage';
  import { demoListApi } from '@/api/demo/table';
  import { type Nullable } from '@vben/types';

  const tableRef = ref<Nullable<TableActionType>>(null);
  const { createMessage } = useMessage();

  const columns = getBasicColumns();

  function getTableAction() {
    const tableAction = unref(tableRef);
    if (!tableAction) {
      throw new Error('tableAction is null');
    }
    return tableAction;
  }
  function changeLoading() {
    getTableAction().setLoading(true);
    setTimeout(() => {
      getTableAction().setLoading(false);
    }, 1000);
  }
  function changeColumns() {
    getTableAction().setProps({
      columns: getBasicShortColumns(),
      rowSelection: {
        type: 'checkbox',
      },
    });
  }
  function reloadTable() {
    getTableAction().setProps({
      columns: getBasicColumns(),
      rowSelection: {
        type: 'checkbox',
      },
    });

    getTableAction().reload({
      page: 1,
    });
  }
  function getColumn() {
    createMessage.info('请在控制台查看！');
    console.log(getTableAction().getColumns());
  }

  function getTableData() {
    createMessage.info('请在控制台查看！');
    console.log(getTableAction().getDataSource());
  }
  function getTableRawData() {
    createMessage.info('请在控制台查看！');
    console.log(getTableAction().getRawDataSource());
  }

  function getPagination() {
    createMessage.info('请在控制台查看！');
    console.log(getTableAction().getPaginationRef());
  }

  function setPaginationInfo() {
    getTableAction().setPagination({
      current: 2,
    });
    getTableAction().reload();
  }
  function getSelectRowList() {
    createMessage.info('请在控制台查看！');
    console.log(getTableAction().getSelectRows());
  }
  function getSelectRowKeyList() {
    createMessage.info('请在控制台查看！');
    console.log(getTableAction().getSelectRowKeys());
  }
  function setSelectedRowKeyList() {
    getTableAction().setSelectedRowKeys(['0', '1', '2']);
  }
  function clearSelect() {
    getTableAction().clearSelectedRowKeys();
  }
</script>
