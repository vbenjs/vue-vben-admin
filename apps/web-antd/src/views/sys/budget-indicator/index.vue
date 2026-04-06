<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import {
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Popconfirm,
  Radio,
  Select,
  Table,
  Tag,
  Tree,
} from 'ant-design-vue';

import { budgetIndicatorApi } from '#/api/core/sys-manage';
import { useCrudTable } from '#/composables/useCrudTable';

import {
  DEFAULT_LEGACY_DEPT_NAME,
  filterLegacyOrgTree,
  formatLegacyAmount,
  LEGACY_ATTACHMENT_COLUMNS,
  LEGACY_ATTACHMENT_TIP,
  LEGACY_TABLE_LOCALE,
  scrollLegacySection,
} from '../_shared/legacy-indicator';
import LegacyPickerInput from '../_shared/LegacyPickerInput.vue';

import '../_shared/legacy-indicator.scss';

const defaultFormState = {
  indicatorCode: '',
  indicatorName: '',
  indicatorType: '1',
  deptName: DEFAULT_LEGACY_DEPT_NAME,
  subProjectName: '',
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
  isPreApply: '1',
  projectCategory: '',
  govEconCategory: '',
  deptEconCategory: '',
  fundNature: '',
  indicatorDocNo: '',
  accountSubject: '',
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
  isGovProcure: undefined as string | undefined,
});

const indicatorTypeMap: Record<string, string> = {
  '1': '年初指标',
  '2': '年中追加',
  '3': '课题指标',
  '4': '虚拟指标',
};

const selectedRowKeys = ref<Array<number | string>>([]);
const orgSearch = ref('');
const activeDeptName = ref(DEFAULT_LEGACY_DEPT_NAME);
const activeOrgKeys = ref<Array<number | string>>(['org-005001']);

const treeData = computed(() => filterLegacyOrgTree(orgSearch.value));
const selectedRecord = computed(() =>
  dataSource.value.find(
    (item) => String(item.id) === String(selectedRowKeys.value[0] || ''),
  ),
);
const rowSelection = computed(() => ({
  selectedRowKeys: selectedRowKeys.value,
  onChange: (keys: Array<number | string>) => {
    selectedRowKeys.value = keys;
  },
}));

const columns = [
  { title: '组织机构', dataIndex: 'deptName', key: 'deptName', width: 220 },
  {
    title: '指标编码',
    dataIndex: 'indicatorCode',
    key: 'indicatorCode',
    width: 180,
  },
  {
    title: '二级项目名称',
    dataIndex: 'indicatorName',
    key: 'indicatorName',
    width: 200,
  },
  {
    title: '子项目名称',
    dataIndex: 'subProjectName',
    key: 'subProjectName',
    width: 180,
  },
  {
    title: '指标类别',
    dataIndex: 'indicatorType',
    key: 'indicatorType',
    width: 120,
  },
  {
    title: '年初金额',
    dataIndex: 'yearBeginAmount',
    key: 'yearBeginAmount',
    width: 140,
  },
  {
    title: '可用余额',
    dataIndex: 'availableAmount',
    key: 'availableAmount',
    width: 140,
  },
  {
    title: '状态',
    dataIndex: 'indicatorStatus',
    key: 'indicatorStatus',
    width: 100,
  },
  { title: '操作', key: 'action', width: 140, fixed: 'right' as const },
];

const doFetch = (page = 1) => {
  selectedRowKeys.value = [];
  return fetchList(page, {
    deptName: activeDeptName.value,
    indicatorCode: searchParams.value.indicatorCode,
    indicatorName: searchParams.value.indicatorName,
    isGovProcure: searchParams.value.isGovProcure,
  });
};

const resetFilters = () => {
  searchParams.value = {
    indicatorCode: '',
    indicatorName: '',
    isGovProcure: undefined,
  };
  void doFetch();
};

const openCreateModal = () => {
  openModal();
  formState.value.deptName = activeDeptName.value;
};

const openSelectedEditor = () => {
  if (!selectedRecord.value) {
    message.warning('请选择一条部门指标数据');
    return;
  }
  openModal(selectedRecord.value);
};

const deleteSelectedRecord = async () => {
  if (!selectedRecord.value) {
    message.warning('请选择一条部门指标数据');
    return;
  }
  await handleDelete(selectedRecord.value.id);
  selectedRowKeys.value = [];
};

const handleOrgSelect = (keys: Array<number | string>, info: any) => {
  if (keys.length === 0) {
    return;
  }
  activeOrgKeys.value = keys;
  activeDeptName.value = info?.node?.deptName || DEFAULT_LEGACY_DEPT_NAME;
  void doFetch();
};

const showPlaceholderMessage = (label: string) => {
  message.info(`${label}功能后续会按原系统交互继续补齐`);
};

onMounted(() => {
  void doFetch();
});
</script>

<template>
  <Page
    class="legacy-list-page"
    content-class="!overflow-hidden !px-1 !py-1"
    auto-content-height
  >
    <div class="legacy-page-shell">
      <div class="legacy-search-bar">
        <div class="legacy-search-fields">
          <Input
            v-model:value="searchParams.indicatorCode"
            placeholder="请输入指标编码"
            allow-clear
            class="legacy-search-input"
          />
          <Input
            v-model:value="searchParams.indicatorName"
            placeholder="请输入二级项目名称"
            allow-clear
            class="legacy-search-input"
          />
          <Select
            v-model:value="searchParams.isGovProcure"
            allow-clear
            placeholder="请选择是否政府采购"
            class="legacy-search-input"
          >
            <Select.Option value="1">是</Select.Option>
            <Select.Option value="0">否</Select.Option>
          </Select>
        </div>
        <div class="legacy-search-actions">
          <Button type="primary" @click="doFetch()">搜索</Button>
          <Button @click="resetFilters">重置</Button>
        </div>
      </div>

      <div class="legacy-toolbar">
        <div class="legacy-toolbar-actions">
          <Button
            type="primary"
            class="legacy-toolbar-button"
            @click="openCreateModal"
          >
            新增
          </Button>
          <Button class="legacy-toolbar-button" @click="openSelectedEditor"
            >修改</Button
          >
          <Button class="legacy-toolbar-button" @click="openSelectedEditor"
            >详情</Button
          >
          <Popconfirm
            title="确定删除选中数据吗？"
            @confirm="deleteSelectedRecord"
          >
            <Button class="legacy-toolbar-button">删除</Button>
          </Popconfirm>
          <Button
            class="legacy-toolbar-button"
            @click="showPlaceholderMessage('指标公用')"
          >
            指标公用
          </Button>
          <Button
            class="legacy-toolbar-button"
            @click="showPlaceholderMessage('导入')"
          >
            导入
          </Button>
          <Button
            class="legacy-toolbar-button"
            @click="showPlaceholderMessage('导出')"
          >
            导出
          </Button>
          <Button
            class="legacy-toolbar-button"
            @click="showPlaceholderMessage('一键授权')"
          >
            一键授权
          </Button>
        </div>
      </div>

      <div class="legacy-content-panel">
        <aside class="legacy-org-panel">
          <div class="legacy-org-search">
            <Input
              v-model:value="orgSearch"
              placeholder="搜索组织机构"
              allow-clear
              size="small"
            />
          </div>
          <Tree
            v-model:selected-keys="activeOrgKeys"
            :tree-data="treeData"
            block-node
            default-expand-all
            class="legacy-org-tree"
            @select="handleOrgSelect"
          />
        </aside>

        <section class="legacy-table-panel">
          <Table
            class="legacy-table"
            row-key="id"
            bordered
            size="middle"
            :columns="columns"
            :data-source="dataSource"
            :loading="loading"
            :pagination="pagination"
            :row-selection="rowSelection"
            :locale="LEGACY_TABLE_LOCALE"
            :scroll="{ x: 1500 }"
            @change="onTableChange"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'indicatorType'">
                {{ indicatorTypeMap[record.indicatorType] || '未分类' }}
              </template>
              <template
                v-if="
                  ['yearBeginAmount', 'availableAmount'].includes(
                    String(column.key),
                  )
                "
              >
                {{ formatLegacyAmount(record[String(column.key)]) }}
              </template>
              <template v-if="column.key === 'indicatorStatus'">
                <Tag
                  :color="record.indicatorStatus === '0' ? 'success' : 'error'"
                >
                  {{ record.indicatorStatus === '0' ? '正常' : '停用' }}
                </Tag>
              </template>
              <template v-if="column.key === 'action'">
                <Button type="link" size="small" @click="openModal(record)"
                  >修改</Button
                >
                <Popconfirm
                  title="确定删除吗？"
                  @confirm="handleDelete(record.id)"
                >
                  <Button type="link" danger size="small">删除</Button>
                </Popconfirm>
              </template>
            </template>
          </Table>

          <div class="legacy-table-summary">
            <span>共{{ pagination.total }}条数据</span>
          </div>
        </section>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="isModalVisible" class="legacy-form-overlay">
        <div class="legacy-form-dialog legacy-form-dialog--wide">
          <aside class="legacy-form-aside">
            <button
              type="button"
              class="legacy-form-nav is-active"
              @click="scrollLegacySection('budget-attachment-section')"
            >
              <span>附件</span>
            </button>
          </aside>

          <div class="legacy-form-main">
            <div class="legacy-form-header">
              <h2 class="legacy-form-title">指标基础信息</h2>
            </div>

            <Form
              ref="formRef"
              :model="formState"
              :colon="false"
              layout="horizontal"
              label-align="left"
              class="legacy-form-body"
            >
              <div class="legacy-form-grid legacy-form-grid--two">
                <Form.Item label="组织机构" name="deptName">
                  <LegacyPickerInput
                    v-model:value="formState.deptName"
                    placeholder="请输入组织机构"
                    readonly
                    @trigger="showPlaceholderMessage('选择组织机构')"
                  />
                </Form.Item>

                <Form.Item
                  label="指标编码"
                  name="indicatorCode"
                  :rules="[{ required: true, message: '请输入指标编码' }]"
                >
                  <Input
                    v-model:value="formState.indicatorCode"
                    placeholder="请输入指标编码"
                  />
                </Form.Item>

                <Form.Item
                  label="子项目名称"
                  name="subProjectName"
                  :rules="[{ required: true, message: '请输入子项目名称' }]"
                >
                  <Input
                    v-model:value="formState.subProjectName"
                    placeholder="请输入子项目名称"
                  />
                </Form.Item>

                <Form.Item
                  label="二级项目名称"
                  name="indicatorName"
                  :rules="[{ required: true, message: '请输入二级项目名称' }]"
                >
                  <Input
                    v-model:value="formState.indicatorName"
                    placeholder="请输入二级项目名称"
                  />
                </Form.Item>

                <Form.Item label="项目分类" name="projectCategory">
                  <Select
                    v-model:value="formState.projectCategory"
                    placeholder="请选择项目分类"
                  >
                    <Select.Option value="1">基本支出</Select.Option>
                    <Select.Option value="2">项目支出</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item label="功能分类" name="funcCategory">
                  <LegacyPickerInput
                    v-model:value="formState.funcCategory"
                    placeholder="请输入功能分类"
                    readonly
                    @trigger="showPlaceholderMessage('选择功能分类')"
                  />
                </Form.Item>

                <Form.Item label="经济分类" name="econCategory">
                  <LegacyPickerInput
                    v-model:value="formState.econCategory"
                    placeholder="请输入经济分类"
                    readonly
                    @trigger="showPlaceholderMessage('选择经济分类')"
                  />
                </Form.Item>

                <Form.Item label="指标类别" name="indicatorType">
                  <Select
                    v-model:value="formState.indicatorType"
                    placeholder="请选择指标类别"
                  >
                    <Select.Option value="1">年初指标</Select.Option>
                    <Select.Option value="2">年中追加</Select.Option>
                    <Select.Option value="3">课题指标</Select.Option>
                    <Select.Option value="4">虚拟指标</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item label="政府经济分类" name="govEconCategory">
                  <LegacyPickerInput
                    v-model:value="formState.govEconCategory"
                    placeholder="请输入政府经济分类"
                    readonly
                    @trigger="showPlaceholderMessage('选择政府经济分类')"
                  />
                </Form.Item>

                <Form.Item label="指标文号" name="indicatorDocNo">
                  <Input
                    v-model:value="formState.indicatorDocNo"
                    placeholder="请输入指标文号"
                  />
                </Form.Item>

                <Form.Item label="是否政府采购" name="isGovProcure">
                  <Radio.Group v-model:value="formState.isGovProcure">
                    <Radio value="1">是</Radio>
                    <Radio value="0">否</Radio>
                  </Radio.Group>
                </Form.Item>

                <Form.Item label="年初金额" name="yearBeginAmount">
                  <InputNumber
                    v-model:value="formState.yearBeginAmount"
                    :min="0"
                    :precision="2"
                    :controls="false"
                    placeholder="请输入年初金额"
                  />
                </Form.Item>

                <Form.Item label="是否参与调剂" name="isAllowTransfer">
                  <Radio.Group v-model:value="formState.isAllowTransfer">
                    <Radio value="1">是</Radio>
                    <Radio value="0">否</Radio>
                  </Radio.Group>
                </Form.Item>

                <Form.Item label="会计科目" name="accountSubject">
                  <Input
                    v-model:value="formState.accountSubject"
                    placeholder="请输入会计科目"
                  />
                </Form.Item>

                <Form.Item label="是否事前申请" name="isPreApply">
                  <Radio.Group v-model:value="formState.isPreApply">
                    <Radio value="1">是</Radio>
                    <Radio value="0">否</Radio>
                  </Radio.Group>
                </Form.Item>

                <Form.Item label="资金来源" name="fundSource">
                  <LegacyPickerInput
                    v-model:value="formState.fundSource"
                    placeholder="请输入资金来源"
                    readonly
                    @trigger="showPlaceholderMessage('选择资金来源')"
                  />
                </Form.Item>

                <Form.Item label="资金性质" name="fundNature">
                  <LegacyPickerInput
                    v-model:value="formState.fundNature"
                    placeholder="请输入资金性质"
                    readonly
                    @trigger="showPlaceholderMessage('选择资金性质')"
                  />
                </Form.Item>

                <Form.Item class="legacy-span-2" label="备注" name="remark">
                  <Input.TextArea
                    v-model:value="formState.remark"
                    placeholder="请输入备注"
                    :rows="4"
                    :maxlength="500"
                    show-count
                  />
                </Form.Item>
              </div>

              <section
                id="budget-attachment-section"
                class="legacy-form-section"
              >
                <div class="legacy-section-heading">
                  <span class="legacy-section-title">附件</span>
                  <div class="legacy-section-actions">
                    <Button
                      type="primary"
                      @click="showPlaceholderMessage('上传附件')"
                      >上传</Button
                    >
                  </div>
                </div>

                <div class="legacy-hint-bar">
                  {{ LEGACY_ATTACHMENT_TIP }}
                </div>

                <Table
                  class="legacy-embedded-table"
                  bordered
                  size="small"
                  :columns="LEGACY_ATTACHMENT_COLUMNS"
                  :data-source="[]"
                  :pagination="false"
                  :locale="LEGACY_TABLE_LOCALE"
                />
              </section>
            </Form>

            <div class="legacy-form-footer">
              <Button
                type="primary"
                :loading="submitting"
                @click="handleSubmit()"
                >保存</Button
              >
              <Button @click="isModalVisible = false">返回</Button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </Page>
</template>
