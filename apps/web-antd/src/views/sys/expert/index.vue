<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';
import { useUserStore } from '@vben/stores';

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

import { expertApi } from '#/api/core/sys-manage';

const userStore = useUserStore();
const loading = ref(false);
const dataSource = ref<any[]>([]);
const pagination = ref({ current: 1, pageSize: 10, total: 0 });
const contextInfo = ref({
  fiscalYear: userStore.userInfo?.fiscalYear || '',
  tenantName: userStore.userInfo?.tenantName || '',
});
const searchParams = ref({
  fiscalYear: userStore.userInfo?.fiscalYear || '',
  expertName: '',
  expertType: '',
  status: undefined,
});
const pageDescription = computed(() => {
  const parts = [];
  if (contextInfo.value.tenantName)
    parts.push(`当前账套：${contextInfo.value.tenantName}`);
  if (contextInfo.value.fiscalYear)
    parts.push(`默认年度：${contextInfo.value.fiscalYear}年度`);
  return parts.join(' · ') || '专家库业务示例，已接入年度上下文过滤。';
});
const columns = [
  { title: '专家姓名', dataIndex: 'expertName', key: 'expertName', width: 160 },
  { title: '专家类型', dataIndex: 'expertType', key: 'expertType', width: 140 },
  { title: '专业方向', dataIndex: 'specialty', key: 'specialty', width: 180 },
  { title: '工作单位', dataIndex: 'workUnit', key: 'workUnit', width: 180 },
  { title: '电话', dataIndex: 'phone', key: 'phone', width: 140 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 90 },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 170 },
  { title: '操作', key: 'action', width: 130 },
];
const isModalVisible = ref(false);
const submitting = ref(false);
const formRef = ref();
const defaultForm = () => ({
  expertName: '',
  expertType: '',
  specialty: '',
  workUnit: '',
  title: '',
  phone: '',
  email: '',
  idCard: '',
  status: '0',
  remark: '',
});
const formState = ref<any>(defaultForm());
const fetchList = async (page = 1) => {
  try {
    loading.value = true;
    const res = await expertApi.getList({
      page,
      pageSize: pagination.value.pageSize,
      ...searchParams.value,
    });
    dataSource.value = res?.items || [];
    pagination.value.current = page;
    pagination.value.total = res?.total || 0;
    contextInfo.value = {
      fiscalYear:
        res?.context?.fiscalYear || userStore.userInfo?.fiscalYear || '',
      tenantName:
        res?.context?.tenantName || userStore.userInfo?.tenantName || '',
    };
  } finally {
    loading.value = false;
  }
};
const openModal = async (record?: any) => {
  formState.value = record?.id
    ? await expertApi.getById(record.id)
    : defaultForm();
  isModalVisible.value = true;
};
const handleSubmit = async () => {
  try {
    await formRef.value?.validate();
    submitting.value = true;
    if (formState.value.id) {
      await expertApi.update(formState.value.id, formState.value);
      message.success('更新专家成功');
    } else {
      await expertApi.create(formState.value);
      message.success('新增专家成功');
    }
    isModalVisible.value = false;
    fetchList(1);
  } finally {
    submitting.value = false;
  }
};
const handleDelete = async (id: string) => {
  await expertApi.remove(id);
  message.success('删除专家成功');
  fetchList(1);
};
const formatDate = (value?: string) =>
  value ? new Date(value).toLocaleString('zh-CN') : '-';
onMounted(() => fetchList());
</script>
<template>
  <Page>
    <div class="space-y-4">
      <Card>
        <div class="mb-4 flex flex-wrap gap-3">
          <Input
            v-model:value="searchParams.fiscalYear"
            placeholder="年度，如 2026"
            style="width: 140px"
          /><Input
            v-model:value="searchParams.expertName"
            placeholder="专家姓名"
            style="width: 180px"
          /><Input
            v-model:value="searchParams.expertType"
            placeholder="专家类型"
            style="width: 160px"
          /><Select
            v-model:value="searchParams.status"
            placeholder="状态"
            allow-clear
            style="width: 120px"
          >
            <Select.Option value="0">正常</Select.Option
            ><Select.Option value="1">停用</Select.Option> </Select
          ><Button type="primary" @click="fetchList(1)">查询</Button
          ><Button
            @click="
              () => {
                searchParams.fiscalYear = userStore.userInfo?.fiscalYear || '';
                searchParams.expertName = '';
                searchParams.expertType = '';
                searchParams.status = undefined;
                fetchList(1);
              }
            "
          >
            重置 </Button
          ><Button type="primary" class="ml-auto" @click="openModal()">
            + 新增
          </Button>
        </div>
        <Table
          :columns="columns"
          :data-source="dataSource"
          :loading="loading"
          :pagination="pagination"
          row-key="id"
          bordered
          size="middle"
          :scroll="{ x: 1320 }"
          @change="(pag) => fetchList(pag.current)"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'status'">
              <Tag :color="record.status === '0' ? 'success' : 'error'">
                {{ record.status === '0' ? '正常' : '停用' }}
              </Tag> </template
            ><template v-if="column.key === 'createTime'">
              {{ formatDate(record.createTime) }} </template
            ><template v-if="column.key === 'action'">
              <Button type="link" size="small" @click="openModal(record)">
                编辑 </Button
              ><Popconfirm
                title="确定删除吗？"
                @confirm="handleDelete(record.id)"
              >
                <Button type="link" danger size="small"> 删除 </Button>
              </Popconfirm>
            </template>
          </template>
        </Table>
      </Card>
    </div>
    <Modal
      v-model:open="isModalVisible"
      :title="formState.id ? '编辑专家' : '新增专家'"
      @ok="handleSubmit"
      :confirm-loading="submitting"
      destroy-on-close
      width="760px"
    >
      <Form ref="formRef" :model="formState" layout="vertical" class="mt-4">
        <div class="grid grid-cols-2 gap-4">
          <Form.Item
            label="专家姓名"
            name="expertName"
            :rules="[{ required: true, message: '请输入专家姓名' }]"
          >
            <Input
              v-model:value="formState.expertName"
              placeholder="请输入专家姓名"
            /> </Form.Item
          ><Form.Item label="专家类型" name="expertType">
            <Input
              v-model:value="formState.expertType"
              placeholder="请输入专家类型"
            /> </Form.Item
          ><Form.Item label="专业方向" name="specialty">
            <Input
              v-model:value="formState.specialty"
              placeholder="请输入专业方向"
            /> </Form.Item
          ><Form.Item label="工作单位" name="workUnit">
            <Input
              v-model:value="formState.workUnit"
              placeholder="请输入工作单位"
            /> </Form.Item
          ><Form.Item label="职称" name="title">
            <Input
              v-model:value="formState.title"
              placeholder="请输入职称"
            /> </Form.Item
          ><Form.Item label="电话" name="phone">
            <Input
              v-model:value="formState.phone"
              placeholder="请输入电话"
            /> </Form.Item
          ><Form.Item label="邮箱" name="email">
            <Input
              v-model:value="formState.email"
              placeholder="请输入邮箱"
            /> </Form.Item
          ><Form.Item label="状态" name="status">
            <Radio.Group v-model:value="formState.status">
              <Radio value="0">正常</Radio><Radio value="1">停用</Radio>
            </Radio.Group>
          </Form.Item>
        </div>
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
