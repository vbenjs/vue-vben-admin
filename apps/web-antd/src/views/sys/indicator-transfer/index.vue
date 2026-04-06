<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import {
  Button,
  DatePicker,
  Form,
  Input,
  message,
  Table,
} from 'ant-design-vue';

import { indicatorTransferApi } from '#/api/core/sys-manage';
import { useCrudTable } from '#/composables/useCrudTable';

import {
  formatLegacyAmount,
  LEGACY_ATTACHMENT_COLUMNS,
  LEGACY_ATTACHMENT_TIP,
  LEGACY_TABLE_LOCALE,
  scrollLegacySection,
} from '../_shared/legacy-indicator';

import '../_shared/legacy-indicator.scss';

const defaultFormState = {
  transferNo: '',
  transferTotalAmount: 0,
  outAfterAvailable: 0,
  outDeptName: '',
  outEconCategory: '',
  outIndicatorName: '',
  outFuncCategory: '',
  outFundSource: '',
  outIsGovProcure: '0',
  outBeforeYearTotal: 0,
  outTransferAmount: 0,
  inAfterAvailable: 0,
  inDeptName: '',
  inEconCategory: '',
  inIndicatorName: '',
  inFuncCategory: '',
  inFundSource: '',
  inIsGovProcure: '0',
  inBeforeYearTotal: 0,
  inTransferAmount: 0,
  operatorName: '',
  transferDate: undefined as string | undefined,
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
  api: indicatorTransferApi,
  rowKey: 'id',
  defaultFormState,
  messages: {
    createSuccess: '新增调剂成功',
    updateSuccess: '更新调剂成功',
    deleteSuccess: '删除调剂成功',
  },
});
void formRef;

const searchParams = ref({
  transferNo: '',
  operatorName: '',
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

const outRows = computed(() => {
  if (
    !formState.value.outDeptName &&
    !formState.value.outIndicatorName &&
    !formState.value.outTransferAmount
  ) {
    return [];
  }

  return [
    {
      key: 'out-draft',
      seq: 1,
      deptName: formState.value.outDeptName,
      indicatorName: formState.value.outIndicatorName,
      funcCategory: formState.value.outFuncCategory,
      fundSource: formState.value.outFundSource,
      fiscalIndicator: formState.value.outEconCategory,
      isGovProcure: formState.value.outIsGovProcure,
      beforeYearTotal: formState.value.outBeforeYearTotal,
      availableAmount: formState.value.outAfterAvailable,
      transferAmount: formState.value.outTransferAmount,
    },
  ];
});

const inRows = computed(() => {
  if (
    !formState.value.inDeptName &&
    !formState.value.inIndicatorName &&
    !formState.value.inTransferAmount
  ) {
    return [];
  }

  return [
    {
      key: 'in-draft',
      seq: 1,
      deptName: formState.value.inDeptName,
      indicatorName: formState.value.inIndicatorName,
      funcCategory: formState.value.inFuncCategory,
      fundSource: formState.value.inFundSource,
      fiscalIndicator: formState.value.inEconCategory,
      isGovProcure: formState.value.inIsGovProcure,
      beforeYearTotal: formState.value.inBeforeYearTotal,
      availableAmount: formState.value.inAfterAvailable,
      transferAmount: formState.value.inTransferAmount,
    },
  ];
});

const listColumns = [
  { title: '调剂单号', dataIndex: 'transferNo', key: 'transferNo', width: 180 },
  {
    title: '经办人',
    dataIndex: 'operatorName',
    key: 'operatorName',
    width: 130,
  },
  {
    title: '调出指标',
    dataIndex: 'outIndicatorName',
    key: 'outIndicatorName',
    width: 200,
  },
  {
    title: '调入指标',
    dataIndex: 'inIndicatorName',
    key: 'inIndicatorName',
    width: 200,
  },
  { title: '备注', dataIndex: 'remark', key: 'remark', width: 220 },
  {
    title: '调剂日期',
    dataIndex: 'transferDate',
    key: 'transferDate',
    width: 160,
  },
];

const outDetailColumns = [
  { title: '序号', dataIndex: 'seq', key: 'seq', width: 72 },
  { title: '部门名称', dataIndex: 'deptName', key: 'deptName', width: 180 },
  {
    title: '*指标名称',
    dataIndex: 'indicatorName',
    key: 'indicatorName',
    width: 170,
  },
  {
    title: '功能分类',
    dataIndex: 'funcCategory',
    key: 'funcCategory',
    width: 140,
  },
  { title: '资金来源', dataIndex: 'fundSource', key: 'fundSource', width: 140 },
  { title: '财政指标', dataIndex: 'fiscalIndicator', key: 'fiscalIndicator', width: 120 },
  {
    title: '是否政采',
    dataIndex: 'isGovProcure',
    key: 'isGovProcure',
    width: 110,
  },
  {
    title: '调出前年总金额',
    dataIndex: 'beforeYearTotal',
    key: 'beforeYearTotal',
    width: 160,
  },
  {
    title: '可调出金额(元)',
    dataIndex: 'availableAmount',
    key: 'availableAmount',
    width: 150,
  },
  {
    title: '*调出金额(元)',
    dataIndex: 'transferAmount',
    key: 'transferAmount',
    width: 140,
  },
];

const inDetailColumns = [
  { title: '序号', dataIndex: 'seq', key: 'seq', width: 72 },
  { title: '部门名称', dataIndex: 'deptName', key: 'deptName', width: 180 },
  {
    title: '*指标名称',
    dataIndex: 'indicatorName',
    key: 'indicatorName',
    width: 170,
  },
  {
    title: '功能分类',
    dataIndex: 'funcCategory',
    key: 'funcCategory',
    width: 140,
  },
  { title: '资金来源', dataIndex: 'fundSource', key: 'fundSource', width: 140 },
  { title: '财政指标', dataIndex: 'fiscalIndicator', key: 'fiscalIndicator', width: 120 },
  {
    title: '是否政采',
    dataIndex: 'isGovProcure',
    key: 'isGovProcure',
    width: 110,
  },
  {
    title: '调入前年总金额',
    dataIndex: 'beforeYearTotal',
    key: 'beforeYearTotal',
    width: 160,
  },
  {
    title: '可调入金额(元)',
    dataIndex: 'availableAmount',
    key: 'availableAmount',
    width: 150,
  },
  {
    title: '*调入金额(元)',
    dataIndex: 'transferAmount',
    key: 'transferAmount',
    width: 140,
  },
];

const doFetch = (page = 1) => {
  selectedRowKeys.value = [];
  return fetchList(page, searchParams.value);
};

const resetFilters = () => {
  searchParams.value = {
    transferNo: '',
    operatorName: '',
  };
  void doFetch();
};

const openCreateModal = () => {
  openModal();
};

const openSelectedEditor = () => {
  if (!selectedRecord.value) {
    message.warning('请选择一条指标调剂数据');
    return;
  }
  openModal(selectedRecord.value);
};

const showPlaceholderMessage = (label: string) => {
  message.info(`${label}功能后续会按原系统交互继续补齐`);
};

const submitTransferForm = () => {
  const outAmount = Number(formState.value.outTransferAmount || 0);
  const inAmount = Number(formState.value.inTransferAmount || 0);
  formState.value.transferTotalAmount = Math.max(outAmount, inAmount);
  handleSubmit();
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
            v-model:value="searchParams.transferNo"
            placeholder="请输入调剂单号"
            allow-clear
            class="legacy-search-input"
          />
          <Input
            v-model:value="searchParams.operatorName"
            placeholder="请输入经办人"
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
            新增
          </Button>
          <Button class="legacy-toolbar-button" @click="openSelectedEditor"
            >详情</Button
          >
        </div>
      </div>

      <div class="legacy-content-panel legacy-content-panel--plain">
        <section class="legacy-table-panel">
          <Table
            class="legacy-table"
            row-key="id"
            bordered
            size="middle"
            :columns="listColumns"
            :data-source="dataSource"
            :loading="loading"
            :pagination="pagination"
            :row-selection="rowSelection"
            :locale="LEGACY_TABLE_LOCALE"
            :scroll="{ x: 1320 }"
            @change="onTableChange"
          />

          <div class="legacy-table-summary">
            <span>共 {{ pagination.total }} 条数据</span>
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
              @click="scrollLegacySection('transfer-out-section')"
            >
              <span>调出指标</span>
            </button>
            <button
              type="button"
              class="legacy-form-nav"
              @click="scrollLegacySection('transfer-in-section')"
            >
              <span>调入指标</span>
            </button>
            <button
              type="button"
              class="legacy-form-nav"
              @click="scrollLegacySection('transfer-attachment-section')"
            >
              <span>附件</span>
            </button>
          </aside>

          <div class="legacy-form-main">
            <div class="legacy-form-header">
              <h2 class="legacy-form-title">明细指标调剂单</h2>
            </div>

            <Form
              ref="formRef"
              :model="formState"
              :colon="false"
              layout="horizontal"
              class="legacy-form-body"
            >
              <div class="legacy-form-grid legacy-form-grid--two">
                <Form.Item label="调剂单号" name="transferNo">
                  <Input
                    v-model:value="formState.transferNo"
                    placeholder="保存后自动生成单号"
                  />
                </Form.Item>

                <Form.Item
                  label="经办人"
                  name="operatorName"
                  :rules="[{ required: true, message: '请输入经办人' }]"
                >
                  <Input
                    v-model:value="formState.operatorName"
                    placeholder="请输入经办人"
                  />
                </Form.Item>

                <Form.Item
                  label="调剂日期"
                  name="transferDate"
                  :rules="[{ required: true, message: '请选择调剂日期' }]"
                >
                  <DatePicker
                    v-model:value="formState.transferDate"
                    class="w-full"
                    value-format="YYYY-MM-DD"
                    placeholder="请选择调剂日期"
                  />
                </Form.Item>

                <Form.Item class="legacy-span-2" label="摘要" name="remark">
                  <Input.TextArea
                    v-model:value="formState.remark"
                    placeholder="请输入摘要"
                    :rows="3"
                  />
                </Form.Item>
              </div>

              <section id="transfer-out-section" class="legacy-form-section">
                <div class="legacy-transfer-heading">
                  <span class="legacy-section-title">调出指标</span>
                  <Button
                    type="primary"
                    class="legacy-transfer-add-button"
                    @click="showPlaceholderMessage('新增调出指标')"
                  >
                    新增
                  </Button>
                </div>

                <div class="legacy-hint-bar legacy-transfer-summary-bar">
                  数据量：{{ outRows.length }}　调出金额(元) 合计：{{
                    outRows.length > 0
                      ? formatLegacyAmount(formState.outTransferAmount)
                      : '0.00'
                  }}
                </div>

                <Table
                  class="legacy-embedded-table legacy-transfer-table"
                  bordered
                  size="small"
                  :columns="outDetailColumns"
                  :data-source="outRows"
                  :pagination="false"
                  :locale="LEGACY_TABLE_LOCALE"
                  :scroll="{ x: 1520 }"
                >
                  <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'isGovProcure'">
                      {{ record.isGovProcure === '1' ? '是' : '否' }}
                    </template>
                    <template
                      v-if="
                        ['beforeYearTotal', 'availableAmount', 'transferAmount'].includes(
                          String(column.key),
                        )
                      "
                    >
                      {{ formatLegacyAmount(record[String(column.key)]) }}
                    </template>
                  </template>
                </Table>
              </section>

              <section id="transfer-in-section" class="legacy-form-section">
                <div class="legacy-transfer-heading">
                  <span class="legacy-section-title">调入指标</span>
                  <Button
                    type="primary"
                    class="legacy-transfer-add-button"
                    @click="showPlaceholderMessage('新增调入指标')"
                  >
                    新增
                  </Button>
                </div>

                <div class="legacy-hint-bar legacy-transfer-summary-bar">
                  数据量：{{ inRows.length }}　调入金额(元) 合计：{{
                    inRows.length > 0
                      ? formatLegacyAmount(formState.inTransferAmount)
                      : '0.00'
                  }}
                </div>

                <Table
                  class="legacy-embedded-table legacy-transfer-table"
                  bordered
                  size="small"
                  :columns="inDetailColumns"
                  :data-source="inRows"
                  :pagination="false"
                  :locale="LEGACY_TABLE_LOCALE"
                  :scroll="{ x: 1520 }"
                >
                  <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'isGovProcure'">
                      {{ record.isGovProcure === '1' ? '是' : '否' }}
                    </template>
                    <template
                      v-if="
                        ['beforeYearTotal', 'availableAmount', 'transferAmount'].includes(
                          String(column.key),
                        )
                      "
                    >
                      {{ formatLegacyAmount(record[String(column.key)]) }}
                    </template>
                  </template>
                </Table>
              </section>

              <section
                id="transfer-attachment-section"
                class="legacy-form-section"
              >
                <div class="legacy-transfer-heading">
                  <span class="legacy-section-title">附件</span>
                  <Button
                    type="primary"
                    class="legacy-transfer-add-button"
                    @click="showPlaceholderMessage('上传附件')"
                    >上传</Button
                  >
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
                @click="submitTransferForm()"
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

<style scoped lang="scss">
.legacy-transfer-heading {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 8px;
}

.legacy-transfer-add-button.ant-btn {
  min-width: 66px;
  height: 32px;
  padding-inline: 16px;
  border-color: #5b9dff;
  border-radius: 2px;
  box-shadow: none;
}

.legacy-transfer-summary-bar {
  margin-bottom: 0;
  border-bottom: 0;
  border-radius: 0;
  padding: 10px 14px;
}

.legacy-transfer-table {
  margin-bottom: 18px;
}

:deep(.legacy-transfer-table.ant-table-wrapper .ant-table-thead > tr > th) {
  background: #fff;
  font-weight: 700;
}

:deep(.legacy-transfer-table.ant-table-wrapper .ant-table-tbody > tr > td) {
  padding-top: 11px;
  padding-bottom: 11px;
}

:deep(.legacy-transfer-table.ant-table-wrapper .ant-table-placeholder .ant-empty) {
  min-height: 48px;
}

:deep(.legacy-form-body textarea.ant-input) {
  resize: none;
}
</style>
