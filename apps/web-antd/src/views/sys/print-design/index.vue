<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';

import {
  Button,
  Card,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Radio,
  Select,
  Table,
  Tag,
} from 'ant-design-vue';

import { sysPrintDesignApi } from '#/api/core/sys-manage';

const router = useRouter();
const loading = ref(false);
const dataSource = ref([]);
const pagination = ref({ current: 1, pageSize: 10, total: 0 });
const searchParams = ref({ printName: '', status: undefined });

const columns = [
  { title: '模板名称', dataIndex: 'printName', key: 'printName' },
  { title: '模板编号', dataIndex: 'printCode', key: 'printCode', width: 140 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 80 },
  { title: '创建人', dataIndex: 'createBy', key: 'createBy', width: 100 },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 160 },
  { title: '操作', key: 'action', width: 200 },
];

const fetchList = async (page = 1) => {
  try {
    loading.value = true;
    const res = await sysPrintDesignApi.getList({
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

const formatDate = (v: string) =>
  v ? new Date(v).toLocaleString('zh-CN') : '-';

/* ---- 新增/编辑 Modal ---- */
const isModalVisible = ref(false);
const submitting = ref(false);
const formRef = ref();
const defaultForm = () => ({
  printName: '',
  printCode: '',
  status: '0',
  remark: '',
});
const formState = ref<any>(defaultForm());

const openModal = (record?: any) => {
  formState.value = record ? { ...record } : defaultForm();
  isModalVisible.value = true;
};

const handleSubmit = async () => {
  try {
    await formRef.value?.validate();
    submitting.value = true;
    if (formState.value.printId) {
      await sysPrintDesignApi.update(formState.value.printId, formState.value);
      message.success('更新成功');
    } else {
      await sysPrintDesignApi.create(formState.value);
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

const handleDelete = async (id: number) => {
  await sysPrintDesignApi.remove(id);
  message.success('删除成功');
  fetchList(pagination.value.current);
};

onMounted(() => fetchList());
</script>

<template>
  <Page>
    <div class="p-4">
      <Card :bordered="false">
        <div class="mb-3 flex flex-wrap gap-3">
          <Input
            v-model:value="searchParams.printName"
            placeholder="模板名称"
            class="w-40"
            allow-clear
          />
          <Select
            v-model:value="searchParams.status"
            placeholder="状态"
            class="w-28"
            allow-clear
          >
            <Select.Option value="0">启用</Select.Option>
            <Select.Option value="1">禁用</Select.Option>
          </Select>
          <Button type="primary" @click="fetchList(1)">查询</Button>
          <Button
            @click="
              () => {
                searchParams.printName = '';
                searchParams.status = undefined;
                fetchList(1);
              }
            "
          >
            重置
          </Button>
          <Button type="primary" class="ml-auto" @click="openModal()">
            + 新增
          </Button>
        </div>

        <Table
          :columns="columns"
          :data-source="dataSource"
          :loading="loading"
          :pagination="pagination"
          @change="(pag) => fetchList(pag.current)"
          row-key="printId"
          bordered
          size="middle"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'status'">
              <Tag :color="record.status === '0' ? 'success' : 'error'">
                {{ record.status === '0' ? '启用' : '禁用' }}
              </Tag>
            </template>
            <template v-if="column.key === 'createTime'">
              {{ formatDate(record.createTime) }}
            </template>
            <template v-if="column.key === 'action'">
              <Button
                type="link"
                size="small"
                @click="
                  router.push(`/sys/print-design/designer?id=${record.printId}`)
                "
              >
                设计器
              </Button>
              <Button type="link" size="small" @click="openModal(record)">
                编辑
              </Button>
              <Popconfirm
                title="确定删除该打印模板吗？"
                @confirm="handleDelete(record.printId)"
              >
                <Button type="link" danger size="small">删除</Button>
              </Popconfirm>
            </template>
          </template>
        </Table>
      </Card>
    </div>

    <!-- 新增/编辑弹窗 -->
    <Modal
      v-model:open="isModalVisible"
      :title="formState.printId ? '编辑打印模板' : '新增打印模板'"
      @ok="handleSubmit"
      :confirm-loading="submitting"
      destroy-on-close
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
          label="模板名称"
          name="printName"
          :rules="[{ required: true, message: '请输入模板名称' }]"
        >
          <Input
            v-model:value="formState.printName"
            placeholder="请输入模板名称"
          />
        </Form.Item>
        <Form.Item label="模板编号" name="printCode">
          <Input
            v-model:value="formState.printCode"
            placeholder="请输入模板编号"
          />
        </Form.Item>
        <Form.Item label="状态" name="status">
          <Radio.Group v-model:value="formState.status">
            <Radio value="0">启用</Radio>
            <Radio value="1">禁用</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="备注" name="remark">
          <Input.TextArea
            v-model:value="formState.remark"
            placeholder="可输入备注信息"
          />
        </Form.Item>
      </Form>
    </Modal>
  </Page>
</template>
