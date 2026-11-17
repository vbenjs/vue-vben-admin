<script lang="ts" setup>
import type { RadioGroupProps } from 'antdv-next';

import type { VbenFormProps } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { computed, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { InputNumber, RadioGroup, Switch } from 'antdv-next';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getExampleTableApi } from '#/api';

interface RowType {
  category: string;
  color: string;
  id: string;
  price: string;
  productName: string;
  releaseDate: string;
}

const segmentedModes: RadioGroupProps['options'] = [
  { label: '默认(通栏色带)', value: 'default' },
  { label: '单卡双区 (zone)', value: 'zone' },
  { label: '双独立卡片 (card)', value: 'card' },
];

const separatorModes: RadioGroupProps['options'] = [
  { label: '跟随模式', value: 'auto' },
  { label: '显示', value: 'show' },
  { label: '隐藏', value: 'hide' },
];

const segmentedValue = ref<'card' | 'default' | 'zone'>('default');
const separatorValue = ref<'auto' | 'hide' | 'show'>('auto');
const useCustomRadius = ref(false);
const customRadius = ref(12);

const segmented = computed(() => {
  return segmentedValue.value === 'default'
    ? false
    : (segmentedValue.value as 'card' | 'zone');
});

// undefined = 跟随模式默认(默认形态显示色带,zone/card 隐藏)
const separator = computed(() => {
  if (separatorValue.value === 'show') {
    return true;
  }
  if (separatorValue.value === 'hide') {
    return false;
  }
  return undefined;
});

const isSegmentedMode = computed(() => segmentedValue.value !== 'default');

const sectionOptions = computed(() => {
  if (!useCustomRadius.value || !isSegmentedMode.value) {
    return undefined;
  }
  const radius = `${customRadius.value}px`;
  return {
    body: { borderRadius: radius },
    form: { borderRadius: radius },
  };
});

const formOptions: VbenFormProps = {
  collapsed: false,
  schema: [
    {
      component: 'Input',
      defaultValue: '1',
      fieldName: 'category',
      label: 'Category',
    },
    {
      component: 'Input',
      fieldName: 'productName',
      label: 'ProductName',
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: [
          { label: 'Color1', value: '1' },
          { label: 'Color2', value: '2' },
        ],
        placeholder: '请选择',
      },
      fieldName: 'color',
      label: 'Color',
    },
  ],
  showCollapseButton: true,
  submitOnChange: true,
};

const gridOptions: VxeTableGridOptions<RowType> = {
  checkboxConfig: {
    highlight: true,
    labelField: 'name',
  },
  columns: [
    { title: '序号', type: 'seq', width: 50 },
    { align: 'left', title: 'Name', type: 'checkbox', width: 100 },
    { field: 'category', title: 'Category' },
    { field: 'color', title: 'Color' },
    { field: 'productName', title: 'Product Name' },
    { field: 'price', title: 'Price' },
    { field: 'releaseDate', formatter: 'formatDateTime', title: 'Date' },
  ],
  height: 'auto',
  keepSource: true,
  pagerConfig: {},
  proxyConfig: {
    ajax: {
      query: async ({ page }) => {
        return await getExampleTableApi({
          page: page.currentPage,
          pageSize: page.pageSize,
        });
      },
    },
  },
  toolbarConfig: {
    custom: true,
    refresh: true,
    resizable: true,
    search: true,
    zoom: true,
  },
};

const [Grid] = useVbenVxeGrid({
  formOptions,
  gridOptions,
  tableTitle: 'Segmented Table',
});
</script>

<template>
  <Page auto-content-height>
    <div class="flex h-full flex-col gap-2">
      <div
        class="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-md bg-card p-3"
      >
        <div class="flex items-center gap-2">
          <span>分段模式</span>
          <RadioGroup
            v-model:value="segmentedValue"
            :options="segmentedModes"
            option-type="button"
            size="small"
          />
        </div>
        <div class="flex items-center gap-2">
          <span>分隔条</span>
          <RadioGroup
            v-model:value="separatorValue"
            :options="separatorModes"
            option-type="button"
            size="small"
          />
        </div>
        <div class="flex items-center gap-2">
          <span>自定义圆角</span>
          <Switch
            :checked="useCustomRadius && isSegmentedMode"
            :disabled="!isSegmentedMode"
            size="small"
            @change="useCustomRadius = $event as boolean"
          />
          <InputNumber
            v-if="useCustomRadius && isSegmentedMode"
            v-model:value="customRadius"
            :max="28"
            :min="0"
            size="small"
          />
          <span v-if="!isSegmentedMode" class="text-muted-foreground">
            仅 zone / card 模式可定制圆角
          </span>
        </div>
      </div>
      <div class="min-h-0 flex-1">
        <Grid
          :section-options="sectionOptions"
          :segmented="segmented"
          :separator="separator"
        />
      </div>
    </div>
  </Page>
</template>
