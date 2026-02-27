<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Page } from '@vben/common-ui';
import {
  Card, Table, Button, Input, Tag, Popconfirm,
  Modal, Form, InputNumber, Select, Radio, message,
} from 'ant-design-vue';
import { sysPostApi } from '#/api/core/sys-manage';

const loading = ref(false);
const dataSource = ref([]);
const pagination = ref({ current: 1, pageSize: 10, total: 0 });
const searchParams = ref({ postName: '', postCode: '', status: undefined });

const columns = [
  { title: '岗位编码', dataIndex: 'postCode', key: 'postCode' },
  { title: '岗位名称', dataIndex: 'postName', key: 'postName' },
  { title: '排序', dataIndex: 'postSort', key: 'postSort', width: 80 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 100 },
  { title: '备注', dataIndex: 'remark', key: 'remark' },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 160 },
  { title: '操作', key: 'action', width: 130 },
];

const fetchList = async (page = 1) => {
  try {
    loading.value = true;
    const res = await sysPostApi.getList({
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

/* ---- 新增/编辑 Modal ---- */
const isModalVisible = ref(false);
const submitting = ref(false);
const formRef = ref();
const formState = ref<any>({ postCode: '', postName: '', postSort: 0, status: '0', remark: '' });

const openModal = (record?: any) => {
  formState.value = record
    ? { ...record }
    : { postCode: '', postName: '', postSort: 0, status: '0', remark: '' };
  isModalVisible.value = true;
};

const handleSubmit = async () => {
  try {
    await formRef.value?.validate();
    submitting.value = true;
    if (formState.value.postId) {
      await sysPostApi.update(formState.value.postId, formState.value);
      message.success('更新成功');
    } else {
      await sysPostApi.create(formState.value);
      message.success('新增成功');
    }
    isModalVisible.value = false;
    fetchList(pagination.value.current);
  } catch (err) {
    console.error(err);
  } finally {
    submitting.value = false;
  }
};

/* ---- 删除 ---- */
const handleDelete = async (id: number) => {
  await sysPostApi.remove(id);
  message.success('删除成功');
  fetchList(pagination.value.current);
};

/* ---- 格式化时间 ---- */
const formatDate = (v: string) => (v ? new Date(v).toLocaleString('zh-CN') : '-');

onMounted(() => fetchList());
</script>

<template>
  <Page title="岗位管理" description="维护公司用户所在岗位/职级。">
    <div class="p-4">
      <Card :bordered="false">
        <!-- 搜索栏 -->
        <div class="mb-4 flex gap-3 flex-wrap">
          <Input
            v-model:value="searchParams.postCode"
            placeholder="岗位编码"
            class="w-40"
            allowClear
          />
          <Input
            v-model:value="searchParams.postName"
            placeholder="岗位名称"
            class="w-40"
            allowClear
          />
          <Select
            v-model:value="searchParams.status"
            placeholder="状态"
            class="w-32"
            allowClear
          >
            <Select.Option value="0">正常</Select.Option>
            <Select.Option value="1">停用</Select.Option>
          </Select>
          <Button type="primary" @click="fetchList(1)">查询</Button>
          <Button
            @click="
              () => {
                searchParams.postName = '';
                searchParams.postCode = '';
                searchParams.status = undefined;
                fetchList(1);
              }
            "
            >重置</Button
          >
          <Button type="primary" ghost class="ml-auto" @click="openModal()">+ 新增岗位</Button>
        </div>

        <!-- 数据表格 -->
        <Table
          :columns="columns"
          :dataSource="dataSource"
          :loading="loading"
          :pagination="pagination"
          @change="(pag) => fetchList(pag.current)"
          rowKey="postId"
          bordered
          size="middle"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'status'">
              <Tag :color="record.status === '0' ? 'success' : 'error'">
                {{ record.status === '0' ? '正常' : '停用' }}
              </Tag>
            </template>
            <template v-if="column.key === 'createTime'">
              {{ formatDate(record.createTime) }}
            </template>
            <template v-if="column.key === 'action'">
              <Button type="link" size="small" @click="openModal(record)">编辑</Button>
              <Popconfirm title="确定删除该岗位吗？" @confirm="handleDelete(record.postId)">
                <Button type="link" danger size="small">删除</Button>
              </Popconfirm>
            </template>
          </template>
        </Table>
      </Card>

      <!-- 新增/编辑弹窗 -->
      <Modal
        v-model:open="isModalVisible"
        :title="formState.postId ? '编辑岗位' : '新增岗位'"
        @ok="handleSubmit"
        :confirmLoading="submitting"
        destroyOnClose
        width="520px"
      >
        <Form
          ref="formRef"
          :model="formState"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 17 }"
          class="mt-4"
        >
          <Form.Item
            label="岗位编码"
            name="postCode"
            :rules="[{ required: true, message: '请输入岗位编码' }]"
          >
            <Input v-model:value="formState.postCode" placeholder="请输入岗位编码" />
          </Form.Item>
          <Form.Item
            label="岗位名称"
            name="postName"
            :rules="[{ required: true, message: '请输入岗位名称' }]"
          >
            <Input v-model:value="formState.postName" placeholder="请输入岗位名称" />
          </Form.Item>
          <Form.Item label="排序" name="postSort">
            <InputNumber v-model:value="formState.postSort" :min="0" style="width: 100%" />
          </Form.Item>
          <Form.Item label="状态" name="status">
            <Radio.Group v-model:value="formState.status">
              <Radio value="0">正常</Radio>
              <Radio value="1">停用</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="备注" name="remark">
            <Input.TextArea v-model:value="formState.remark" placeholder="可输入备注信息" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  </Page>
</template>
