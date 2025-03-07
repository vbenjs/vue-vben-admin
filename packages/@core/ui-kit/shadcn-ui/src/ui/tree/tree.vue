<script lang="ts" setup>
import type { Arrayable } from '@vueuse/core';
import type { FlattenedItem } from 'radix-vue';

import type { ClassType, Recordable } from '@vben-core/typings';

import { onMounted, ref, watch, watchEffect } from 'vue';

import { ChevronRight, IconifyIcon } from '@vben-core/icons';
import { cn, get } from '@vben-core/shared/utils';

import { useVModel } from '@vueuse/core';
import { TreeItem, TreeRoot } from 'radix-vue';

import { Checkbox } from '../checkbox';

interface TreeProps {
  /** 单选时允许取消已有选项 */
  allowClear?: boolean;
  /** 显示边框 */
  bordered?: boolean;
  /** 取消父子关联选择 */
  checkStrictly?: boolean;
  /** 子级字段名 */
  childrenField?: string;
  /** 默认展开的键 */
  defaultExpandedKeys?: Array<number | string>;
  /** 默认展开的级别（优先级高于defaultExpandedKeys） */
  defaultExpandedLevel?: number;
  /** 默认值 */
  defaultValue?: Arrayable<number | string>;
  /** 禁用 */
  disabled?: boolean;
  /** 自定义节点类名 */
  getNodeClass?: (item: FlattenedItem<Recordable<any>>) => string;
  iconField?: string;
  /** label字段 */
  labelField?: string;
  /** 当前值 */
  modelValue?: Arrayable<number | string>;
  /** 是否多选 */
  multiple?: boolean;
  /** 显示由iconField指定的图标 */
  showIcon?: boolean;
  /** 启用展开收缩动画 */
  transition?: boolean;
  /** 树数据 */
  treeData: Recordable<any>[];
  /** 值字段 */
  valueField?: string;
}
const props = withDefaults(defineProps<TreeProps>(), {
  allowClear: false,
  bordered: false,
  checkStrictly: false,
  defaultExpandedKeys: () => [],
  disabled: false,
  expanded: () => [],
  iconField: 'icon',
  labelField: 'label',
  modelValue: () => [],
  multiple: false,
  showIcon: true,
  transition: false,
  valueField: 'value',
  childrenField: 'children',
});

const emits = defineEmits<{
  expand: [value: FlattenedItem<Recordable<any>>];
  select: [value: FlattenedItem<Recordable<any>>];
  'update:modelValue': [value: Arrayable<Recordable<any>>];
}>();

interface InnerFlattenItem<T = Recordable<any>> {
  hasChildren: boolean;
  level: number;
  value: T;
}

function flatten<T = Recordable<any>>(
  items: T[],
  childrenField: string = 'children',
  level = 0,
): InnerFlattenItem<T>[] {
  const result: InnerFlattenItem<T>[] = [];
  items.forEach((item) => {
    const children = get(item, childrenField) as Array<T>;
    const val = {
      hasChildren: Array.isArray(children) && children.length > 0,
      level,
      value: item,
    };
    result.push(val);
    if (val.hasChildren)
      result.push(...flatten(children, childrenField, level + 1));
  });
  return result;
}

const flattenData = ref<Array<InnerFlattenItem>>([]);
const modelValue = useVModel(props, 'modelValue', emits, {
  deep: true,
  defaultValue: props.defaultValue ?? [],
  passive: (props.modelValue === undefined) as false,
});
const expanded = ref<Array<number | string>>(props.defaultExpandedKeys ?? []);

const treeValue = ref();

onMounted(() => {
  watchEffect(() => {
    flattenData.value = flatten(props.treeData, props.childrenField);
    updateTreeValue();
    if (
      props.defaultExpandedLevel !== undefined &&
      props.defaultExpandedLevel > 0
    )
      expandToLevel(props.defaultExpandedLevel);
  });
});

function getItemByValue(value: number | string) {
  return flattenData.value.find(
    (item) => get(item.value, props.valueField) === value,
  )?.value;
}

function updateTreeValue() {
  const val = modelValue.value;
  treeValue.value = Array.isArray(val)
    ? val.map((v) => getItemByValue(v))
    : getItemByValue(val);
}

watch(
  modelValue,
  () => {
    updateTreeValue();
  },
  { deep: true, immediate: true },
);

function updateModelValue(val: Arrayable<Recordable<any>>) {
  modelValue.value = Array.isArray(val)
    ? val.map((v) => get(v, props.valueField))
    : get(val, props.valueField);
}

function expandToLevel(level: number) {
  const keys: string[] = [];
  flattenData.value.forEach((item) => {
    if (item.level <= level - 1) {
      keys.push(get(item.value, props.valueField));
    }
  });
  expanded.value = keys;
}

function collapseNodes(value: Arrayable<number | string>) {
  const keys = new Set(Array.isArray(value) ? value : [value]);
  expanded.value = expanded.value.filter((key) => !keys.has(key));
}

function expandNodes(value: Arrayable<number | string>) {
  const keys = [...(Array.isArray(value) ? value : [value])];
  keys.forEach((key) => {
    if (expanded.value.includes(key)) return;
    const item = getItemByValue(key);
    if (item) {
      expanded.value.push(key);
    }
  });
}

function expandAll() {
  expanded.value = flattenData.value
    .filter((item) => item.hasChildren)
    .map((item) => get(item.value, props.valueField));
}

function collapseAll() {
  expanded.value = [];
}

function onToggle(item: FlattenedItem<Recordable<any>>) {
  emits('expand', item);
}
function onSelect(item: FlattenedItem<Recordable<any>>) {
  emits('select', item);
}

defineExpose({
  collapseAll,
  collapseNodes,
  expandAll,
  expandNodes,
  expandToLevel,
  getItemByValue,
});
</script>
<template>
  <TreeRoot
    :get-key="(item) => get(item, valueField)"
    :get-children="(item) => get(item, childrenField)"
    :items="treeData"
    :model-value="treeValue"
    v-model:expanded="expanded as string[]"
    :default-expanded="defaultExpandedKeys as string[]"
    :propagate-select="!checkStrictly"
    :multiple="multiple"
    :disabled="disabled"
    :selection-behavior="allowClear || multiple ? 'toggle' : 'replace'"
    @update:model-value="updateModelValue"
    v-slot="{ flattenItems }"
    :class="
      cn(
        'text-blackA11 select-none list-none rounded-lg p-2 text-sm font-medium',
        $attrs.class as unknown as ClassType,
        bordered ? 'border' : '',
      )
    "
  >
    <div class="w-full" v-if="$slots.header">
      <slot name="header"> </slot>
    </div>
    <TreeItem
      v-for="item in flattenItems"
      v-slot="{
        isExpanded,
        isSelected,
        isIndeterminate,
        handleSelect,
        handleToggle,
      }"
      :key="item._id"
      :style="{ 'padding-left': `${item.level - 0.5}rem` }"
      :class="
        cn('cursor-pointer', getNodeClass?.(item), {
          'data-[selected]:bg-accent': !multiple,
        })
      "
      v-bind="item.bind"
      @select="
        (event) => {
          if (event.detail.originalEvent.type === 'click') {
            // event.preventDefault();
          }
          onSelect(item);
        }
      "
      @toggle="
        (event) => {
          if (event.detail.originalEvent.type === 'click') {
            event.preventDefault();
          }
          onToggle(item);
        }
      "
      class="tree-node focus:ring-grass8 my-0.5 flex items-center rounded px-2 py-1 outline-none focus:ring-2"
    >
      <ChevronRight
        v-if="item.hasChildren"
        class="size-4 cursor-pointer transition"
        :class="{ 'rotate-90': isExpanded }"
        @click.stop="handleToggle"
      />
      <div v-else class="h-4 w-4">
        <!-- <IconifyIcon v-if="item.value.icon" :icon="item.value.icon" /> -->
      </div>
      <Checkbox
        v-if="multiple"
        :checked="isSelected"
        :indeterminate="isIndeterminate"
        @click.stop="handleSelect"
      />
      <div
        class="flex items-center gap-1 pl-2"
        @click="
          ($event) => {
            $event.stopPropagation();
            $event.preventDefault();
            handleSelect();
          }
        "
      >
        <slot name="node" v-bind="item">
          <IconifyIcon
            class="size-4"
            v-if="showIcon && get(item.value, iconField)"
            :icon="get(item.value, iconField)"
          />
          {{ get(item.value, labelField) }}
        </slot>
      </div>
    </TreeItem>
    <div class="w-full" v-if="$slots.footer">
      <slot name="footer"> </slot>
    </div>
  </TreeRoot>
</template>
