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
  orgName: 'RISS集团',
  orgCode: 'RISS',
  shortName: 'RISS',
  contactName: '系统管理员',
  contactPhone: '',
  legalRepresentative: '',
  creditCode: '',
  financeLeader: '',
  address: '',
  defaultDeptName: '',
  orgNature: '事业单位',
  defaultFundSource: '财政拨款',
  defaultPaymentMethod: '银行转账',
  defaultAuxDimension: '部门',
  enableApprovalFlow: true,
  enableBudgetControl: true,
});
const budgetControlOptions = ref<{ label: string; value: string }[]>([]);
const orgNatureOptions = ref<{ label: string; value: string }[]>([]);
const fundSourceOptions = ref<{ label: string; value: string }[]>([]);
const paymentMethodOptions = ref<{ label: string; value: string }[]>([]);
const auxDimensionOptions = ref<{ label: string; value: string }[]>([]);

const controlReferenceTags = [
  { color: 'blue', label: '组织性质', type: 'org_nature' },
  { color: 'cyan', label: '预算来源', type: 'fund_source_type' },
  { color: 'green', label: '付款方式', type: 'payment_method_type' },
  { color: 'purple', label: '辅助维度', type: 'aux_accounting_dimension' },
  { color: 'gold', label: '预算控制开关', type: 'budget_control_switch' },
];

const isSaving = ref(false);

const pageDescription = computed(() => {
  const parts = ['维护组织级基础参数'];
  if (userStore.userInfo?.fiscalYear)
    parts.push(`当前年度：${userStore.userInfo.fiscalYear}`);
  if (userStore.userInfo?.tenantName)
    parts.push(`当前账套：${userStore.userInfo.tenantName}`);
  return parts.join(' ｜ ');
});

onMounted(async () => {
  const [
    budgetControlData,
    orgNatureData,
    fundSourceData,
    paymentMethodData,
    auxDimensionData,
  ] = await Promise.all([
    sysDictDataApi.getByType('budget_control_switch').catch(() => []),
    sysDictDataApi.getByType('org_nature').catch(() => []),
    sysDictDataApi.getByType('fund_source_type').catch(() => []),
    sysDictDataApi.getByType('payment_method_type').catch(() => []),
    sysDictDataApi.getByType('aux_accounting_dimension').catch(() => []),
  ]);
  budgetControlOptions.value = (budgetControlData || []).map((item: any) => ({
    label: item.dictLabel,
    value: item.dictValue,
  }));
  orgNatureOptions.value = (orgNatureData || []).map((item: any) => ({
    label: item.dictLabel,
    value: item.dictValue,
  }));
  fundSourceOptions.value = (fundSourceData || []).map((item: any) => ({
    label: item.dictLabel,
    value: item.dictValue,
  }));
  paymentMethodOptions.value = (paymentMethodData || []).map((item: any) => ({
    label: item.dictLabel,
    value: item.dictValue,
  }));
  auxDimensionOptions.value = (auxDimensionData || []).map((item: any) => ({
    label: item.dictLabel,
    value: item.dictValue,
  }));
  const data = await sysConfigApi.getGroup('org');
  formData.orgName = data.name || formData.orgName;
  formData.orgCode = data.code || formData.orgCode;
  formData.shortName = data.shortName || formData.shortName;
  formData.contactName = data.contactName || formData.contactName;
  formData.contactPhone = data.contactPhone || formData.contactPhone;
  formData.legalRepresentative =
    data.legalRepresentative || formData.legalRepresentative;
  formData.creditCode = data.creditCode || formData.creditCode;
  formData.financeLeader = data.financeLeader || formData.financeLeader;
  formData.address = data.address || formData.address;
  formData.defaultDeptName = data.defaultDeptName || formData.defaultDeptName;
  formData.orgNature = data.orgNature || formData.orgNature;
  formData.defaultFundSource =
    data.defaultFundSource || formData.defaultFundSource;
  formData.defaultPaymentMethod =
    data.defaultPaymentMethod || formData.defaultPaymentMethod;
  formData.defaultAuxDimension =
    data.defaultAuxDimension || formData.defaultAuxDimension;
  formData.enableApprovalFlow = (data.enableApprovalFlow || 'true') === 'true';
  formData.enableBudgetControl =
    (data.enableBudgetControl || 'true') === 'true';
});

const handleSave = async () => {
  isSaving.value = true;
  try {
    await sysConfigApi.saveGroup('org', {
      name: formData.orgName,
      code: formData.orgCode,
      shortName: formData.shortName,
      contactName: formData.contactName,
      contactPhone: formData.contactPhone,
      legalRepresentative: formData.legalRepresentative,
      creditCode: formData.creditCode,
      financeLeader: formData.financeLeader,
      address: formData.address,
      defaultDeptName: formData.defaultDeptName,
      orgNature: formData.orgNature,
      defaultFundSource: formData.defaultFundSource,
      defaultPaymentMethod: formData.defaultPaymentMethod,
      defaultAuxDimension: formData.defaultAuxDimension,
      enableApprovalFlow: String(formData.enableApprovalFlow),
      enableBudgetControl: String(formData.enableBudgetControl),
    });
    message.success('组织参数保存成功');
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
          <Tabs.TabPane key="basic" tab="基础信息">
            <div
              class="mb-4 rounded border border-dashed border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500"
            >
              维护组织主数据、联系人和默认归口部门，作为系统管理平台的基础主档。
            </div>
            <Form :model="formData" layout="vertical" class="max-w-4xl">
              <div class="grid grid-cols-2 gap-4">
                <FormItem label="组织名称 (sys.org.name)" name="orgName">
                  <Input
                    v-model:value="formData.orgName"
                    placeholder="请输入组织名称"
                  />
                </FormItem>
                <FormItem label="组织编码 (sys.org.code)" name="orgCode">
                  <Input
                    v-model:value="formData.orgCode"
                    placeholder="请输入组织编码"
                  />
                </FormItem>
                <FormItem label="组织简称 (sys.org.shortName)" name="shortName">
                  <Input
                    v-model:value="formData.shortName"
                    placeholder="请输入组织简称"
                  />
                </FormItem>
                <FormItem
                  label="默认归口部门 (sys.org.defaultDeptName)"
                  name="defaultDeptName"
                >
                  <Input
                    v-model:value="formData.defaultDeptName"
                    placeholder="请输入默认归口部门"
                  />
                </FormItem>
                <FormItem
                  label="联系人 (sys.org.contactName)"
                  name="contactName"
                >
                  <Input
                    v-model:value="formData.contactName"
                    placeholder="请输入联系人"
                  />
                </FormItem>
                <FormItem
                  label="联系电话 (sys.org.contactPhone)"
                  name="contactPhone"
                >
                  <Input
                    v-model:value="formData.contactPhone"
                    placeholder="请输入联系电话"
                  />
                </FormItem>
                <FormItem
                  label="法人代表 (sys.org.legalRepresentative)"
                  name="legalRepresentative"
                >
                  <Input
                    v-model:value="formData.legalRepresentative"
                    placeholder="请输入法人代表"
                  />
                </FormItem>
                <FormItem
                  label="统一社会信用代码 (sys.org.creditCode)"
                  name="creditCode"
                >
                  <Input
                    v-model:value="formData.creditCode"
                    placeholder="请输入统一社会信用代码"
                  />
                </FormItem>
                <FormItem
                  label="财务负责人 (sys.org.financeLeader)"
                  name="financeLeader"
                >
                  <Input
                    v-model:value="formData.financeLeader"
                    placeholder="请输入财务负责人"
                  />
                </FormItem>
                <FormItem label="组织性质 (sys.org.orgNature)" name="orgNature">
                  <Select
                    v-model:value="formData.orgNature"
                    :options="orgNatureOptions"
                  />
                </FormItem>
              </div>
              <FormItem label="组织地址 (sys.org.address)" name="address">
                <Input
                  v-model:value="formData.address"
                  placeholder="请输入组织地址"
                />
              </FormItem>
            </Form>
          </Tabs.TabPane>

          <Tabs.TabPane key="finance" tab="财务默认项">
            <div
              class="mb-4 rounded border border-dashed border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500"
            >
              这里的默认项会被账套参数、单据录入和后续财务业务模块优先引用。
            </div>
            <Form :model="formData" layout="vertical" class="max-w-4xl">
              <div class="grid grid-cols-2 gap-4">
                <FormItem label="默认预算来源 (sys.org.defaultFundSource)">
                  <Select
                    v-model:value="formData.defaultFundSource"
                    :options="fundSourceOptions"
                  />
                </FormItem>
                <FormItem label="默认付款方式 (sys.org.defaultPaymentMethod)">
                  <Select
                    v-model:value="formData.defaultPaymentMethod"
                    :options="paymentMethodOptions"
                  />
                </FormItem>
                <FormItem label="默认辅助维度 (sys.org.defaultAuxDimension)">
                  <Select
                    v-model:value="formData.defaultAuxDimension"
                    :options="auxDimensionOptions"
                  />
                </FormItem>
              </div>
            </Form>
            <div class="mt-2 flex flex-wrap gap-2">
              <Tag
                v-for="item in controlReferenceTags.slice(0, 4)"
                :key="item.type"
                :color="item.color"
              >
                {{ item.label }}：{{ item.type }}
              </Tag>
            </div>
          </Tabs.TabPane>

          <Tabs.TabPane key="control" tab="控制规则">
            <div
              class="mb-4 rounded border border-dashed border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500"
            >
              组织级控制规则决定审批和预算控制的总开关，建议先完成基础数据初始化再保存。
            </div>
            <Form :model="formData" layout="vertical" class="max-w-4xl">
              <div class="grid grid-cols-2 gap-4">
                <FormItem label="启用审批流程 (sys.org.enableApprovalFlow)">
                  <Switch
                    v-model:checked="formData.enableApprovalFlow"
                    checked-children="开"
                    un-checked-children="关"
                  />
                </FormItem>
                <FormItem label="启用预算控制 (sys.org.enableBudgetControl)">
                  <Switch
                    v-model:checked="formData.enableBudgetControl"
                    checked-children="开"
                    un-checked-children="关"
                  />
                  <div
                    v-if="budgetControlOptions.length > 0"
                    class="mt-2 text-xs text-gray-500"
                  >
                    建议值：{{
                      budgetControlOptions.map((item) => item.label).join(' / ')
                    }}
                  </div>
                </FormItem>
              </div>
            </Form>
            <div class="mt-2 flex flex-wrap gap-2">
              <Tag
                v-for="item in controlReferenceTags"
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
          保存组织参数
        </Button>
      </div>
    </div>
  </Page>
</template>
