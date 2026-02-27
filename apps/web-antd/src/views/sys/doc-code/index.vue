<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Page } from '@vben/common-ui';
import { Card, Table, Button, Input } from 'ant-design-vue';
import { sysDocCodeApi } from '#/api/core/sys-manage';

const loading = ref(false);
const dataSource = ref([]);
const pagination = ref({ current: 1, pageSize: 10, total: 0 });
const searchParams = ref({ ruleCode: '', ruleName: '' });

const columns = [
  { title: '规则编码', dataIndex: 'ruleCode', key: 'ruleCode' },
  { title: '规则名称', dataIndex: 'ruleName', key: 'ruleName' },
  { title: '前缀', dataIndex: 'prefix', key: 'prefix' },
  { title: '日期格式', dataIndex: 'dateFormat', key: 'dateFormat' },
  { title: '流水号长度', dataIndex: 'serialLen', key: 'serialLen' },
  { title: '当前流水号', dataIndex: 'currentVal', key: 'currentVal' },
  { title: '步长', dataIndex: 'step', key: 'step' },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
  { title: '操作', key: 'action', width: 150 }
];

const fetchList = async (page = 1) => {
  try {
    loading.value = true;
    const res = await sysDocCodeApi.getList({ page, pageSize: pagination.value.pageSize, ...searchParams.value });
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
  <Page title="单据编码" description="自动生成流水账单编号和规则管理。">
    <div class="p-4">
      <Card :bordered="false">
        <div class="mb-4 flex gap-4">
          <Input v-model:value="searchParams.ruleCode" placeholder="规则编码" class="w-48" allowClear />
          <Input v-model:value="searchParams.ruleName" placeholder="规则名称" class="w-48" allowClear />
          <Button type="primary" @click="fetchList(1)">查询</Button>
          <Button @click="() => { searchParams.ruleCode = ''; searchParams.ruleName = ''; fetchList(1); }">重置</Button>
          <Button type="primary" ghost class="ml-auto">新增单据编码</Button>
        </div>
        <Table 
          :columns="columns" 
          :dataSource="dataSource" 
          :loading="loading" 
          :pagination="pagination"
          @change="(pag) => fetchList(pag.current)"
          rowKey="id"
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
