<template>
  <div class="p-4">
    <BasicTable @register="registerTable">
      <template #id="{ record }"> ID: {{ record.id }} </template>
      <template #no="{ record }">
        <Tag color="green">
          {{ record.no }}
        </Tag>
      </template>
      <template #avatar="{ record }">
        <Avatar
          :size="60"
          :src="'http://api.btstu.cn/sjtx/api.php?lx=c1&format=images&id=' + record.id"
        />
      </template>
      <template #img>
        <TableImg
          :size="60"
          :simpleShow="true"
          :imgList="[
            'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?1622962250222',
            'https://picsum.photos/id/66/346/216',
            'https://picsum.photos/id/67/346/216',
          ]"
        />
      </template>
      <template #imgs>
        <TableImg
          :size="60"
          :imgList="[
            'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?1622962250222',
            'https://picsum.photos/id/66/346/216',
            'https://picsum.photos/id/67/346/216',
          ]"
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
  import { Tag, Avatar } from 'ant-design-vue';
  import { demoListApi } from '/@/api/demo/table';
  const columns: BasicColumn[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      slots: { customRender: 'id' },
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      width: 100,
      slots: { customRender: 'avatar' },
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
      title: '图片列表1',
      dataIndex: 'img',
      helpMessage: ['这是简单模式的图片列表', '只会显示一张在表格中', '但点击可预览多张图片'],
      width: 140,
      slots: { customRender: 'img' },
    },
    {
      title: '照片列表2',
      dataIndex: 'imgs',
      width: 160,
      slots: { customRender: 'imgs' },
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
    components: { BasicTable, TableImg, Tag, Avatar },
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
