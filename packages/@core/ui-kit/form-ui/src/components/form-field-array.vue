<script setup lang="ts">
import type { FormSchema } from '../types';

import { computed } from 'vue';

import { Plus, X } from '@vben-core/icons';
import {
  VbenButton,
  VbenIconButton,
  VbenRenderContent,
} from '@vben-core/shadcn-ui';
import { cn } from '@vben-core/shared/utils';

import { useFieldArray } from 'vee-validate';

import FormField from '../form-render/form-field.vue';

defineOptions({ name: 'VbenFormFieldArray', inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    /** 操作列表头文案 */
    actionText?: string;
    /** 「添加」按钮文案 */
    addButtonText?: string;
    /**
     * 新增一行时生成的默认数据；缺省时按 schema 的 fieldName 生成空对象
     */
    createRow?: () => Record<string, any>;
    disabled?: boolean;
    /** 空数据文案 */
    emptyText?: string;
    /** 最多行数 */
    max?: number;
    /** 最少行数 */
    min?: number;
    /**
     * 字段路径，由外层 FormField 通过 componentField 透传（vee-validate 的 name）
     */
    name?: string;
    /**
     * 列定义，每一列就是一个子字段（复用 FormSchema）
     */
    schema?: FormSchema[];
    /** 是否显示序号列 */
    showIndex?: boolean;
  }>(),
  {
    actionText: '操作',
    addButtonText: '添加一行',
    createRow: undefined,
    disabled: false,
    emptyText: '暂无数据',
    max: Number.POSITIVE_INFINITY,
    min: 0,
    name: '',
    schema: () => [],
    showIndex: true,
  },
);

const arrayPath = computed(() => props.name);

const { fields, push, remove } = useFieldArray<Record<string, any>>(
  () => arrayPath.value,
);

const canAdd = computed(() => fields.value.length < props.max);
const canRemove = computed(() => fields.value.length > props.min);

function buildDefaultRow(): Record<string, any> {
  if (props.createRow) {
    return props.createRow();
  }
  return Object.fromEntries(props.schema.map((col) => [col.fieldName, null]));
}

function addRow() {
  if (props.disabled || !canAdd.value) {
    return;
  }
  push(buildDefaultRow());
}

function removeRow(index: number) {
  if (props.disabled || !canRemove.value) {
    return;
  }
  remove(index);
}

/**
 * 把列定义转换为子单元格 FormField 所需的 props。
 * - fieldName 替换为嵌套路径 `name[index].fieldName`，让校验与取值落在数组元素上
 * - hideLabel：表头已展示列名，单元格不重复显示
 */
function cellProps(col: FormSchema, index: number) {
  return {
    ...col,
    commonComponentProps: {},
    disabled: props.disabled,
    fieldName: `${arrayPath.value}[${index}].${col.fieldName}`,
    formFieldProps: {},
    hideLabel: true,
  };
}
</script>

<template>
  <div :class="cn('w-full', $attrs.class as string)">
    <table class="w-full border-collapse">
      <thead>
        <tr class="border-border border-b">
          <th
            v-if="showIndex"
            class="text-muted-foreground w-12 px-2 py-2 text-left text-sm font-normal"
          >
            #
          </th>
          <th
            v-for="col in schema"
            :key="col.fieldName"
            class="text-muted-foreground px-2 py-2 text-left text-sm font-normal"
          >
            <VbenRenderContent :content="col.label" />
          </th>
          <th
            class="text-muted-foreground w-16 px-2 py-2 text-left text-sm font-normal"
          >
            {{ actionText }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(entry, index) in fields"
          :key="entry.key"
          class="border-border/60 border-b align-top"
        >
          <td v-if="showIndex" class="text-muted-foreground px-2 py-3 text-sm">
            {{ index + 1 }}
          </td>
          <td v-for="col in schema" :key="col.fieldName" class="px-2 py-2">
            <FormField v-bind="cellProps(col, index)" />
          </td>
          <td class="px-2 py-3">
            <VbenIconButton
              :disabled="disabled || !canRemove"
              :on-click="() => removeRow(index)"
              class="text-muted-foreground hover:text-destructive"
            >
              <X class="size-4" />
            </VbenIconButton>
          </td>
        </tr>
      </tbody>
    </table>

    <div
      v-if="fields.length === 0"
      class="text-muted-foreground border-border/60 border-b py-6 text-center text-sm"
    >
      {{ emptyText }}
    </div>

    <VbenButton
      variant="outline"
      size="sm"
      :disabled="disabled || !canAdd"
      class="mt-3 w-full border-dashed"
      @click="addRow"
    >
      <Plus class="mr-1 size-4" />
      {{ addButtonText }}
    </VbenButton>
  </div>
</template>
