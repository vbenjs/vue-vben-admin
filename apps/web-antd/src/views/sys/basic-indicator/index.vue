<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Radio,
  Row,
  Col,
  Select,
  Table,
  Tag,
} from 'ant-design-vue';

import { budgetIndicatorApi } from '#/api/core/sys-manage';
import { useCrudTable } from '#/composables/useCrudTable';

const defaultFormState = {
  deptName: '中共深圳市龙华区委统一战线工作部（本级）',
  indicatorCode: '',
  indicatorName: '',
  subProjectName: '',
  isGovProcure: '1',
  yearTotalAmount: undefined,
  fundSource: '',
  projectCategory: undefined,
  funcCategory: '',
  govEconCategory: '',
  deptEconCategory: '',
  fundNature: '',
  remark: '',
  indicatorType: '1',
  availableAmount: 0,
  paidAmount: 0,
  frozenAmount: 0,
  indicatorStatus: '0',
  isAllowTransfer: '1',
};

const {
  loading,
  dataSource,
  pagination,
  isModalVisible,
  submitting,
  formRef,
  formState,
  fetchList,
  openModal,
  handleSubmit,
  handleDelete,
  onTableChange,
} = useCrudTable({
  api: budgetIndicatorApi,
  rowKey: 'id',
  defaultFormState,
  messages: {
    createSuccess: '新增基本户指标成功',
    updateSuccess: '更新基本户指标成功',
    deleteSuccess: '删除基本户指标成功',
  },
});
void formRef;

const searchParams = ref({
  indicatorCode: '',
  indicatorName: '',
  projectCategory: undefined as string | undefined,
  status: undefined as string | undefined,
});

const formatAmount = (v: number | string) =>
  Number(v || 0).toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const columns = [
  { title: '指标编码', dataIndex: 'indicatorCode', key: 'indicatorCode', width: 150 },
  { title: '指标名称', dataIndex: 'indicatorName', key: 'indicatorName', width: 220 },
  { title: '子项目名称', dataIndex: 'subProjectName', key: 'subProjectName', width: 160 },
  { title: '指标金额', dataIndex: 'yearTotalAmount', key: 'yearTotalAmount', width: 120 },
  { title: '可用余额', dataIndex: 'availableAmount', key: 'availableAmount', width: 120 },
  { title: '项目分类', dataIndex: 'projectCategory', key: 'projectCategory', width: 120 },
  { title: '状态', dataIndex: 'indicatorStatus', key: 'indicatorStatus', width: 90 },
  { title: '操作', key: 'action', width: 180 },
];

const doFetch = () =>
  fetchList(1, {
    deptName: defaultFormState.deptName,
    indicatorCode: searchParams.value.indicatorCode,
    indicatorName: searchParams.value.indicatorName,
    projectCategory: searchParams.value.projectCategory,
    status: searchParams.value.status,
  });
const resetFilters = () => {
  searchParams.value = {
    indicatorCode: '',
    indicatorName: '',
    projectCategory: undefined,
    status: undefined,
  };
  doFetch();
};

onMounted(() => doFetch());
</script>

<template>
  <Page>
    <div class="p-4">
      <Card :bordered="false">
        <div class="mb-4 flex flex-wrap gap-3">
          <Input
            v-model:value="searchParams.indicatorCode"
            placeholder="指标编码"
            class="w-40"
            allow-clear
          />
          <Input
            v-model:value="searchParams.indicatorName"
            placeholder="指标名称"
            class="w-48"
            allow-clear
          />
          <Select
            v-model:value="searchParams.projectCategory"
            placeholder="项目分类"
            class="w-32"
            allow-clear
          >
            <Select.Option value="1">基本支出</Select.Option>
            <Select.Option value="2">项目支出</Select.Option>
          </Select>
          <Select
            v-model:value="searchParams.status"
            placeholder="状态"
            class="w-28"
            allow-clear
          >
            <Select.Option value="0">正常</Select.Option>
            <Select.Option value="1">停用</Select.Option>
          </Select>
          <Button type="primary" @click="doFetch">查询</Button>
          <Button @click="resetFilters">重置</Button>
          <Button type="primary" class="ml-auto" @click="openModal()">+ 新增</Button>
        </div>
        <Table
          :columns="columns"
          :data-source="dataSource"
          :loading="loading"
          :pagination="pagination"
          @change="onTableChange"
          row-key="id"
          bordered
          size="middle"
          :scroll="{ x: 1200 }"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'yearTotalAmount'">
              {{ formatAmount(record.yearTotalAmount) }}
            </template>
            <template v-if="column.key === 'availableAmount'">
              {{ formatAmount(record.availableAmount) }}
            </template>
            <template v-if="column.key === 'projectCategory'">
              {{ record.projectCategory === '1' ? '基本支出' : record.projectCategory === '2' ? '项目支出' : '-' }}
            </template>
            <template v-if="column.key === 'indicatorStatus'">
              <Tag :color="record.indicatorStatus === '0' ? 'success' : 'error'">
                {{ record.indicatorStatus === '0' ? '正常' : '停用' }}
              </Tag>
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

      <Modal
        v-model:open="isModalVisible"
        :title="formState.id ? '编辑基本户指标基础信息' : '基本户指标基础信息'"
        @ok="handleSubmit()"
        :confirm-loading="submitting"
        destroy-on-close
        width="960px"
      >
        <Form ref="formRef" :model="formState" layout="vertical" class="mt-4">
          <Row :gutter="24">
            <Col :span="12">
              <Form.Item label="部门名称" name="deptName">
                <Input v-model:value="formState.deptName" placeholder="请输入部门名称" />
              </Form.Item>
              <Form.Item
                label="指标名称"
                name="indicatorName"
                :rules="[{ required: true, message: '请输入指标名称' }]"
              >
                <Input v-model:value="formState.indicatorName" placeholder="请输入指标名称" />
              </Form.Item>
              <Form.Item label="是否政府采购" name="isGovProcure">
                <Radio.Group v-model:value="formState.isGovProcure">
                  <Radio value="1">是</Radio>
                  <Radio value="0">否</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item label="资金来源" name="fundSource">
                <Input v-model:value="formState.fundSource" placeholder="请输入资金来源" />
              </Form.Item>
              <Form.Item label="功能分类" name="funcCategory">
                <Input v-model:value="formState.funcCategory" placeholder="请输入功能分类" />
              </Form.Item>
              <Form.Item label="部门经济分类" name="deptEconCategory">
                <Input
                  v-model:value="formState.deptEconCategory"
                  placeholder="请输入部门经济分类"
                />
              </Form.Item>
            </Col>
            <Col :span="12">
              <Form.Item
                label="指标编码"
                name="indicatorCode"
                :rules="[{ required: true, message: '请输入指标编码' }]"
              >
                <Input v-model:value="formState.indicatorCode" placeholder="请输入指标编码" />
              </Form.Item>
              <Form.Item label="子项目名称" name="subProjectName">
                <Input v-model:value="formState.subProjectName" placeholder="请输入子项目名称" />
              </Form.Item>
              <Form.Item
                label="指标金额"
                name="yearTotalAmount"
                :rules="[{ required: true, message: '请输入指标金额' }]"
              >
                <InputNumber
                  v-model:value="formState.yearTotalAmount"
                  placeholder="请输入指标金额"
                  class="w-full"
                  :min="0"
                  :precision="2"
                />
              </Form.Item>
              <Form.Item label="项目分类" name="projectCategory">
                <Select v-model:value="formState.projectCategory" placeholder="请选择项目分类">
                  <Select.Option value="1">基本支出</Select.Option>
                  <Select.Option value="2">项目支出</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="政府经济分类" name="govEconCategory">
                <Input
                  v-model:value="formState.govEconCategory"
                  placeholder="请输入政府经济分类"
                />
              </Form.Item>
              <Form.Item label="资金性质" name="fundNature">
                <Input v-model:value="formState.fundNature" placeholder="请输入资金性质" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="备注" name="remark">
            <Input.TextArea v-model:value="formState.remark" placeholder="请输入备注" :rows="4" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  </Page>
</template>
