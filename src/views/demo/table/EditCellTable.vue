<template>
  <div class="p-4">
    <BasicTable @register="registerTable">
      <template #customId>
        <EditTableHeaderIcon title="Id" />
      </template>
      <template #customName>
        <EditTableHeaderIcon title="姓名" />
      </template>
    </BasicTable>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import {
    BasicTable,
    useTable,
    BasicColumn,
    renderEditableCell,
    EditTableHeaderIcon,
  } from '/@/components/Table';

  import { demoListApi } from '/@/api/demo/table';
  const columns: BasicColumn[] = [
    {
      // title: 'ID',
      dataIndex: 'id',
      slots: { title: 'customId' },
      customRender: renderEditableCell({ dataIndex: 'id' }),
    },
    {
      // title: '姓名',
      dataIndex: 'name',
      slots: { title: 'customName' },
      customRender: renderEditableCell({
        dataIndex: 'name',
      }),
    },
    {
      title: '地址',
      dataIndex: 'address',
      sorter: true,
    },
  ];
  export default defineComponent({
    components: { BasicTable, EditTableHeaderIcon },
    setup() {
      const [registerTable] = useTable({
        title: '可编辑单元格示例',
        api: demoListApi,
        columns: columns,
        showIndexColumn: false,
      });

      return {
        registerTable,
      };
    },
  });
</script>
