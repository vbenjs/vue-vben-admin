<script setup lang="ts">
import { onMounted } from 'vue';
import { Page } from '@vben/common-ui';
import { Button, Card, Form, Input, InputNumber, Modal, Popconfirm, Select, Table } from 'ant-design-vue';
import { indicatorAuthApi } from '#/api/core/sys-manage';
import StatusTag from '#/components/StatusTag/index.vue';
import { useCrudTable } from '#/composables/useCrudTable';

const defaultFormState = {
  indicatorId: undefined, authType: '1', authDeptName: '', authUserName: '',
  authAmount: 0, usedAmount: 0, controlMode: '1', status: '0', remark: '',
};

const { loading, dataSource, pagination, isModalVisible, submitting, formRef, formState,
  fetchList, openModal, handleSubmit, handleDelete, onTableChange,
} = useCrudTable({ api: indicatorAuthApi, rowKey: 'id', defaultFormState, messages: {
  createSuccess: '新增授权成功', updateSuccess: '更新授权成功', deleteSuccess: '删除授权成功',
}});

const searchParams = { authDeptName: '', status: undefined as string | undefined };
const formatAmount = (v: number | string) => Number(v || 0).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const columns = [
  { title: '授权类型', dataIndex: 'authType', key: 'authType', width: 100 },
  { title: '授权部门', dataIndex: 'authDeptName', key: 'authDeptName', width: 140 },
  { title: '授权人', dataIndex: 'authUserName', key: 'authUserName', width: 120 },
  { title: '授权金额', dataIndex: 'authAmount', key: 'authAmount', width: 120 },
  { title: '已使用', dataIndex: 'usedAmount', key: 'usedAmount', width: 110 },
  { title: '控制方式', dataIndex: 'controlMode', key: 'controlMode', width: 100 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 90 },
  { title: '操作', key: 'action', width: 180 },
];

const doFetch = () => fetchList(1, searchParams);
const resetFilters = () => { searchParams.authDeptName = ''; searchParams.status = undefined; doFetch(); };
onMounted(() => doFetch());
</script>

<template>
  <Page>
    <div class="p-4">
      <Card :bordered="false">
        <div class="mb-4 flex flex-wrap gap-3">
          <Input v-model:value="searchParams.authDeptName" placeholder="授权部门" class="w-48" allow-clear />
          <Select v-model:value="searchParams.status" placeholder="状态" class="w-28" allow-clear>
            <Select.Option value="0">正常</Select.Option><Select.Option value="1">停用</Select.Option>
          </Select>
          <Button type="primary" @click="doFetch">查询</Button>
          <Button @click="resetFilters">重置</Button>
          <Button type="primary" class="ml-auto" @click="openModal()">+ 新增</Button>
        </div>
        <Table :columns="columns" :data-source="dataSource" :loading="loading" :pagination="pagination"
          @change="onTableChange" row-key="id" bordered size="middle" :scroll="{ x: 1000 }">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'authType'">{{ record.authType === '1' ? '部门' : '个人' }}</template>
            <template v-if="column.key === 'authAmount'">{{ formatAmount(record.authAmount) }}</template>
            <template v-if="column.key === 'usedAmount'">{{ formatAmount(record.usedAmount) }}</template>
            <template v-if="column.key === 'controlMode'">{{ record.controlMode === '1' ? '严格' : '宽松' }}</template>
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
      <Modal v-model:open="isModalVisible" :title="formState.id ? '编辑授权' : '新增授权'"
        @ok="handleSubmit()" :confirm-loading="submitting" destroy-on-close width="700px">
        <Form ref="formRef" :model="formState" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }" class="mt-4">
          <div class="grid grid-cols-2 gap-x-4">
            <Form.Item label="授权类型" name="authType">
              <Select v-model:value="formState.authType"><Select.Option value="1">部门授权</Select.Option><Select.Option value="2">个人授权</Select.Option></Select>
            </Form.Item>
            <Form.Item label="授权部门" name="authDeptName"><Input v-model:value="formState.authDeptName" /></Form.Item>
            <Form.Item label="授权人" name="authUserName"><Input v-model:value="formState.authUserName" /></Form.Item>
            <Form.Item label="授权金额" name="authAmount" :rules="[{ required: true, message: '请输入授权金额' }]"><InputNumber v-model:value="formState.authAmount" class="w-full" :min="0" /></Form.Item>
            <Form.Item label="已使用" name="usedAmount"><InputNumber v-model:value="formState.usedAmount" class="w-full" :min="0" /></Form.Item>
            <Form.Item label="控制方式" name="controlMode">
              <Select v-model:value="formState.controlMode"><Select.Option value="1">严格控制</Select.Option><Select.Option value="2">宽松控制</Select.Option></Select>
            </Form.Item>
            <Form.Item label="状态" name="status">
              <Select v-model:value="formState.status"><Select.Option value="0">正常</Select.Option><Select.Option value="1">停用</Select.Option></Select>
            </Form.Item>
          </div>
          <Form.Item label="备注" name="remark"><Input.TextArea v-model:value="formState.remark" :rows="3" /></Form.Item>
        </Form>
      </Modal>
    </div>
  </Page>
</template>
