<script setup lang="ts">
import { onMounted } from 'vue';
import { Page } from '@vben/common-ui';
import { Button, Card, Form, Input, InputNumber, Modal, Popconfirm, Select, Table } from 'ant-design-vue';
import { indicatorTransferApi } from '#/api/core/sys-manage';
import StatusTag from '#/components/StatusTag/index.vue';
import { useCrudTable } from '#/composables/useCrudTable';

const defaultFormState = {
  transferNo: '', transferTotalAmount: 0,
  outDeptName: '', outIndicatorName: '', outTransferAmount: 0,
  inDeptName: '', inIndicatorName: '', inTransferAmount: 0,
  operatorName: '', status: '0', remark: '',
};

const { loading, dataSource, pagination, isModalVisible, submitting, formRef, formState,
  fetchList, openModal, handleSubmit, handleDelete, onTableChange,
} = useCrudTable({ api: indicatorTransferApi, rowKey: 'id', defaultFormState, messages: {
  createSuccess: '新增调剂成功', updateSuccess: '更新调剂成功', deleteSuccess: '删除调剂成功',
}});

const searchParams = { transferNo: '', outDeptName: '', status: undefined as string | undefined };
const formatAmount = (v: number | string) => Number(v || 0).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const columns = [
  { title: '调剂单号', dataIndex: 'transferNo', key: 'transferNo', width: 140 },
  { title: '调剂总额', dataIndex: 'transferTotalAmount', key: 'transferTotalAmount', width: 120 },
  { title: '调出部门', dataIndex: 'outDeptName', key: 'outDeptName', width: 120 },
  { title: '调出指标', dataIndex: 'outIndicatorName', key: 'outIndicatorName', width: 160 },
  { title: '调出金额', dataIndex: 'outTransferAmount', key: 'outTransferAmount', width: 110 },
  { title: '调入部门', dataIndex: 'inDeptName', key: 'inDeptName', width: 120 },
  { title: '调入指标', dataIndex: 'inIndicatorName', key: 'inIndicatorName', width: 160 },
  { title: '调入金额', dataIndex: 'inTransferAmount', key: 'inTransferAmount', width: 110 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 90 },
  { title: '操作', key: 'action', width: 180 },
];

const doFetch = () => fetchList(1, searchParams);
const resetFilters = () => { searchParams.transferNo = ''; searchParams.outDeptName = ''; searchParams.status = undefined; doFetch(); };
onMounted(() => doFetch());
</script>

<template>
  <Page>
    <div class="p-4">
      <Card :bordered="false">
        <div class="mb-4 flex flex-wrap gap-3">
          <Input v-model:value="searchParams.transferNo" placeholder="调剂单号" class="w-48" allow-clear />
          <Input v-model:value="searchParams.outDeptName" placeholder="调出部门" class="w-36" allow-clear />
          <Select v-model:value="searchParams.status" placeholder="状态" class="w-28" allow-clear>
            <Select.Option value="0">正常</Select.Option><Select.Option value="1">停用</Select.Option>
          </Select>
          <Button type="primary" @click="doFetch">查询</Button>
          <Button @click="resetFilters">重置</Button>
          <Button type="primary" class="ml-auto" @click="openModal()">+ 新增</Button>
        </div>
        <Table :columns="columns" :data-source="dataSource" :loading="loading" :pagination="pagination"
          @change="onTableChange" row-key="id" bordered size="middle" :scroll="{ x: 1400 }">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'transferTotalAmount'">{{ formatAmount(record.transferTotalAmount) }}</template>
            <template v-if="column.key === 'outTransferAmount'">{{ formatAmount(record.outTransferAmount) }}</template>
            <template v-if="column.key === 'inTransferAmount'">{{ formatAmount(record.inTransferAmount) }}</template>
            <template v-if="column.key === 'status'"><StatusTag :status="record.status" /></template>
            <template v-if="column.key === 'action'">
              <Button type="link" size="small" @click="openModal(record)">编辑</Button>
              <Popconfirm title="确定删除吗？" @confirm="handleDelete(record.id)">
                <Button type="link" danger size="small">删除</Button>
              </Popconfirm>
            </template>
          </template>
        </Table>
      </Card>
      <Modal v-model:open="isModalVisible" :title="formState.id ? '编辑调剂' : '新增调剂'"
        @ok="handleSubmit()" :confirm-loading="submitting" destroy-on-close width="800px">
        <Form ref="formRef" :model="formState" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }" class="mt-4">
          <div class="grid grid-cols-2 gap-x-4">
            <Form.Item label="调剂单号" name="transferNo"><Input v-model:value="formState.transferNo" /></Form.Item>
            <Form.Item label="调剂总额" name="transferTotalAmount"><InputNumber v-model:value="formState.transferTotalAmount" class="w-full" :min="0" /></Form.Item>
            <Form.Item label="调出部门" name="outDeptName"><Input v-model:value="formState.outDeptName" /></Form.Item>
            <Form.Item label="调出指标" name="outIndicatorName"><Input v-model:value="formState.outIndicatorName" /></Form.Item>
            <Form.Item label="调出金额" name="outTransferAmount"><InputNumber v-model:value="formState.outTransferAmount" class="w-full" :min="0" /></Form.Item>
            <Form.Item label="调入部门" name="inDeptName"><Input v-model:value="formState.inDeptName" /></Form.Item>
            <Form.Item label="调入指标" name="inIndicatorName"><Input v-model:value="formState.inIndicatorName" /></Form.Item>
            <Form.Item label="调入金额" name="inTransferAmount"><InputNumber v-model:value="formState.inTransferAmount" class="w-full" :min="0" /></Form.Item>
            <Form.Item label="操作人" name="operatorName"><Input v-model:value="formState.operatorName" /></Form.Item>
          </div>
          <Form.Item label="备注" name="remark"><Input.TextArea v-model:value="formState.remark" :rows="3" /></Form.Item>
        </Form>
      </Modal>
    </div>
  </Page>
</template>
