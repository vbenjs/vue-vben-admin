<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import {
  Button,
  Card,
  Descriptions,
  Input,
  message,
  Modal,
  Popconfirm,
  Select,
  Table,
  Tag,
} from 'ant-design-vue';

import { sysOperLogApi } from '#/api/core/sys-manage';

const loading = ref(false);
const dataSource = ref([]);
const pagination = ref({ current: 1, pageSize: 10, total: 0 });
const searchParams = ref({ title: '', operName: '', status: undefined });

const columns = [
  { title: '系统模块', dataIndex: 'title', key: 'title' },
  { title: '操作人员', dataIndex: 'operName', key: 'operName', width: 100 },
  { title: '主机', dataIndex: 'operIp', key: 'operIp', width: 120 },
  { title: '操作地点', dataIndex: 'operLocation', key: 'operLocation' },
  { title: '状态', dataIndex: 'status', key: 'status', width: 80 },
  { title: '操作日期', dataIndex: 'operTime', key: 'operTime', width: 160 },
  { title: '消耗(ms)', dataIndex: 'costTime', key: 'costTime', width: 90 },
  { title: '操作', key: 'action', width: 110 },
];

const fetchList = async (page = 1) => {
  try {
    loading.value = true;
    const res = await sysOperLogApi.getList({
      page,
      pageSize: pagination.value.pageSize,
      ...searchParams.value,
    });
    dataSource.value = res?.items || [];
    pagination.value.current = page;
    pagination.value.total = res?.total || 0;
  } finally {
    loading.value = false;
  }
};

const handleClean = async () => {
  await sysOperLogApi.clean();
  message.success('清空日志成功');
  fetchList(1);
};

const handleDelete = async (id: number | string) => {
  await sysOperLogApi.remove(id);
  message.success('删除成功');
  fetchList(pagination.value.current);
};

const isDetailModalVisible = ref(false);
const detailData = ref<any>({});

const openDetailModal = async (record: any) => {
  try {
    const res = await sysOperLogApi.getById(record.operId);
    detailData.value = res || record;
    isDetailModalVisible.value = true;
  } catch (error) {
    console.error(error);
  }
};

const formatDate = (v: string) =>
  v ? new Date(v).toLocaleString('zh-CN') : '-';

onMounted(() => fetchList());
</script>

<template>
  <Page>
    <div class="p-4">
      <Card :bordered="false">
        <div class="mb-3 flex flex-wrap gap-3">
          <Input
            v-model:value="searchParams.title"
            placeholder="系统模块"
            class="w-36"
            allow-clear
          />
          <Input
            v-model:value="searchParams.operName"
            placeholder="操作人员"
            class="w-36"
            allow-clear
          />
          <Select
            v-model:value="searchParams.status"
            placeholder="状态"
            class="w-28"
            allow-clear
          >
            <Select.Option :value="0">成功</Select.Option>
            <Select.Option :value="1">失败</Select.Option>
          </Select>
          <Button type="primary" @click="fetchList(1)">查询</Button>
          <Button
            @click="
              () => {
                searchParams.title = '';
                searchParams.operName = '';
                searchParams.status = undefined;
                fetchList(1);
              }
            "
          >
            重置
          </Button>
          <Popconfirm
            title="确认清空所有操作日志吗？此操作无法恢复。"
            @confirm="handleClean"
          >
            <Button type="primary" danger ghost class="ml-auto">
              清空日志
            </Button>
          </Popconfirm>
        </div>

        <Table
          :columns="columns"
          :data-source="dataSource"
          :loading="loading"
          :pagination="pagination"
          @change="(pag) => fetchList(pag.current)"
          row-key="operId"
          bordered
          size="middle"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'status'">
              <Tag :color="record.status === 0 ? 'success' : 'error'">
                {{ record.status === 0 ? '成功' : '失败' }}
              </Tag>
            </template>
            <template v-if="column.key === 'operTime'">
              {{ formatDate(record.operTime) }}
            </template>
            <template v-if="column.key === 'action'">
              <Button type="link" size="small" @click="openDetailModal(record)">
                详细
              </Button>
              <Popconfirm
                title="确定删除这日志吗？"
                @confirm="handleDelete(record.operId)"
              >
                <Button type="link" danger size="small">删除</Button>
              </Popconfirm>
            </template>
          </template>
        </Table>
      </Card>

      <!-- 日志详细弹窗 -->
      <Modal
        v-model:open="isDetailModalVisible"
        title="操作日志详细"
        footer=""
        width="800px"
        destroy-on-close
      >
        <Descriptions bordered :column="2" size="small" class="mt-4">
          <Descriptions.Item label="系统模块">
            {{ detailData.title }}
          </Descriptions.Item>
          <Descriptions.Item label="操作人员">
            {{ detailData.operName }}
          </Descriptions.Item>
          <Descriptions.Item label="操作来源主机">
            {{ detailData.operIp }}
          </Descriptions.Item>
          <Descriptions.Item label="操作地点">
            {{ detailData.operLocation }}
          </Descriptions.Item>
          <Descriptions.Item label="操作方法" :span="2">
            <span class="break-all">{{ detailData.method }}</span>
          </Descriptions.Item>
          <Descriptions.Item label="请求方式">
            {{ detailData.requestMethod }}
          </Descriptions.Item>
          <Descriptions.Item label="操作状态">
            <Tag :color="detailData.status === 0 ? 'success' : 'error'">
              {{ detailData.status === 0 ? '成功' : '失败' }}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="操作URL" :span="2">
            {{ detailData.operUrl }}
          </Descriptions.Item>
          <Descriptions.Item label="消耗时间">
            {{ detailData.costTime }} 毫秒
          </Descriptions.Item>
          <Descriptions.Item label="操作时间">
            {{ detailData.operTime }}
          </Descriptions.Item>
          <Descriptions.Item label="操作参数" :span="2">
            <div
              class="max-h-40 w-full select-text overflow-y-auto break-all rounded bg-gray-50 p-2 text-xs"
            >
              {{ detailData.operParam }}
            </div>
          </Descriptions.Item>
          <Descriptions.Item label="返回参数" :span="2">
            <div
              class="max-h-40 w-full select-text overflow-y-auto break-all rounded bg-gray-50 p-2 text-xs"
            >
              {{ detailData.jsonResult }}
            </div>
          </Descriptions.Item>
          <Descriptions.Item
            label="错误消息"
            :span="2"
            v-if="detailData.status === 1"
          >
            <div
              class="max-h-40 w-full select-text overflow-y-auto break-all rounded bg-red-50 p-2 text-xs text-red-500"
            >
              {{ detailData.errorMsg }}
            </div>
          </Descriptions.Item>
        </Descriptions>
      </Modal>
    </div>
  </Page>
</template>
