<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Page } from '@vben/common-ui';
import { Card, Table, Button, Input, Tag } from 'ant-design-vue';
import { sysMenuApi } from '#/api/core/sys-manage';

const loading = ref(false);
const dataSource = ref([]);
const searchParams = ref({ menuName: '' });

const columns = [
  { title: '菜单名称', dataIndex: 'menuName', key: 'menuName' },
  { title: '图标', dataIndex: 'icon', key: 'icon' },
  { title: '排序', dataIndex: 'orderNum', key: 'orderNum' },
  { title: '权限标识', dataIndex: 'perms', key: 'perms' },
  { title: '组件路径', dataIndex: 'component', key: 'component' },
  { title: '状态', dataIndex: 'status', key: 'status' },
  { title: '操作', key: 'action', width: 250 }
];

const fetchList = async () => {
  try {
    loading.value = true;
    const res = await sysMenuApi.getList({ ...searchParams.value });
    // 后端返回平铺数据，通常这里需要 listToTree 函数转成树结构给 Table 显示。
    dataSource.value = res || [];
  } finally {
    loading.value = false;
  }
};

onMounted(() => fetchList());
</script>

<template>
  <Page title="菜单管理" description="系统左侧导航菜单、页面操作按钮的权限配置。">
    <div class="p-4">
      <Card :bordered="false">
        <div class="mb-4 flex gap-4">
          <Input v-model:value="searchParams.menuName" placeholder="菜单名称" class="w-64" allowClear />
          <Button type="primary" @click="fetchList">查询</Button>
          <Button @click="() => { searchParams.menuName = ''; fetchList(); }">重置</Button>
          <Button type="primary" ghost class="ml-auto">新增菜单</Button>
        </div>
        <Table 
          :columns="columns" 
          :dataSource="dataSource" 
          :loading="loading" 
          :pagination="false"
          rowKey="menuId"
          bordered
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'status'">
              <Tag :color="record.status === '0' ? 'success' : 'error'">
                {{ record.status === '0' ? '正常' : '隐藏' }}
              </Tag>
            </template>
            <template v-if="column.key === 'action'">
              <Button type="link" size="small">新增子菜单</Button>
              <Button type="link" size="small">编辑</Button>
              <Button type="link" danger size="small">删除</Button>
            </template>
          </template>
        </Table>
      </Card>
    </div>
  </Page>
</template>
