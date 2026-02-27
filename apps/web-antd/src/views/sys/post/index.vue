<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Page } from '@vben/common-ui';
import { Card, Table, Button, Input } from 'ant-design-vue';
import { sysPostApi } from '#/api/core/sys-manage';

const loading = ref(false);
const dataSource = ref([]);
const pagination = ref({ current: 1, pageSize: 10, total: 0 });
const searchParams = ref({ postName: '', postCode: '' });

const columns = [
  { title: '岗位编码', dataIndex: 'postCode', key: 'postCode' },
  { title: '岗位名称', dataIndex: 'postName', key: 'postName' },
  { title: '排序', dataIndex: 'postSort', key: 'postSort' },
  { title: '状态', dataIndex: 'status', key: 'status' },
  { title: '操作', key: 'action', width: 150 }
];

const fetchList = async (page = 1) => {
  try {
    loading.value = true;
    const res = await sysPostApi.getList({ page, pageSize: pagination.value.pageSize, ...searchParams.value });
    dataSource.value = res?.items || [];
    pagination.value.current = page;
    pagination.value.total = res?.total || 0;
  } finally {
    loading.value = false;
  }
};

onMounted(() => fetchList());
</script>

<template>
  <Page title="岗位管理" description="维护公司用户所在岗位/职级。">
    <div class="p-4">
      <Card :bordered="false">
        <div class="mb-4 flex gap-4">
          <Input v-model:value="searchParams.postCode" placeholder="岗位编码" class="w-48" allowClear />
          <Input v-model:value="searchParams.postName" placeholder="岗位名称" class="w-48" allowClear />
          <Button type="primary" @click="fetchList(1)">查询</Button>
          <Button @click="() => { searchParams.postName = ''; searchParams.postCode = ''; fetchList(1); }">重置</Button>
          <Button type="primary" ghost class="ml-auto">新增岗位</Button>
        </div>
        <Table 
          :columns="columns" 
          :dataSource="dataSource" 
          :loading="loading" 
          :pagination="pagination"
          @change="(pag) => fetchList(pag.current)"
          rowKey="postId"
          bordered
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'action'">
              <Button type="link" size="small">编辑</Button>
              <Button type="link" danger size="small">删除</Button>
            </template>
          </template>
        </Table>
      </Card>
    </div>
  </Page>
</template>
