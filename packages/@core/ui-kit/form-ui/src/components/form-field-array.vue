<script setup lang="ts">
// oxlint-disable unicorn/no-nested-ternary
import type { FormCommonConfig, FormSchema } from '../types';

import { computed } from 'vue';

import { Plus, X } from '@vben-core/icons';
import {
  VbenButton,
  VbenIconButton,
  VbenRenderContent,
} from '@vben-core/shadcn-ui';
import { cn, set } from '@vben-core/shared/utils';

import { useFieldArray } from 'vee-validate';

import FormField from '../form-render/form-field.vue';
import { createArrayChildSchema } from '../form-render/schema';

defineOptions({ name: 'VbenFormFieldArray', inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    /** 操作列表头文案 */
    actionText?: string;
    /** 「添加」按钮文案 */
    addButtonText?: string;
    /** 子字段通用配置 */
    commonConfig?: FormCommonConfig;
    /**
     * 新增一行时生成的默认数据；缺省时按 schema 的 fieldName 生成空对象
     */
    createRow?: () => Record<string, any>;
    disabled?: boolean;
    /** 空数据文案 */
    emptyText?: string;
    /** 子字段全局通用配置 */
    globalCommonConfig?: FormCommonConfig;
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
    commonConfig: () => ({}),
    globalCommonConfig: () => ({}),
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
const gridStyle = computed(() => {
  const columns = [
    ...(props.showIndex ? ['3rem'] : []),
    ...props.schema.map(() => 'minmax(0, 1fr)'),
    '4rem',
  ];
  return {
    gridTemplateColumns: columns.join(' '),
  };
});

function buildDefaultRow(): Record<string, any> {
  if (props.createRow) {
    return props.createRow();
  }

  const row: Record<string, any> = {};
  props.schema.forEach((col) => {
    const value =
      Reflect.has(col, 'defaultValue') && col.defaultValue !== undefined
        ? col.defaultValue
        : 'type' in col && col.type === 'array'
          ? []
          : null;
    set(row, col.fieldName, value);
  });
  return row;
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

function rowSchemas(index: number) {
  return props.schema.map((col) =>
    createArrayChildSchema(col as never, {
      arrayField: arrayPath.value,
      commonConfig: props.commonConfig,
      disabled: props.disabled,
      globalCommonConfig: props.globalCommonConfig,
      index,
    }),
  );
}
</script>

<template>
  <div :class="cn('w-full', $attrs.class as string)">
    <div class="border-border/70 overflow-hidden rounded-md border">
      <div
        class="bg-muted/30 border-border hidden border-b px-2 sm:grid"
        :style="gridStyle"
      >
        <div
          v-if="showIndex"
          class="text-muted-foreground px-2 py-2 text-left text-sm font-normal"
        >
          #
        </div>
        <div
          v-for="col in schema"
          :key="col.fieldName"
          class="text-muted-foreground px-2 py-2 text-left text-sm font-normal"
        >
          <VbenRenderContent :content="col.label" />
        </div>
        <div
          class="text-muted-foreground px-2 py-2 text-left text-sm font-normal"
        >
          {{ actionText }}
        </div>
      </div>

      <div
        v-for="(entry, index) in fields"
        :key="entry.key"
        class="border-border/60 border-b p-3 last:border-b-0 sm:grid sm:p-0"
        :style="gridStyle"
      >
        <div
          v-if="showIndex"
          class="text-muted-foreground mb-2 text-sm sm:mb-0 sm:px-4 sm:py-3"
        >
          <span class="sm:hidden">#</span>
          {{ index + 1 }}
        </div>

        <template
          v-for="(childSchema, childIndex) in rowSchemas(index)"
          :key="childSchema.fieldName"
        >
          <div class="min-w-0 py-2 sm:px-2">
            <div
              class="text-muted-foreground mb-1 text-xs font-medium sm:hidden"
            >
              <VbenRenderContent :content="schema?.[childIndex]?.label" />
            </div>
            <FormField
              v-bind="childSchema"
              :class="childSchema.formItemClass"
            />
          </div>
        </template>

        <div class="flex justify-end pt-1 sm:block sm:px-2 sm:py-3">
          <VbenIconButton
            type="button"
            :disabled="disabled || !canRemove"
            :on-click="() => removeRow(index)"
            class="text-muted-foreground hover:text-destructive"
          >
            <X class="size-4" />
          </VbenIconButton>
        </div>
      </div>

      <div
        v-if="fields.length === 0"
        class="text-muted-foreground py-6 text-center text-sm"
      >
        {{ emptyText }}
      </div>
    </div>

    <VbenButton
      variant="outline"
      size="sm"
      type="button"
      :disabled="disabled || !canAdd"
      class="mt-3 w-full border-dashed"
      @click="addRow"
    >
      <Plus class="mr-1 size-4" />
      {{ addButtonText }}
    </VbenButton>
  </div>
</template>
