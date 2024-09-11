<template>
  <div class="p-4">
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record, text }">
        <template v-if="column.key === 'id'"> ID: {{ record.id }} </template>
        <template v-else-if="column.key === 'no'">
          <Tag color="green">
            {{ record.no }}
          </Tag>
        </template>
        <template v-else-if="column.key === 'avatar'">
          <Avatar :size="60" :src="record.avatar" />
        </template>
        <template v-else-if="column.key === 'imgArr'">
          <TableImg :size="60" :simpleShow="true" :imgList="text" />
        </template>
        <template v-else-if="column.key === 'imgs'">
          <TableImg :size="60" :imgList="text" />
        </template>

        <template v-else-if="column.key === 'category'">
          <Tag color="green">
            {{ record.no }}
          </Tag>
        </template>
      </template>
    </BasicTable>
  </div>
</template>
<script lang="tsx" setup>
  import { h } from 'vue';
  import { BasicTable, useTable, BasicColumn, TableImg } from '@/components/Table';
  import { Tag, Avatar } from 'ant-design-vue';
  import { demoListApi } from '@/api/demo/table';

  const columns: BasicColumn[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      helpMessage: <div>这个是tsx渲染出来的helpMessage</div>,
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      width: 100,
      helpMessage: h('div', '这是vue h函数渲染出来的helpMessage'),
    },
    {
      title: '分类',
      dataIndex: 'category',
      width: 80,
      align: 'center',
      defaultHidden: true,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width: 120,
    },
    {
      title: '图片列表1',
      dataIndex: 'imgArr',
      helpMessage: ['这是简单模式的图片列表', '只会显示一张在表格中', '但点击可预览多张图片'],
      width: 140,
    },
    {
      title: '照片列表2',
      dataIndex: 'imgs',
      width: 160,
    },
    {
      title: '地址',
      dataIndex: 'address',
    },
    {
      title: '编号',
      dataIndex: 'no',
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

  const [registerTable] = useTable({
    title: '自定义列内容',
    titleHelpMessage: '表格中所有头像、图片均为mock生成，仅用于演示图片占位',
    api: demoListApi,
    columns: columns,
    bordered: true,
    showTableSetting: true,
  });
</script>
