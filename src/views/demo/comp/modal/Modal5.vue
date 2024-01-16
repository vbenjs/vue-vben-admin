<template>
  <BasicModal
    v-bind="$attrs"
    title="Modal Title"
    :helpMessage="['提示1', '提示2']"
    width="1000px"
    @fullscreen="onFullscreen"
  >
    <BasicTable @register="registerTable" ref="selectTable" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, nextTick } from 'vue';
  import { BasicModal } from '@/components/Modal';
  import { BasicTable, ColumnChangeParam, useTable } from '@/components/Table';
  import { getBasicColumns } from '../../table/tableData';
  import { demoListApi } from '@/api/demo/table';

  const [registerTable] = useTable({
    canResize: true,
    title: 'useTable示例',
    titleHelpMessage: '使用useTable调用表格内方法',
    api: demoListApi,
    columns: getBasicColumns(),
    defSort: {
      field: 'name',
      order: 'ascend',
    },
    rowKey: 'id',
    showTableSetting: true,
    rowSelection: {
      type: 'checkbox',
    },
    onColumnsChange: (data: ColumnChangeParam[]) => {
      console.log('ColumnsChanged', data);
    },
    showSelectionBar: true, // 显示多选状态栏
  });

  const selectTable = ref<InstanceType<typeof BasicTable> | undefined>();

  const onFullscreen = async () => {
    await nextTick();
    selectTable.value?.redoHeight();
  };
</script>
