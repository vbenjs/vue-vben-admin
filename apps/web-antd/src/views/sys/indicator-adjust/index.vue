<script setup lang="ts">
import { onMounted } from 'vue';
import { Page } from '@vben/common-ui';
import { Button, Card, Form, Input, InputNumber, Modal, Popconfirm, Select, Table, Tag } from 'ant-design-vue';
import { indicatorAdjustApi } from '#/api/core/sys-manage';
import { useCrudTable } from '#/composables/useCrudTable';

const defaultFormState = {
  adjustNo: '', indicatorName: '', indicatorCode: '', deptName: '',
  adjustType: '1', adjustAmount: 0, operatorName: '', isVoid: '0', status: '0', remark: '',
};

const { loading, dataSource, pagination, isModalVisible, submitting, formRef, formState,
  fetchList, openModal, handleSubmit, handleDelete, onTableChange,
} = useCrudTable({ api: indicatorAdjustApi, rowKey: 'id', defaultFormState, messages: {
  createSuccess: '新增调整成功', updateSuccess: '更新调整成功', deleteSuccess: '删除调整成功',
}});

const searchParams = { indicatorName: '', deptName: '', adjustType: undefined as string | undefined, status: undefined as string | undefined };
const formatAmount = (v: number | string) => Number(v || 0).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const columns = [
  { title: '调整单号', dataIndex: 'adjustNo', key: 'adjustNo', width: 140 },
  { title: '指标名称', dataIndex: 'indicatorName', key: 'indicatorName', width: 200 },
  { title: '部门', dataIndex: 'deptName', key: 'deptName', width: 120 },
  { title: '类型', dataIndex: 'adjustType', key: 'adjustType', width: 100 },
  { title: '调整金额', dataIndex: 'adjustAmount', key: 'adjustAmount', width: 120 },
  { title: '操作人', dataIndex: 'operatorName', key: 'operatorName', width: 100 },
  { title: '作废', dataIndex: 'isVoid', key: 'isVoid', width: 80 },
  { title: '操作', key: 'action', width: 180 },
];

const doFetch = () => fetchList(1, searchParams);
const resetFilters = () => { searchParams.indicatorName = ''; searchParams.deptName = ''; searchParams.adjustType = undefined; searchParams.status = undefined; doFetch(); };
onMounted(() => doFetch());
</script>

<template>
  <Page>
    <div class="p-4">
      <Card :bordered="false">
        <div class="mb-4 flex flex-wrap gap-3">
          <Input v-model:value="searchParams.indicatorName" placeholder="指标名称" class="w-48" allow-clear />
          <Input v-model:value="searchParams.deptName" placeholder="部门" class="w-36" allow-clear />
          <Select v-model:value="searchParams.adjustType" placeholder="调整类型" class="w-32" allow-clear>
            <Select.Option value="1">追加</Select.Option><Select.Option value="2">追减</Select.Option>
          </Select>
          <Button type="primary" @click="doFetch">查询</Button>
          <Button @click="resetFilters">重置</Button>
          <Button type="primary" class="ml-auto" @click="openModal()">+ 新增</Button>
        </div>
        <Table :columns="columns" :data-source="dataSource" :loading="loading" :pagination="pagination"
          @change="onTableChange" row-key="id" bordered size="middle" :scroll="{ x: 1100 }">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'adjustType'">
              <Tag :color="record.adjustType === '1' ? 'green' : 'red'">{{ record.adjustType === '1' ? '追加' : '追减' }}</Tag>
            </template>
            <template v-if="column.key === 'adjustAmount'">{{ formatAmount(record.adjustAmount) }}</template>
            <template v-if="column.key === 'isVoid'">
              <Tag :color="record.isVoid === '1' ? 'error' : 'default'">{{ record.isVoid === '1' ? '已作废' : '正常' }}</Tag>
            </template>
            <template v-if="column.key === 'action'">
              <Button type="link" size="small" @click="openModal(record)">编辑</Button>
              <Popconfirm title="确定删除吗？" @confirm="handleDelete(record.id)">
                <Button type="link" danger size="small">删除</Button>
              </Popconfirm>
            </template>
          </template>
        </Table>
      </Card>
      <Modal v-model:open="isModalVisible" :title="formState.id ? '编辑调整' : '新增调整'"
        @ok="handleSubmit()" :confirm-loading="submitting" destroy-on-close width="700px">
        <Form ref="formRef" :model="formState" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }" class="mt-4">
          <div class="grid grid-cols-2 gap-x-4">
            <Form.Item label="调整单号" name="adjustNo"><Input v-model:value="formState.adjustNo" /></Form.Item>
            <Form.Item label="指标名称" name="indicatorName" :rules="[{ required: true, message: '请输入指标名称' }]"><Input v-model:value="formState.indicatorName" /></Form.Item>
            <Form.Item label="指标编码" name="indicatorCode"><Input v-model:value="formState.indicatorCode" /></Form.Item>
            <Form.Item label="部门" name="deptName"><Input v-model:value="formState.deptName" /></Form.Item>
            <Form.Item label="调整类型" name="adjustType">
              <Select v-model:value="formState.adjustType"><Select.Option value="1">追加</Select.Option><Select.Option value="2">追减</Select.Option></Select>
            </Form.Item>
            <Form.Item label="调整金额" name="adjustAmount" :rules="[{ required: true, message: '请输入调整金额' }]"><InputNumber v-model:value="formState.adjustAmount" class="w-full" /></Form.Item>
            <Form.Item label="操作人" name="operatorName"><Input v-model:value="formState.operatorName" /></Form.Item>
          </div>
          <Form.Item label="备注" name="remark"><Input.TextArea v-model:value="formState.remark" :rows="3" /></Form.Item>
        </Form>
      </Modal>
    </div>
  </Page>
</template>
