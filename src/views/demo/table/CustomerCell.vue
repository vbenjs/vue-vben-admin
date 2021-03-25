<template>
  <div class="p-4">
    <BasicTable @register="registerTable">
      <template #id="{ record }"> ID: {{ record.id }} </template>
      <template #no="{ record }">
        <Tag color="green">
          {{ record.no }}
        </Tag>
      </template>
      <template #img>
        <TableImg
          :imgList="['https://picsum.photos/id/66/346/216', 'https://picsum.photos/id/67/346/216']"
        />
      </template>

      <template #category="{ record }">
        <Tag color="green">
          {{ record.no }}
        </Tag>
      </template>
    </BasicTable>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicTable, useTable, BasicColumn, TableImg } from '/@/components/Table';
  import { Tag } from 'ant-design-vue';
  import { demoListApi } from '/@/api/demo/table';
  const columns: BasicColumn[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      slots: { customRender: 'id' },
    },
    {
      title: '分类',
      dataIndex: 'category',
      width: 80,
      align: 'center',
      defaultHidden: true,
      slots: { customRender: 'category' },
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width: 120,
    },
    {
      title: '头像',
      dataIndex: 'img',
      width: 120,
      slots: { customRender: 'img' },
    },
    {
      title: '地址',
      dataIndex: 'address',
    },
    {
      title: '编号',
      dataIndex: 'no',
      slots: { customRender: 'no' },
    },
    {
      title: '开始时间',
      dataIndex: 'beginTime',
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
    },
  ];
  export default defineComponent({
    components: { BasicTable, TableImg, Tag },
    setup() {
      const [registerTable] = useTable({
        title: '自定义列内容',
        api: demoListApi,
        columns: columns,
        bordered: true,
        showTableSetting: true,
      });

      return {
        registerTable,
      };
    },
  });
</script>
