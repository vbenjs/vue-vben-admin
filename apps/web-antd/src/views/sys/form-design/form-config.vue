<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Page } from '@vben/common-ui';
import {
  Card, Table, Button, Input, Tag, Select, Popconfirm, message,
} from 'ant-design-vue';
import { sysFormDesignApi } from '#/api/core/sys-manage';

const loading = ref(false);
const dataSource = ref([]);
const pagination = ref({ current: 1, pageSize: 30, total: 0 });
const searchParams = ref({ formName: '', status: undefined });

const columns = [
  { title: '表单名称', dataIndex: 'formName', key: 'formName' },
  { title: '表单类型', dataIndex: 'formType', key: 'formType', width: 100 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 80 },
  { title: '创建人', dataIndex: 'createBy', key: 'createBy', width: 100 },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 160 },
  { title: '操作', key: 'action', width: 170 },
];

const formatDate = (v: string) => (v ? new Date(v).toLocaleString('zh-CN') : '-');

const fetchList = async (page = 1) => {
  try {
    loading.value = true;
    const res = await sysFormDesignApi.getList({
      page, pageSize: pagination.value.pageSize, ...searchParams.value,
    });
    dataSource.value = res?.items || [];
    pagination.value.current = page;
    pagination.value.total = res?.total || 0;
  } finally {
    loading.value = false;
  }
};

const handleDelete = async (id: number) => {
  await sysFormDesignApi.remove(id);
  message.success('删除成功');
  fetchList(pagination.value.current);
};

onMounted(() => fetchList());
</script>

<template>
  <Page title="表单配置" description="动态可视化拖拽构建业务表单，配置字段和布局。">
    <div class="p-4">
      <Card :bordered="false">
        <div class="mb-3 flex gap-3 flex-wrap">
          <Input v-model:value="searchParams.formName" placeholder="表单名称" class="w-40" allowClear />
          <Select v-model:value="searchParams.status" placeholder="状态" class="w-28" allowClear>
            <Select.Option value="0">开启</Select.Option>
            <Select.Option value="1">关闭</Select.Option>
          </Select>
          <Button type="primary" @click="fetchList(1)">查询</Button>
          <Button @click="() => { searchParams.formName = ''; searchParams.status = undefined; fetchList(1); }">重置</Button>
          <Button type="primary" class="ml-auto">+ 新增</Button>
        </div>

        <Table
          :columns="columns"
          :dataSource="dataSource"
          :loading="loading"
          :pagination="pagination"
          @change="(pag) => fetchList(pag.current)"
          rowKey="formId"
          bordered
          size="middle"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'status'">
              <Tag :color="record.status === '0' ? 'success' : 'error'">
                {{ record.status === '0' ? '开启' : '关闭' }}
              </Tag>
            </template>
            <template v-if="column.key === 'formType'">
              <Tag color="processing">{{ record.formType === '0' ? '内置' : '自定义' }}</Tag>
            </template>
            <template v-if="column.key === 'createTime'">{{ formatDate(record.createTime) }}</template>
            <template v-if="column.key === 'action'">
              <Button type="link" size="small">设计表单</Button>
              <Button type="link" size="small">编辑配置</Button>
              <Popconfirm title="确定删除该表单吗？" @confirm="handleDelete(record.formId)">
                <Button type="link" danger size="small">删除</Button>
              </Popconfirm>
            </template>
          </template>
        </Table>
      </Card>
    </div>
  </Page>
</template>
