<script setup lang="ts">
// @ts-nocheck
import { onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import {
  Button,
  Card,
  Col,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Radio,
  Row,
  Select,
  Table,
  Tag,
  Tree,
} from 'ant-design-vue';

import { sysDictDataApi, sysDictTypeApi } from '#/api/core/sys-manage';
import StatusTag from '#/components/StatusTag/index.vue';
import { useCrudTable } from '#/composables/useCrudTable';

const typeLoading = ref(false);

// ========== 左侧字典类型 (sys_dict_type) ==========
const treeData = ref<any[]>([]);
const selectedKeys = ref<string[]>([]);
const searchType = ref('');

const fetchTypeList = async () => {
  try {
    typeLoading.value = true;
    const res = await sysDictTypeApi.getList({ dictName: searchType.value });
    treeData.value = (res || []).map((item: any) => ({
      ...item,
      title: `${item.dictName} (${item.dictType})`,
      key: item.dictType,
    }));
    if (treeData.value.length > 0 && selectedKeys.value.length === 0) {
      selectedKeys.value = [treeData.value[0].key];
      fetchDataList();
    }
  } finally {
    typeLoading.value = false;
  }
};

const initFinanceBaseData = async () => {
  await sysDictDataApi.bootstrapFinanceBase();
  message.success('已初始化财务基础数据');
  fetchTypeList();
};

const financeReferenceCards = [
  {
    title: '币种',
    dictType: 'currency_type',
    scene: '账套参数设置 / 默认币种',
  },
  {
    title: '凭证编号规则',
    dictType: 'voucher_rule',
    scene: '账套参数设置 / 核算策略',
  },
  {
    title: '预算控制',
    dictType: 'budget_control_mode',
    scene: '账套参数设置 / 控制规则',
  },
  {
    title: '预算控制开关',
    dictType: 'budget_control_switch',
    scene: '组织参数设置 / 控制规则',
  },
  {
    title: '付款方式',
    dictType: 'payment_method_type',
    scene: '组织参数设置 / 账套参数设置',
  },
  {
    title: '组织性质',
    dictType: 'org_nature',
    scene: '组织参数设置 / 账套参数设置',
  },
  {
    title: '预算来源',
    dictType: 'fund_source_type',
    scene: '组织参数设置 / 账套参数设置',
  },
  {
    title: '辅助维度',
    dictType: 'aux_accounting_dimension',
    scene: '组织参数设置 / 账套参数设置',
  },
];

// 类别弹窗
const {
  isModalVisible: isTypeModalVisible,
  formRef: typeFormRef,
  formState: typeFormState,
  submitting: submitTypeLoading,
  openModal: openTypeModal,
  handleSubmit: handleTypeSubmitCrud,
} = useCrudTable({
  api: sysDictTypeApi,
  rowKey: 'dictId',
  defaultFormState: {
    dictName: '',
    dictType: '',
    status: '0',
    remark: '',
  },
  messages: {
    createSuccess: '新增类别成功',
    updateSuccess: '修改类别成功',
  },
});

const handleTypeSubmit = async () => {
  await handleTypeSubmitCrud();
  fetchTypeList();
};

const handleDeleteType = async (id: number | string) => {
  await sysDictTypeApi.remove(id);
  message.success('删除成功');
  if (selectedKeys.value.length > 0) {
    // 找出当前被删除的那个项是否是选中的项，如果是则清空右侧
    const node = treeData.value.find((item) => item.dictId === id);
    if (node && selectedKeys.value.includes(node.key)) {
      selectedKeys.value = [];
      tableData.value = [];
    }
  }
  fetchTypeList();
};

// ========== 右侧字典明细 (sys_dict_data) ==========
const searchData = ref({ dictLabel: '', status: undefined });

const {
  loading: dataLoading,
  dataSource: tableData,
  isModalVisible: isDataModalVisible,
  submitting: submitDataLoading,
  formRef: dataFormRef,
  formState: dataFormState,
  fetchList,
  openModal: openDataModalCrud,
  handleSubmit: handleDataSubmitCrud,
  handleDelete: handleDeleteDataCrud,
} = useCrudTable({
  api: sysDictDataApi,
  rowKey: 'dictCode',
  defaultFormState: {
    dictLabel: '',
    dictValue: '',
    dictSort: 0,
    listClass: 'default',
    status: '0',
    remark: '',
    dictType: '',
  },
  messages: {
    createSuccess: '新增成功',
    updateSuccess: '修改成功',
    deleteSuccess: '删除成功',
  },
});

const columns = [
  { title: '字典标签', dataIndex: 'dictLabel', key: 'dictLabel' },
  { title: '字典键值', dataIndex: 'dictValue', key: 'dictValue' },
  { title: '排序', dataIndex: 'dictSort', key: 'dictSort' },
  { title: '样式', dataIndex: 'listClass', key: 'listClass' },
  { title: '状态', dataIndex: 'status', key: 'status' },
  { title: '操作', key: 'action', width: '150px' },
];

const fetchDataList = async () => {
  if (!selectedKeys.value || selectedKeys.value.length === 0) {
    tableData.value = [];
    return;
  }
  await fetchList(1, {
    dictType: selectedKeys.value[0],
    ...searchData.value,
  });
};

const handleSelect = (keys: any[]) => {
  if (keys.length > 0) {
    selectedKeys.value = keys;
    fetchDataList();
  }
};

const openDataModal = (record?: any) => {
  openDataModalCrud(record);
  if (!record) {
    dataFormState.value.dictType = selectedKeys.value[0];
  }
};

const handleDataSubmit = async () => {
  await handleDataSubmitCrud();
  fetchDataList();
};

const handleDeleteData = async (id: number | string) => {
  await handleDeleteDataCrud(id);
  fetchDataList();
};

onMounted(() => {
  fetchTypeList();
});
</script>

<template>
  <Page>
    <div class="p-4">

      <Row :gutter="16">
        <!-- 左侧：字典类别 -->
        <Col :span="6">
          <Card title="字典类别" :bordered="false" class="h-full">
            <template #extra>
              <Button type="link" size="small" @click="initFinanceBaseData">
                初始化财务基础数据
              </Button>
              <Button type="link" size="small" @click="openTypeModal()">
                新增分类
              </Button>
            </template>
            <div class="mb-4 flex gap-2">
              <Input.Search
                v-model:value="searchType"
                placeholder="搜索字典类型"
                @search="fetchTypeList"
                class="flex-1"
              />
            </div>
            <Tree
              v-model:selected-keys="selectedKeys"
              :tree-data="treeData"
              class="max-h-[600px] overflow-y-auto rounded border border-gray-100 p-2"
              @select="handleSelect"
            >
              <template #title="{ title, dataRef }">
                <div class="group flex w-full items-center justify-between">
                  <span class="truncate pr-2">{{ title }}</span>
                  <div class="hidden items-center gap-1 group-hover:flex">
                    <Button
                      type="link"
                      size="small"
                      class="!px-1 !py-0 text-xs"
                      @click.stop="openTypeModal(dataRef)"
                    >
                      ✏️
                    </Button>
                    <Popconfirm
                      title="删除分类？"
                      @confirm="handleDeleteType(dataRef.dictId)"
                    >
                      <Button
                        type="link"
                        danger
                        size="small"
                        class="!px-1 !py-0 text-xs"
                        @click.stop
                      >
                        ❌
                      </Button>
                    </Popconfirm>
                  </div>
                </div>
              </template>
            </Tree>
          </Card>
        </Col>

        <!-- 右侧：字典明细 -->
        <Col :span="18">
          <Card
            :title="`[ ${selectedKeys[0] || '请选择分类'} ] - 字典数据`"
            :bordered="false"
            class="h-full"
          >
            <template #extra>
              <Button type="primary" class="mr-2" @click="openDataModal()">
                新增字典项
              </Button>
            </template>

            <div class="mb-4 flex gap-4">
              <Input
                v-model:value="searchData.dictLabel"
                placeholder="字典标签 (如: 男)"
                class="w-64"
                allow-clear
              />
              <Select
                v-model:value="searchData.status"
                placeholder="状态"
                class="w-32"
                allow-clear
                :options="[
                  { label: '正常', value: '0' },
                  { label: '停用', value: '1' },
                ]"
              />
              <Button type="primary" @click="fetchDataList">搜索</Button>
              <Button
                @click="
                  () => {
                    searchData = { dictLabel: '', status: '' };
                    fetchDataList();
                  }
                "
              >
                重置
              </Button>
            </div>

            <Table
              :columns="columns"
              :data-source="tableData"
              bordered
              :pagination="false"
              :loading="dataLoading"
              row-key="dictCode"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'listClass'">
                  <Tag
                    :color="
                      record.listClass === 'default'
                        ? ''
                        : record.listClass === 'primary'
                          ? 'blue'
                          : record.listClass === 'success'
                            ? 'green'
                            : record.listClass === 'danger'
                              ? 'red'
                              : 'orange'
                    "
                  >
                    {{ record.listClass }}
                  </Tag>
                </template>
                <template v-if="column.key === 'status'">
                  <StatusTag :status="record.status" />
                </template>
                <template v-if="column.key === 'action'">
                  <Button
                    type="link"
                    size="small"
                    @click="openDataModal(record)"
                  >
                    编辑
                  </Button>
                  <Popconfirm
                    title="确定删除吗？"
                    @confirm="handleDeleteData(record.dictCode)"
                  >
                    <Button type="link" danger size="small">删除</Button>
                  </Popconfirm>
                </template>
              </template>
            </Table>
          </Card>
        </Col>
      </Row>
    </div>

    <!-- 字典类型弹窗 -->
    <Modal
      v-model:open="isTypeModalVisible"
      :title="typeFormState.dictId ? '编辑分类' : '新增分类'"
      @ok="handleTypeSubmit"
      :confirm-loading="submitTypeLoading"
      destroy-on-close
    >
      <Form
        ref="typeFormRef"
        :model="typeFormState"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 18 }"
        class="mt-4"
      >
        <Form.Item
          label="字典名称"
          name="dictName"
          :rules="[{ required: true, message: '请输入字典名称' }]"
        >
          <Input
            v-model:value="typeFormState.dictName"
            placeholder="如: 用户性别"
          />
        </Form.Item>
        <Form.Item
          label="字典类型"
          name="dictType"
          :rules="[{ required: true, message: '请输入字典类型' }]"
        >
          <Input
            v-model:value="typeFormState.dictType"
            placeholder="如: sys_user_sex"
          />
        </Form.Item>
        <Form.Item label="状态" name="status">
          <Radio.Group v-model:value="typeFormState.status">
            <Radio value="0">正常</Radio>
            <Radio value="1">停用</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="备注" name="remark">
          <Input.TextArea v-model:value="typeFormState.remark" />
        </Form.Item>
      </Form>
    </Modal>

    <!-- 字典数据弹窗 -->
    <Modal
      v-model:open="isDataModalVisible"
      :title="dataFormState.dictCode ? '编辑字典项' : '新增字典项'"
      @ok="handleDataSubmit"
      :confirm-loading="submitDataLoading"
      destroy-on-close
    >
      <Form
        ref="dataFormRef"
        :model="dataFormState"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 18 }"
        class="mt-4"
      >
        <Form.Item label="字典类型" name="dictType">
          <Input v-model:value="dataFormState.dictType" disabled />
        </Form.Item>
        <Form.Item
          label="数据标签"
          name="dictLabel"
          :rules="[{ required: true, message: '请输入标签' }]"
        >
          <Input v-model:value="dataFormState.dictLabel" placeholder="如: 男" />
        </Form.Item>
        <Form.Item
          label="数据键值"
          name="dictValue"
          :rules="[{ required: true, message: '请输入键值' }]"
        >
          <Input v-model:value="dataFormState.dictValue" placeholder="如: 1" />
        </Form.Item>
        <Form.Item label="样式属性" name="listClass">
          <Select
            v-model:value="dataFormState.listClass"
            :options="[
              { label: '默认(default)', value: 'default' },
              { label: '主要(primary)', value: 'primary' },
              { label: '成功(success)', value: 'success' },
              { label: '警告(warning)', value: 'warning' },
              { label: '危险(danger)', value: 'danger' },
            ]"
          />
        </Form.Item>
        <Form.Item label="显示排序" name="dictSort">
          <Input type="number" v-model:value="dataFormState.dictSort" />
        </Form.Item>
        <Form.Item label="状态" name="status">
          <Radio.Group v-model:value="dataFormState.status">
            <Radio value="0">正常</Radio>
            <Radio value="1">停用</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="备注" name="remark">
          <Input.TextArea v-model:value="dataFormState.remark" />
        </Form.Item>
      </Form>
    </Modal>
  </Page>
</template>

<style scoped>
/* Scoped styles can go here */
</style>
