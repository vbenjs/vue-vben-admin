<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Page } from '@vben/common-ui';
import {
  Card, Table, Button, Input, Tag, Select, Switch, Popconfirm, message,
} from 'ant-design-vue';
import { sysFormDesignApi } from '#/api/core/sys-manage';

const loading = ref(false);
const dataSource = ref([]);
const pagination = ref({ current: 1, pageSize: 30, total: 0 });
const searchParams = ref({ flowName: '', flowNo: '' });

const columns = [
  { title: '流程名称', dataIndex: 'flowName', key: 'flowName' },
  { title: '流程编号', dataIndex: 'flowNo', key: 'flowNo', width: 140 },
  { title: '流程类型', dataIndex: 'flowType', key: 'flowType', width: 100 },
  { title: '备注', dataIndex: 'remark', key: 'remark' },
  { title: '排序', dataIndex: 'orderNo', key: 'orderNo', width: 70 },
  { title: '是否可用', dataIndex: 'enabled', key: 'enabled', width: 90 },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 160 },
  { title: '修改时间', dataIndex: 'updateTime', key: 'updateTime', width: 160 },
  { title: '操作', key: 'action', width: 160 },
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
  <Page title="流程管理" description="维护业务流程定义、流程表单和流程配置。">
    <div class="p-4">
      <Card :bordered="false">
        <div class="mb-3 flex gap-3 flex-wrap">
          <Input v-model:value="searchParams.flowName" placeholder="流程名称" class="w-40" allowClear />
          <Input v-model:value="searchParams.flowNo" placeholder="流程编号" class="w-40" allowClear />
          <Button type="primary" @click="fetchList(1)">查询</Button>
          <Button @click="() => { searchParams.flowName = ''; searchParams.flowNo = ''; fetchList(1); }">重置</Button>
          <Button type="primary" class="ml-auto">+ 新建</Button>
          <Button>编辑</Button>
          <Button>复制</Button>
          <Popconfirm title="确定删除选中的流程吗？">
            <Button danger ghost>删除</Button>
          </Popconfirm>
          <Button>导出</Button>
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
            <template v-if="column.key === 'flowType'">
              <Tag color="processing">{{ record.formType === '0' ? '内置' : '自定义' }}</Tag>
            </template>
            <template v-if="column.key === 'enabled'">
              <Switch :checked="record.status === '0'" size="small" disabled />
            </template>
            <template v-if="column.key === 'createTime'">{{ formatDate(record.createTime) }}</template>
            <template v-if="column.key === 'updateTime'">{{ formatDate(record.updateTime) }}</template>
            <template v-if="column.key === 'action'">
              <Button type="link" size="small">流程表单</Button>
              <Button type="link" size="small">流程配置</Button>
            </template>
          </template>
        </Table>
      </Card>
    </div>
  </Page>
</template>
