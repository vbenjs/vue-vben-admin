<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';
import { useUserStore } from '@vben/stores';

import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Popconfirm,
  Radio,
  Select,
  Table,
  Tag,
} from 'ant-design-vue';

import { contractEvaluationApi } from '#/api/core/sys-manage';

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
  contractName: '',
  evaluator: '',
  evaluationStatus: undefined,
  status: undefined,
});
const pageDescription = computed(() => {
  const parts = [];
  if (contextInfo.value.tenantName)
    parts.push(`当前账套：${contextInfo.value.tenantName}`);
  if (contextInfo.value.fiscalYear)
    parts.push(`默认年度：${contextInfo.value.fiscalYear}年度`);
  return parts.join(' · ') || '履约评价业务示例，已接入年度上下文过滤。';
});
const columns = [
  {
    title: '合同名称',
    dataIndex: 'contractName',
    key: 'contractName',
    width: 180,
  },
  {
    title: '项目名称',
    dataIndex: 'projectName',
    key: 'projectName',
    width: 180,
  },
  { title: '评价人', dataIndex: 'evaluator', key: 'evaluator', width: 120 },
  {
    title: '评价等级',
    dataIndex: 'evaluationLevel',
    key: 'evaluationLevel',
    width: 120,
  },
  {
    title: '评价日期',
    dataIndex: 'evaluationDate',
    key: 'evaluationDate',
    width: 140,
  },
  {
    title: '评价状态',
    dataIndex: 'evaluationStatus',
    key: 'evaluationStatus',
    width: 100,
  },
  { title: '状态', dataIndex: 'status', key: 'status', width: 90 },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 170 },
  { title: '操作', key: 'action', width: 130 },
];
const isModalVisible = ref(false);
const submitting = ref(false);
const formRef = ref();
const defaultForm = () => ({
  contractName: '',
  projectName: '',
  evaluator: '',
  evaluationLevel: '',
  evaluationDate: `${userStore.userInfo?.fiscalYear || new Date().getFullYear()}-01-01`,
  evaluationStatus: '0',
  status: '0',
  evaluationContent: '',
  contractAmount: 0,
  remark: '',
});
const formState = ref<any>(defaultForm());
const fetchList = async (page = 1) => {
  try {
    loading.value = true;
    const res = await contractEvaluationApi.getList({
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
  const detail = record?.id
    ? await contractEvaluationApi.getById(record.id)
    : defaultForm();
  formState.value = {
    ...detail,
    evaluationDate: detail?.evaluationDate
      ? new Date(detail.evaluationDate).toISOString().slice(0, 10)
      : defaultForm().evaluationDate,
  };
  isModalVisible.value = true;
};
const handleSubmit = async () => {
  try {
    await formRef.value?.validate();
    submitting.value = true;
    if (formState.value.id) {
      await contractEvaluationApi.update(formState.value.id, formState.value);
      message.success('更新履约评价成功');
    } else {
      await contractEvaluationApi.create(formState.value);
      message.success('新增履约评价成功');
    }
    isModalVisible.value = false;
    fetchList(1);
  } finally {
    submitting.value = false;
  }
};
const handleDelete = async (id: string) => {
  await contractEvaluationApi.remove(id);
  message.success('删除履约评价成功');
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
            v-model:value="searchParams.contractName"
            placeholder="合同名称"
            style="width: 180px"
          /><Input
            v-model:value="searchParams.evaluator"
            placeholder="评价人"
            style="width: 180px"
          /><Select
            v-model:value="searchParams.evaluationStatus"
            placeholder="评价状态"
            allow-clear
            style="width: 120px"
          >
            <Select.Option value="0">未评价</Select.Option
            ><Select.Option value="1">已评价</Select.Option> </Select
          ><Select
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
                searchParams.contractName = '';
                searchParams.evaluator = '';
                searchParams.evaluationStatus = undefined;
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
          :scroll="{ x: 1400 }"
          @change="(pag) => fetchList(pag.current)"
        >
          <template #bodyCell="{ column, record }">
            <template
              v-if="
                column.key === 'evaluationDate' || column.key === 'createTime'
              "
            >
              {{ formatDate(record[column.key]) }} </template
            ><template v-if="column.key === 'evaluationStatus'">
              <Tag
                :color="
                  record.evaluationStatus === '1' ? 'success' : 'processing'
                "
              >
                {{ record.evaluationStatus === '1' ? '已评价' : '未评价' }}
              </Tag> </template
            ><template v-if="column.key === 'status'">
              <Tag :color="record.status === '0' ? 'success' : 'error'">
                {{ record.status === '0' ? '正常' : '停用' }}
              </Tag> </template
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
      :title="formState.id ? '编辑履约评价' : '新增履约评价'"
      @ok="handleSubmit"
      :confirm-loading="submitting"
      destroy-on-close
      width="760px"
    >
      <Form ref="formRef" :model="formState" layout="vertical" class="mt-4">
        <div class="grid grid-cols-2 gap-4">
          <Form.Item
            label="合同名称"
            name="contractName"
            :rules="[{ required: true, message: '请输入合同名称' }]"
          >
            <Input
              v-model:value="formState.contractName"
              placeholder="请输入合同名称"
            /> </Form.Item
          ><Form.Item label="项目名称" name="projectName">
            <Input
              v-model:value="formState.projectName"
              placeholder="请输入项目名称"
            /> </Form.Item
          ><Form.Item label="评价人" name="evaluator">
            <Input
              v-model:value="formState.evaluator"
              placeholder="请输入评价人"
            /> </Form.Item
          ><Form.Item label="评价等级" name="evaluationLevel">
            <Input
              v-model:value="formState.evaluationLevel"
              placeholder="如：A"
            /> </Form.Item
          ><Form.Item
            label="评价日期"
            name="evaluationDate"
            :rules="[{ required: true, message: '请输入评价日期' }]"
          >
            <Input
              v-model:value="formState.evaluationDate"
              placeholder="YYYY-MM-DD"
            /> </Form.Item
          ><Form.Item label="评价状态" name="evaluationStatus">
            <Radio.Group v-model:value="formState.evaluationStatus">
              <Radio value="0">未评价</Radio><Radio value="1">已评价</Radio>
            </Radio.Group> </Form.Item
          ><Form.Item label="状态" name="status">
            <Radio.Group v-model:value="formState.status">
              <Radio value="0">正常</Radio><Radio value="1">停用</Radio>
            </Radio.Group> </Form.Item
          ><Form.Item label="合同金额" name="contractAmount">
            <InputNumber
              v-model:value="formState.contractAmount"
              :min="0"
              style="width: 100%"
            />
          </Form.Item>
        </div>
        <Form.Item label="评价内容" name="evaluationContent">
          <Input.TextArea
            v-model:value="formState.evaluationContent"
            placeholder="请输入评价内容"
          /> </Form.Item
        ><Form.Item label="备注" name="remark">
          <Input.TextArea
            v-model:value="formState.remark"
            placeholder="可输入备注信息"
          />
        </Form.Item>
      </Form>
    </Modal>
  </Page>
</template>
