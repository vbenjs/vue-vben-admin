<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';

import { Page } from '@vben/common-ui';
import { useUserStore } from '@vben/stores';

import {
  Button,
  Card,
  Form,
  FormItem,
  Input,
  message,
  Select,
  Switch,
  Tabs,
  Tag,
} from 'ant-design-vue';

import { sysConfigApi, sysDictDataApi } from '#/api/core/sys-manage';

const userStore = useUserStore();

const activeTab = ref('basic');
const formData = reactive({
  defaultFiscalYear: userStore.userInfo?.fiscalYear || '2026',
  defaultCurrency: 'CNY',
  voucherRule: '统一编号',
  budgetControlMode: '严格控制',
  defaultPaymentMethod: '银行转账',
  orgNature: '事业单位',
  fundSourceType: '财政拨款',
  auxAccountingDimension: '部门',
  autoCarryForward: true,
  enableAuxAccounting: true,
  tenantDisplayName: userStore.userInfo?.tenantName || '',
});
const currencyOptions = ref([
  { label: '人民币 CNY', value: 'CNY' },
  { label: '美元 USD', value: 'USD' },
]);
const voucherRuleOptions = ref([
  { label: '统一编号', value: '统一编号' },
  { label: '按月编号', value: '按月编号' },
]);
const budgetControlModeOptions = ref([
  { label: '严格控制', value: '严格控制' },
  { label: '预警控制', value: '预警控制' },
  { label: '不控制', value: '不控制' },
]);
const paymentMethodOptions = ref([{ label: '银行转账', value: '银行转账' }]);
const orgNatureOptions = ref([{ label: '事业单位', value: '事业单位' }]);
const fundSourceTypeOptions = ref([{ label: '财政拨款', value: '财政拨款' }]);
const auxAccountingDimensionOptions = ref([{ label: '部门', value: '部门' }]);

const financeReferenceTags = [
  { color: 'blue', label: '币种', type: 'currency_type' },
  { color: 'cyan', label: '凭证编号规则', type: 'voucher_rule' },
  { color: 'gold', label: '预算控制模式', type: 'budget_control_mode' },
  { color: 'green', label: '付款方式', type: 'payment_method_type' },
  { color: 'purple', label: '辅助维度', type: 'aux_accounting_dimension' },
  { color: 'magenta', label: '预算来源', type: 'fund_source_type' },
];

const isSaving = ref(false);

const pageDescription = computed(() => {
  const parts = ['维护账套级业务与核算参数'];
  if (userStore.userInfo?.tenantName)
    parts.push(`当前账套：${userStore.userInfo.tenantName}`);
  if (userStore.userInfo?.fiscalYear)
    parts.push(`当前年度：${userStore.userInfo.fiscalYear}`);
  return parts.join(' ｜ ');
});

onMounted(async () => {
  const [
    currencyData,
    voucherRuleData,
    budgetControlModeData,
    paymentMethodData,
    orgNatureData,
    fundSourceTypeData,
    auxAccountingDimensionData,
  ] = await Promise.all([
    sysDictDataApi.getByType('currency_type').catch(() => []),
    sysDictDataApi.getByType('voucher_rule').catch(() => []),
    sysDictDataApi.getByType('budget_control_mode').catch(() => []),
    sysDictDataApi.getByType('payment_method_type').catch(() => []),
    sysDictDataApi.getByType('org_nature').catch(() => []),
    sysDictDataApi.getByType('fund_source_type').catch(() => []),
    sysDictDataApi.getByType('aux_accounting_dimension').catch(() => []),
  ]);
  if (currencyData?.length)
    currencyOptions.value = currencyData.map((item: any) => ({
      label: item.dictLabel,
      value: item.dictValue,
    }));
  if (voucherRuleData?.length)
    voucherRuleOptions.value = voucherRuleData.map((item: any) => ({
      label: item.dictLabel,
      value: item.dictValue,
    }));
  if (budgetControlModeData?.length)
    budgetControlModeOptions.value = budgetControlModeData.map((item: any) => ({
      label: item.dictLabel,
      value: item.dictValue,
    }));
  if (paymentMethodData?.length)
    paymentMethodOptions.value = paymentMethodData.map((item: any) => ({
      label: item.dictLabel,
      value: item.dictValue,
    }));
  if (orgNatureData?.length)
    orgNatureOptions.value = orgNatureData.map((item: any) => ({
      label: item.dictLabel,
      value: item.dictValue,
    }));
  if (fundSourceTypeData?.length)
    fundSourceTypeOptions.value = fundSourceTypeData.map((item: any) => ({
      label: item.dictLabel,
      value: item.dictValue,
    }));
  if (auxAccountingDimensionData?.length)
    auxAccountingDimensionOptions.value = auxAccountingDimensionData.map(
      (item: any) => ({ label: item.dictLabel, value: item.dictValue }),
    );

  const data = await sysConfigApi.getGroup('tenant');
  formData.defaultFiscalYear =
    data.defaultFiscalYear || formData.defaultFiscalYear;
  formData.defaultCurrency = data.defaultCurrency || formData.defaultCurrency;
  formData.voucherRule = data.voucherRule || formData.voucherRule;
  formData.budgetControlMode =
    data.budgetControlMode || formData.budgetControlMode;
  formData.defaultPaymentMethod =
    data.defaultPaymentMethod || formData.defaultPaymentMethod;
  formData.orgNature = data.orgNature || formData.orgNature;
  formData.fundSourceType = data.fundSourceType || formData.fundSourceType;
  formData.auxAccountingDimension =
    data.auxAccountingDimension || formData.auxAccountingDimension;
  formData.tenantDisplayName = data.displayName || formData.tenantDisplayName;
  formData.autoCarryForward = (data.autoCarryForward || 'true') === 'true';
  formData.enableAuxAccounting =
    (data.enableAuxAccounting || 'true') === 'true';
});

const handleSave = async () => {
  isSaving.value = true;
  try {
    await sysConfigApi.saveGroup('tenant', {
      defaultFiscalYear: formData.defaultFiscalYear,
      defaultCurrency: formData.defaultCurrency,
      voucherRule: formData.voucherRule,
      budgetControlMode: formData.budgetControlMode,
      defaultPaymentMethod: formData.defaultPaymentMethod,
      orgNature: formData.orgNature,
      fundSourceType: formData.fundSourceType,
      auxAccountingDimension: formData.auxAccountingDimension,
      displayName: formData.tenantDisplayName,
      autoCarryForward: String(formData.autoCarryForward),
      enableAuxAccounting: String(formData.enableAuxAccounting),
    });
    message.success('账套参数保存成功');
  } catch (error: any) {
    message.error(error?.message || '保存失败');
  } finally {
    isSaving.value = false;
  }
};
</script>

<template>
  <Page>
    <div class="p-4">

      <Card :bordered="false" class="mb-4">
        <Tabs v-model:active-key="activeTab">
          <Tabs.TabPane key="basic" tab="基础参数">
            <div
              class="mb-4 rounded border border-dashed border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500"
            >
              维护账套的显示名称、默认年度、币种及基础属性，登录上下文会优先读取这里的配置。
            </div>
            <Form :model="formData" layout="vertical" class="max-w-4xl">
              <div class="grid grid-cols-2 gap-4">
                <FormItem label="账套显示名称 (sys.tenant.displayName)">
                  <Input
                    v-model:value="formData.tenantDisplayName"
                    placeholder="请输入账套显示名称"
                  />
                </FormItem>
                <FormItem label="默认年度 (sys.tenant.defaultFiscalYear)">
                  <Input
                    v-model:value="formData.defaultFiscalYear"
                    placeholder="请输入默认年度"
                  />
                </FormItem>
                <FormItem label="默认币种 (sys.tenant.defaultCurrency)">
                  <Select
                    v-model:value="formData.defaultCurrency"
                    :options="currencyOptions"
                  />
                </FormItem>
                <FormItem label="单位性质 (sys.tenant.orgNature)">
                  <Select
                    v-model:value="formData.orgNature"
                    :options="orgNatureOptions"
                  />
                </FormItem>
                <FormItem label="预算来源 (sys.tenant.fundSourceType)">
                  <Select
                    v-model:value="formData.fundSourceType"
                    :options="fundSourceTypeOptions"
                  />
                </FormItem>
                <FormItem
                  label="默认付款方式 (sys.tenant.defaultPaymentMethod)"
                >
                  <Select
                    v-model:value="formData.defaultPaymentMethod"
                    :options="paymentMethodOptions"
                  />
                </FormItem>
              </div>
            </Form>
          </Tabs.TabPane>

          <Tabs.TabPane key="strategy" tab="核算策略">
            <div
              class="mb-4 rounded border border-dashed border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500"
            >
              控制账套层面的凭证编号、辅助核算维度以及是否自动结转，作为核算策略的默认模板。
            </div>
            <Form :model="formData" layout="vertical" class="max-w-4xl">
              <div class="grid grid-cols-2 gap-4">
                <FormItem label="凭证编号规则 (sys.tenant.voucherRule)">
                  <Select
                    v-model:value="formData.voucherRule"
                    :options="voucherRuleOptions"
                  />
                </FormItem>
                <FormItem
                  label="辅助核算维度 (sys.tenant.auxAccountingDimension)"
                >
                  <Select
                    v-model:value="formData.auxAccountingDimension"
                    :options="auxAccountingDimensionOptions"
                  />
                </FormItem>
                <FormItem label="自动结转 (sys.tenant.autoCarryForward)">
                  <Switch
                    v-model:checked="formData.autoCarryForward"
                    checked-children="开"
                    un-checked-children="关"
                  />
                </FormItem>
                <FormItem label="启用辅助核算 (sys.tenant.enableAuxAccounting)">
                  <Switch
                    v-model:checked="formData.enableAuxAccounting"
                    checked-children="开"
                    un-checked-children="关"
                  />
                </FormItem>
              </div>
            </Form>
          </Tabs.TabPane>

          <Tabs.TabPane key="control" tab="控制规则">
            <div
              class="mb-4 rounded border border-dashed border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500"
            >
              预算控制和默认付款方式由基础数据提供候选值，建议与组织参数设置保持一致。
            </div>
            <Form :model="formData" layout="vertical" class="max-w-4xl">
              <div class="grid grid-cols-2 gap-4">
                <FormItem label="预算控制模式 (sys.tenant.budgetControlMode)">
                  <Select
                    v-model:value="formData.budgetControlMode"
                    :options="budgetControlModeOptions"
                  />
                </FormItem>
                <FormItem
                  label="默认付款方式 (sys.tenant.defaultPaymentMethod)"
                >
                  <Select
                    v-model:value="formData.defaultPaymentMethod"
                    :options="paymentMethodOptions"
                  />
                </FormItem>
              </div>
            </Form>
            <div class="mt-2 flex flex-wrap gap-2">
              <Tag
                v-for="item in financeReferenceTags"
                :key="item.type"
                :color="item.color"
              >
                {{ item.label }}：{{ item.type }}
              </Tag>
            </div>
          </Tabs.TabPane>
        </Tabs>
      </Card>

      <div class="mt-4 flex max-w-4xl justify-end">
        <Button type="primary" :loading="isSaving" @click="handleSave">
          保存账套参数
        </Button>
      </div>
    </div>
  </Page>
</template>
