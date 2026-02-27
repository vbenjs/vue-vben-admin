<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Page } from '@vben/common-ui';
import { Card, Table, Button, Input, Modal, Form, Radio, Tag, Popconfirm, message } from 'ant-design-vue';
import { sysTenantApi } from '#/api/core/sys-manage';

const loading = ref(false);
const dataSource = ref([]);
const total = ref(0);
const pagination = ref({ current: 1, pageSize: 10, total: 0 });
const searchParams = ref({ tenantName: '' });

const columns = [
  { title: '租户名称', dataIndex: 'tenantName', key: 'tenantName' },
  { title: '状态', dataIndex: 'status', key: 'status' },
  { title: '备注', dataIndex: 'remark', key: 'remark' },
  { title: '创建人', dataIndex: 'createBy', key: 'createBy' },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
  { title: '操作', key: 'action', width: 150 }
];

const fetchList = async (page = 1) => {
  try {
    loading.value = true;
    const res = await sysTenantApi.getList({ page, pageSize: pagination.value.pageSize, ...searchParams.value });
    dataSource.value = res?.items || [];
    total.value = res?.total || 0;
    pagination.value.current = page;
    pagination.value.total = total.value;
  } finally {
    loading.value = false;
  }
};

const isModalVisible = ref(false);
const submitting = ref(false);
const formRef = ref();
const formState = ref<any>({ tenantName: '', status: '0', remark: '' });

const openModal = (record?: any) => {
  if (record) {
    formState.value = { ...record };
  } else {
    formState.value = { tenantName: '', status: '0', remark: '' };
  }
  isModalVisible.value = true;
};

const handleSubmit = async () => {
  try {
    await formRef.value?.validate();
    submitting.value = true;
    if (formState.value.tenantId) {
      await sysTenantApi.update(formState.value.tenantId, formState.value);
      message.success('更新成功');
    } else {
      await sysTenantApi.create(formState.value);
      message.success('新增成功');
    }
    isModalVisible.value = false;
    fetchList(pagination.value.current);
  } catch (error) {
    console.error(error);
  } finally {
    submitting.value = false;
  }
};

const handleDelete = async (id: number | string) => {
  try {
    await sysTenantApi.remove(id);
    message.success('删除成功');
    fetchList(pagination.value.current);
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
  fetchList();
});
</script>

<template>
  <Page title="租户管理" description="多租户系统管理维护。">
    <div class="p-4">
      <Card :bordered="false">
        <div class="mb-4 flex gap-4">
          <Input v-model:value="searchParams.tenantName" placeholder="请输入租户名称" class="w-64" allowClear />
          <Button type="primary" @click="fetchList(1)">查询</Button>
          <Button @click="() => { searchParams.tenantName = ''; fetchList(1); }">重置</Button>
          <Button type="primary" ghost class="ml-auto" @click="openModal()">新增租户</Button>
        </div>
        <Table 
          :columns="columns" 
          :dataSource="dataSource" 
          :loading="loading" 
          :pagination="pagination"
          @change="(pag) => fetchList(pag.current)"
          rowKey="tenantId"
          bordered
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'status'">
              <Tag :color="record.status === '0' ? 'success' : 'error'">
                {{ record.status === '0' ? '正常' : '停用' }}
              </Tag>
            </template>
            <template v-if="column.key === 'action'">
              <Button type="link" size="small" @click="openModal(record)">编辑</Button>
              <Popconfirm title="确定删除吗？" @confirm="handleDelete(record.tenantId)">
                <Button type="link" danger size="small">删除</Button>
              </Popconfirm>
            </template>
          </template>
        </Table>
      </Card>
      
      <!-- 编辑/新增弹窗 -->
      <Modal v-model:open="isModalVisible" :title="formState.tenantId ? '编辑租户' : '新增租户'" @ok="handleSubmit" :confirmLoading="submitting" destroyOnClose>
        <Form ref="formRef" :model="formState" :label-col="{span: 4}" :wrapper-col="{span: 18}" class="mt-4">
          <Form.Item label="租户名称" name="tenantName" :rules="[{ required: true, message: '请输入租户名称' }]">
            <Input v-model:value="formState.tenantName" placeholder="请输入名称" />
          </Form.Item>
          <Form.Item label="状态" name="status">
            <Radio.Group v-model:value="formState.status">
              <Radio value="0">正常</Radio>
              <Radio value="1">停用</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="备注" name="remark">
            <Input.TextArea v-model:value="formState.remark" placeholder="请输入备注信息" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  </Page>
</template>
