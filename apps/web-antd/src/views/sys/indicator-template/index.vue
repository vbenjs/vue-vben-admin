<script setup lang="ts">
import { onMounted } from 'vue';
import { Page } from '@vben/common-ui';
import { Button, Card, Form, Input, InputNumber, Modal, Popconfirm, Select, Table } from 'ant-design-vue';
import { indicatorTemplateApi } from '#/api/core/sys-manage';
import StatusTag from '#/components/StatusTag/index.vue';
import { useCrudTable } from '#/composables/useCrudTable';

const defaultFormState = {
  templateCode: '', templateName: '', alias: '', sortOrder: 0,
  isEnabled: '1', isRequired: '0', status: '0', remark: '',
};

const { loading, dataSource, pagination, isModalVisible, submitting, formRef, formState,
  fetchList, openModal, handleSubmit, handleDelete, onTableChange,
} = useCrudTable({ api: indicatorTemplateApi, rowKey: 'id', defaultFormState, messages: {
  createSuccess: '新增模板成功', updateSuccess: '更新模板成功', deleteSuccess: '删除模板成功',
}});

const searchParams = { templateName: '', status: undefined as string | undefined };

const columns = [
  { title: '模板编码', dataIndex: 'templateCode', key: 'templateCode', width: 140 },
  { title: '模板名称', dataIndex: 'templateName', key: 'templateName', width: 200 },
  { title: '别名', dataIndex: 'alias', key: 'alias', width: 140 },
  { title: '排序', dataIndex: 'sortOrder', key: 'sortOrder', width: 80 },
  { title: '启用', dataIndex: 'isEnabled', key: 'isEnabled', width: 80 },
  { title: '必填', dataIndex: 'isRequired', key: 'isRequired', width: 80 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 90 },
  { title: '操作', key: 'action', width: 180 },
];

const doFetch = () => fetchList(1, searchParams);
const resetFilters = () => { searchParams.templateName = ''; searchParams.status = undefined; doFetch(); };
onMounted(() => doFetch());
</script>

<template>
  <Page>
    <div class="p-4">
      <Card :bordered="false">
        <div class="mb-4 flex flex-wrap gap-3">
          <Input v-model:value="searchParams.templateName" placeholder="模板名称" class="w-48" allow-clear />
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
            <template v-if="column.key === 'isEnabled'">{{ record.isEnabled === '1' ? '是' : '否' }}</template>
            <template v-if="column.key === 'isRequired'">{{ record.isRequired === '1' ? '是' : '否' }}</template>
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
      <Modal v-model:open="isModalVisible" :title="formState.id ? '编辑模板' : '新增模板'"
        @ok="handleSubmit()" :confirm-loading="submitting" destroy-on-close width="700px">
        <Form ref="formRef" :model="formState" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }" class="mt-4">
          <div class="grid grid-cols-2 gap-x-4">
            <Form.Item label="模板编码" name="templateCode"><Input v-model:value="formState.templateCode" /></Form.Item>
            <Form.Item label="模板名称" name="templateName" :rules="[{ required: true, message: '请输入模板名称' }]"><Input v-model:value="formState.templateName" /></Form.Item>
            <Form.Item label="别名" name="alias"><Input v-model:value="formState.alias" /></Form.Item>
            <Form.Item label="排序" name="sortOrder"><InputNumber v-model:value="formState.sortOrder" class="w-full" :min="0" /></Form.Item>
            <Form.Item label="是否启用" name="isEnabled">
              <Select v-model:value="formState.isEnabled"><Select.Option value="0">否</Select.Option><Select.Option value="1">是</Select.Option></Select>
            </Form.Item>
            <Form.Item label="是否必填" name="isRequired">
              <Select v-model:value="formState.isRequired"><Select.Option value="0">否</Select.Option><Select.Option value="1">是</Select.Option></Select>
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
