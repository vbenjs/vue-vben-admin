<script setup lang="ts">
import type { FormGroupSchema } from '../types';

import { computed, ref, watch } from 'vue';

import { ChevronsDown } from '@vben-core/icons';
import { VbenCollapsible, VbenRenderContent } from '@vben-core/shadcn-ui';
import { cn } from '@vben-core/shared/utils';

import { injectRenderFormProps } from './context';

interface Props {
  /** 分组内容区（字段栅格）的样式 */
  contentClass?: string;
  /** 表单折叠按钮收起时是否隐藏当前分组 */
  hidden?: boolean;
  schema: FormGroupSchema;
}

const props = withDefaults(defineProps<Props>(), {
  contentClass: '',
  hidden: false,
});

const formRenderProps = injectRenderFormProps();

const collapseOpen = ref(!props.schema.defaultCollapsed);

const shouldCollapsible = computed(() => {
  return props.schema.collapsible !== false;
});

// 组内任一字段校验失败时自动展开，避免错误提示被折叠区域遮住
const hasInvalidField = computed(() => {
  const errors = formRenderProps.form?.errors ?? {};
  return props.schema.children.some((field) =>
    Boolean(errors[field.fieldName]),
  );
});

watch(hasInvalidField, (invalid) => {
  if (invalid && !collapseOpen.value) {
    collapseOpen.value = true;
  }
});

function toggleCollapsed() {
  if (!shouldCollapsible.value) {
    return;
  }
  collapseOpen.value = !collapseOpen.value;
}
</script>

<template>
  <div
    :class="
      cn(
        'form-group col-span-full flex w-full flex-col',
        { hidden: props.hidden },
        props.schema.formItemClass,
      )
    "
  >
    <VbenCollapsible v-model:open="collapseOpen" :show-trigger="false">
      <template #label>
        <div
          :class="
            cn(
              'form-group-header mb-2 flex min-h-7 flex-1 items-center gap-2',
              {
                'cursor-pointer select-none': shouldCollapsible,
              },
            )
          "
          @click="toggleCollapsed"
        >
          <span class="bg-primary h-3.5 w-[3px] flex-none rounded-full"></span>
          <span
            v-if="props.schema.title"
            class="form-group-title text-sm font-medium leading-6"
          >
            <VbenRenderContent :content="props.schema.title" />
          </span>
          <div v-if="props.schema.extra" class="ml-auto" @click.stop>
            <VbenRenderContent :content="props.schema.extra" />
          </div>
          <ChevronsDown
            v-if="shouldCollapsible"
            :size="16"
            :class="
              cn('text-muted-foreground transition-transform', {
                'ml-auto': !props.schema.extra,
                'rotate-180': collapseOpen,
              })
            "
          />
        </div>
      </template>
      <template #collapsibleContent>
        <div :class="props.contentClass">
          <slot></slot>
        </div>
      </template>
    </VbenCollapsible>
  </div>
</template>
