<script setup lang="ts">
import { onMounted } from 'vue';

import { Page } from '@vben/common-ui';

import { Button, Card, Form, Input, Modal, Popconfirm, Select, Table } from 'ant-design-vue';

import { projectLevel2Api } from '#/api/core/sys-manage';
import StatusTag from '#/components/StatusTag/index.vue';
import { useCrudTable } from '#/composables/useCrudTable';

const defaultFormState = {
  projectCode: '', projectName: '', deptName: '', level1Id: undefined,
  expendCategory: '', funcCategory: '', fundSource: '', isGovProcure: '0', status: '0', remark: '',
};

const { loading, dataSource, pagination, isModalVisible, submitting, formRef, formState,
  fetchList, openModal, handleSubmit, handleDelete, onTableChange,
} = useCrudTable({ api: projectLevel2Api, rowKey: 'id', defaultFormState, messages: {
  createSuccess: '新增二级项目成功', updateSuccess: '更新二级项目成功', deleteSuccess: '删除二级项目成功',
}});

const searchParams = { projectName: '', deptName: '', status: undefined as string | undefined };

const columns = [
  { title: '项目编码', dataIndex: 'projectCode', key: 'projectCode', width: 140 },
  { title: '项目名称', dataIndex: 'projectName', key: 'projectName', width: 220 },
  { title: '归口部门', dataIndex: 'deptName', key: 'deptName', width: 140 },
  { title: '支出分类', dataIndex: 'expendCategory', key: 'expendCategory', width: 140 },
  { title: '功能分类', dataIndex: 'funcCategory', key: 'funcCategory', width: 140 },
  { title: '资金来源', dataIndex: 'fundSource', key: 'fundSource', width: 120 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 90 },
  { title: '操作', key: 'action', width: 180 },
];

const doFetch = () => fetchList(1, searchParams);
const resetFilters = () => { searchParams.projectName = ''; searchParams.deptName = ''; searchParams.status = undefined; doFetch(); };
onMounted(() => doFetch());
</script>

<template>
  <Page>
    <div class="p-4">
      <Card :bordered="false">
        <div class="mb-4 flex flex-wrap gap-3">
          <Input v-model:value="searchParams.projectName" placeholder="项目名称" class="w-48" allow-clear />
          <Input v-model:value="searchParams.deptName" placeholder="归口部门" class="w-36" allow-clear />
          <Select v-model:value="searchParams.status" placeholder="状态" class="w-28" allow-clear>
            <Select.Option value="0">正常</Select.Option><Select.Option value="1">停用</Select.Option>
          </Select>
          <Button type="primary" @click="doFetch">查询</Button>
          <Button @click="resetFilters">重置</Button>
          <Button type="primary" class="ml-auto" @click="openModal()">+ 新增</Button>
        </div>
        <Table :columns="columns" :data-source="dataSource" :loading="loading" :pagination="pagination"
          @change="onTableChange" row-key="id" bordered size="middle" :scroll="{ x: 1100 }">
          <template #bodyCell="{ column, record }">
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
      <Modal v-model:open="isModalVisible" :title="formState.id ? '编辑二级项目' : '新增二级项目'"
        @ok="handleSubmit()" :confirm-loading="submitting" destroy-on-close width="700px">
        <Form ref="formRef" :model="formState" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }" class="mt-4">
          <div class="grid grid-cols-2 gap-x-4">
            <Form.Item label="项目编码" name="projectCode"><Input v-model:value="formState.projectCode" /></Form.Item>
            <Form.Item label="项目名称" name="projectName" :rules="[{ required: true, message: '请输入项目名称' }]"><Input v-model:value="formState.projectName" /></Form.Item>
            <Form.Item label="归口部门" name="deptName"><Input v-model:value="formState.deptName" /></Form.Item>
            <Form.Item label="支出分类" name="expendCategory"><Input v-model:value="formState.expendCategory" /></Form.Item>
            <Form.Item label="功能分类" name="funcCategory"><Input v-model:value="formState.funcCategory" /></Form.Item>
            <Form.Item label="资金来源" name="fundSource"><Input v-model:value="formState.fundSource" /></Form.Item>
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
