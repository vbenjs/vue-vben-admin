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
  indicatorCode: '',
  indicatorName: '',
  indicatorType: '1',
  deptName: '',
  expendCategory: '',
  funcCategory: '',
  econCategory: '',
  fundSource: '',
  yearBeginAmount: 0,
  yearTotalAmount: 0,
  availableAmount: 0,
  paidAmount: 0,
  frozenAmount: 0,
  indicatorStatus: '0',
  isGovProcure: '0',
  isAllowTransfer: '1',
  projectCategory: '',
  govEconCategory: '',
  deptEconCategory: '',
  fundNature: '',
  remark: '',
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
    createSuccess: '新增部门指标成功',
    updateSuccess: '更新部门指标成功',
    deleteSuccess: '删除部门指标成功',
  },
});
void formRef;

const searchParams = ref({
  indicatorCode: '',
  indicatorName: '',
  deptName: '',
  indicatorType: undefined as string | undefined,
  status: undefined as string | undefined,
});

const indicatorTypeMap: Record<string, { color: string; text: string }> = {
  '1': { color: 'blue', text: '年初指标' },
  '2': { color: 'orange', text: '年中追加' },
  '3': { color: 'green', text: '课题指标' },
  '4': { color: 'purple', text: '虚拟指标' },
};

const formatAmount = (v: number | string) =>
  Number(v || 0).toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const columns = [
  { title: '指标编码', dataIndex: 'indicatorCode', key: 'indicatorCode', width: 130 },
  { title: '指标名称', dataIndex: 'indicatorName', key: 'indicatorName', width: 200 },
  { title: '类型', dataIndex: 'indicatorType', key: 'indicatorType', width: 100 },
  { title: '归口部门', dataIndex: 'deptName', key: 'deptName', width: 140 },
  { title: '年度总额', dataIndex: 'yearTotalAmount', key: 'yearTotalAmount', width: 120 },
  { title: '冻结金额', dataIndex: 'frozenAmount', key: 'frozenAmount', width: 120 },
  { title: '已支付', dataIndex: 'paidAmount', key: 'paidAmount', width: 110 },
  { title: '可用余额', dataIndex: 'availableAmount', key: 'availableAmount', width: 120 },
  { title: '状态', dataIndex: 'indicatorStatus', key: 'indicatorStatus', width: 90 },
  { title: '操作', key: 'action', width: 180 },
];

const doFetch = () => fetchList(1, searchParams.value);
const resetFilters = () => {
  searchParams.value = {
    indicatorCode: '',
    indicatorName: '',
    deptName: '',
    indicatorType: undefined,
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
          <Input
            v-model:value="searchParams.deptName"
            placeholder="归口部门"
            class="w-36"
            allow-clear
          />
          <Select
            v-model:value="searchParams.indicatorType"
            placeholder="指标类型"
            class="w-32"
            allow-clear
          >
            <Select.Option value="1">年初指标</Select.Option>
            <Select.Option value="2">年中追加</Select.Option>
            <Select.Option value="3">课题指标</Select.Option>
            <Select.Option value="4">虚拟指标</Select.Option>
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
          <Button type="primary" class="ml-auto" @click="openModal()">
            + 新增
          </Button>
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
          :scroll="{ x: 1400 }"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'indicatorType'">
              <Tag :color="indicatorTypeMap[record.indicatorType]?.color || 'default'">
                {{ indicatorTypeMap[record.indicatorType]?.text || '未知' }}
              </Tag>
            </template>
            <template
              v-if="['yearTotalAmount', 'frozenAmount', 'paidAmount', 'availableAmount'].includes(String(column.key))"
            >
              {{ formatAmount(record[String(column.key)]) }}
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
        :title="formState.id ? '编辑部门指标基础信息' : '部门指标基础信息'"
        @ok="handleSubmit()"
        :confirm-loading="submitting"
        destroy-on-close
        width="960px"
      >
        <Form ref="formRef" :model="formState" layout="vertical" class="mt-4">
          <Row :gutter="24">
            <Col :span="12">
              <Form.Item label="归口部门" name="deptName">
                <Input v-model:value="formState.deptName" placeholder="请输入归口部门" />
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
              <Form.Item label="指标类型" name="indicatorType">
                <Select v-model:value="formState.indicatorType" placeholder="请选择指标类型">
                  <Select.Option value="1">年初指标</Select.Option>
                  <Select.Option value="2">年中追加</Select.Option>
                  <Select.Option value="3">课题指标</Select.Option>
                  <Select.Option value="4">虚拟指标</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="支出分类" name="expendCategory">
                <Input v-model:value="formState.expendCategory" placeholder="请输入支出分类" />
              </Form.Item>
              <Form.Item label="资金来源" name="fundSource">
                <Input v-model:value="formState.fundSource" placeholder="请输入资金来源" />
              </Form.Item>
              <Form.Item label="经济分类" name="econCategory">
                <Input v-model:value="formState.econCategory" placeholder="请输入经济分类" />
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
              <Form.Item label="年初金额" name="yearBeginAmount">
                <InputNumber
                  v-model:value="formState.yearBeginAmount"
                  placeholder="请输入年初金额"
                  class="w-full"
                  :min="0"
                  :precision="2"
                />
              </Form.Item>
              <Form.Item label="年度总额" name="yearTotalAmount">
                <InputNumber
                  v-model:value="formState.yearTotalAmount"
                  placeholder="请输入年度总额"
                  class="w-full"
                  :min="0"
                  :precision="2"
                />
              </Form.Item>
              <Form.Item label="可调剂" name="isAllowTransfer">
                <Radio.Group v-model:value="formState.isAllowTransfer">
                  <Radio value="1">是</Radio>
                  <Radio value="0">否</Radio>
                </Radio.Group>
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
              <Form.Item label="部门经济分类" name="deptEconCategory">
                <Input
                  v-model:value="formState.deptEconCategory"
                  placeholder="请输入部门经济分类"
                />
              </Form.Item>
              <Form.Item label="资金性质" name="fundNature">
                <Input v-model:value="formState.fundNature" placeholder="请输入资金性质" />
              </Form.Item>
            </Col>
          </Row>

          <Row :gutter="24">
            <Col :span="8">
              <Form.Item label="冻结金额" name="frozenAmount">
                <InputNumber
                  v-model:value="formState.frozenAmount"
                  class="w-full"
                  :min="0"
                  :precision="2"
                />
              </Form.Item>
            </Col>
            <Col :span="8">
              <Form.Item label="已支付" name="paidAmount">
                <InputNumber
                  v-model:value="formState.paidAmount"
                  class="w-full"
                  :min="0"
                  :precision="2"
                />
              </Form.Item>
            </Col>
            <Col :span="8">
              <Form.Item label="可用余额" name="availableAmount">
                <InputNumber
                  v-model:value="formState.availableAmount"
                  class="w-full"
                  :min="0"
                  :precision="2"
                />
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
