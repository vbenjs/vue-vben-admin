<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Select,
  Table,
  Tag,
} from 'ant-design-vue';

import { indicatorAdjustApi } from '#/api/core/sys-manage';
import { useCrudTable } from '#/composables/useCrudTable';

import {
  DEFAULT_LEGACY_DEPT_NAME,
  formatLegacyAmount,
  LEGACY_ATTACHMENT_COLUMNS,
  LEGACY_ATTACHMENT_TIP,
  LEGACY_TABLE_LOCALE,
  scrollLegacySection,
} from '../_shared/legacy-indicator';

import '../_shared/legacy-indicator.scss';

const defaultFormState = {
  adjustNo: '',
  indicatorName: '',
  indicatorCode: '',
  deptName: DEFAULT_LEGACY_DEPT_NAME,
  adjustType: '1',
  adjustAmount: 0,
  operatorName: '',
  adjustDate: undefined as string | undefined,
  isVoid: '0',
  status: '0',
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
  onTableChange,
} = useCrudTable({
  api: indicatorAdjustApi,
  rowKey: 'id',
  defaultFormState,
  messages: {
    createSuccess: '新增调整成功',
    updateSuccess: '更新调整成功',
    deleteSuccess: '删除调整成功',
  },
});
void formRef;

const searchParams = ref({
  adjustNo: '',
  indicatorName: '',
});

const selectedRowKeys = ref<Array<number | string>>([]);
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

const detailRows = computed(() => {
  if (
    !formState.value.indicatorCode &&
    !formState.value.indicatorName &&
    !formState.value.adjustAmount
  ) {
    return [];
  }

  return [
    {
      key: 'draft',
      deptName: formState.value.deptName,
      indicatorName: formState.value.indicatorName,
      indicatorCode: formState.value.indicatorCode,
      yearBeginAmount: '-',
      yearTotalAmount: '-',
      fundSource: '-',
      adjustAmount: formState.value.adjustAmount,
    },
  ];
});

const columns = [
  { title: '单号', dataIndex: 'adjustNo', key: 'adjustNo', width: 170 },
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
  { title: '调整类型', dataIndex: 'adjustType', key: 'adjustType', width: 120 },
  {
    title: '调整金额',
    dataIndex: 'adjustAmount',
    key: 'adjustAmount',
    width: 140,
  },
  { title: '调整日期', dataIndex: 'adjustDate', key: 'adjustDate', width: 150 },
  { title: '是否作废', dataIndex: 'isVoid', key: 'isVoid', width: 110 },
  { title: '摘要', dataIndex: 'remark', key: 'remark', width: 200 },
];

const detailColumns = [
  { title: '序号', dataIndex: 'seq', key: 'seq', width: 72 },
  { title: '组织机构', dataIndex: 'deptName', key: 'deptName', width: 220 },
  {
    title: '二级项目名称',
    dataIndex: 'indicatorName',
    key: 'indicatorName',
    width: 200,
  },
  {
    title: '指标编码',
    dataIndex: 'indicatorCode',
    key: 'indicatorCode',
    width: 180,
  },
  {
    title: '年初指标（元）',
    dataIndex: 'yearBeginAmount',
    key: 'yearBeginAmount',
    width: 150,
  },
  {
    title: '年度总金额（元）',
    dataIndex: 'yearTotalAmount',
    key: 'yearTotalAmount',
    width: 170,
  },
  { title: '资金来源', dataIndex: 'fundSource', key: 'fundSource', width: 150 },
  {
    title: '操作金额',
    dataIndex: 'adjustAmount',
    key: 'adjustAmount',
    width: 130,
  },
];

const doFetch = (page = 1) => {
  selectedRowKeys.value = [];
  return fetchList(page, searchParams.value);
};

const resetFilters = () => {
  searchParams.value = {
    adjustNo: '',
    indicatorName: '',
  };
  void doFetch();
};

const openCreateModal = () => {
  openModal();
  formState.value.deptName = DEFAULT_LEGACY_DEPT_NAME;
};

const openSelectedEditor = () => {
  if (!selectedRecord.value) {
    message.warning('请选择一条追加追减数据');
    return;
  }
  openModal(selectedRecord.value);
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
            v-model:value="searchParams.adjustNo"
            placeholder="请输入单号"
            allow-clear
            class="legacy-search-input"
          />
          <Input
            v-model:value="searchParams.indicatorName"
            placeholder="请输入二级项目名称"
            allow-clear
            class="legacy-search-input"
          />
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
            追加追减
          </Button>
          <Button class="legacy-toolbar-button" @click="openSelectedEditor"
            >详情</Button
          >
          <Button
            class="legacy-toolbar-button"
            @click="showPlaceholderMessage('打印')"
          >
            打印
          </Button>
        </div>
      </div>

      <div class="legacy-content-panel legacy-content-panel--plain">
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
            :scroll="{ x: 1600 }"
            @change="onTableChange"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'adjustType'">
                <Tag :color="record.adjustType === '1' ? 'success' : 'error'">
                  {{ record.adjustType === '1' ? '追加' : '追减' }}
                </Tag>
              </template>
              <template v-if="column.key === 'adjustAmount'">
                {{ formatLegacyAmount(record.adjustAmount) }}
              </template>
              <template v-if="column.key === 'isVoid'">
                {{ record.isVoid === '1' ? '是' : '否' }}
              </template>
            </template>
          </Table>

          <div class="legacy-table-summary">
            <span>共 {{ pagination.total }} 条数据</span>
          </div>
        </section>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="isModalVisible" class="legacy-form-overlay">
        <div class="legacy-form-dialog legacy-form-dialog--medium">
          <aside class="legacy-form-aside">
            <button
              type="button"
              class="legacy-form-nav is-active"
              @click="scrollLegacySection('adjust-detail-section')"
            >
              <span>追加追减指标明细</span>
            </button>
            <button
              type="button"
              class="legacy-form-nav"
              @click="scrollLegacySection('adjust-attachment-section')"
            >
              <span>附件</span>
            </button>
          </aside>

          <div class="legacy-form-main">
            <div class="legacy-form-header">
              <h2 class="legacy-form-title">指标追加追减</h2>
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
                <Form.Item label="经办部门" name="deptName">
                  <Input
                    v-model:value="formState.deptName"
                    placeholder="请输入经办部门"
                  />
                </Form.Item>

                <Form.Item label="操作类型" name="adjustType">
                  <Select
                    v-model:value="formState.adjustType"
                    placeholder="请选择操作类型"
                  >
                    <Select.Option value="1">追加</Select.Option>
                    <Select.Option value="2">追减</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item label="单号" name="adjustNo">
                  <Input
                    v-model:value="formState.adjustNo"
                    placeholder="保存后自动生成单号"
                  />
                </Form.Item>

                <Form.Item
                  label="操作金额"
                  name="adjustAmount"
                  :rules="[{ required: true, message: '请输入操作金额' }]"
                >
                  <InputNumber
                    v-model:value="formState.adjustAmount"
                    :min="0"
                    :precision="2"
                    :controls="false"
                    placeholder="请输入操作金额"
                  />
                </Form.Item>

                <Form.Item label="指标编码" name="indicatorCode">
                  <Input
                    v-model:value="formState.indicatorCode"
                    placeholder="请输入指标编码"
                  />
                </Form.Item>

                <Form.Item label="调整日期" name="adjustDate">
                  <DatePicker
                    v-model:value="formState.adjustDate"
                    class="w-full"
                    value-format="YYYY-MM-DD"
                    placeholder="请选择调整日期"
                  />
                </Form.Item>

                <Form.Item
                  class="legacy-span-2"
                  label="二级项目名称"
                  name="indicatorName"
                >
                  <Input
                    v-model:value="formState.indicatorName"
                    placeholder="请输入二级项目名称"
                  />
                </Form.Item>

                <Form.Item class="legacy-span-2" label="摘要" name="remark">
                  <Input.TextArea
                    v-model:value="formState.remark"
                    placeholder="请输入摘要"
                    :rows="4"
                    :maxlength="500"
                    show-count
                  />
                </Form.Item>
              </div>

              <section id="adjust-detail-section" class="legacy-form-section">
                <div class="legacy-section-heading">
                  <span class="legacy-section-title">追加追减指标明细</span>
                  <div class="legacy-section-actions">
                    <Button
                      type="primary"
                      @click="showPlaceholderMessage('新增指标明细')"
                    >
                      新增
                    </Button>
                  </div>
                </div>

                <div class="legacy-hint-bar">
                  数据量：{{ detailRows.length }}，操作金额合计：{{
                    detailRows.length > 0
                      ? formatLegacyAmount(formState.adjustAmount)
                      : '0.00'
                  }}
                </div>

                <Table
                  class="legacy-embedded-table"
                  bordered
                  size="small"
                  :columns="detailColumns"
                  :data-source="
                    detailRows.map((item, index) => ({
                      ...item,
                      seq: index + 1,
                    }))
                  "
                  :pagination="false"
                  :locale="LEGACY_TABLE_LOCALE"
                  :scroll="{ x: 1320 }"
                >
                  <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'adjustAmount'">
                      {{ formatLegacyAmount(record.adjustAmount) }}
                    </template>
                  </template>
                </Table>
              </section>

              <section
                id="adjust-attachment-section"
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
