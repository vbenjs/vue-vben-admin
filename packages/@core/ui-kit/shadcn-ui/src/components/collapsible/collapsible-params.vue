<script setup lang="ts">
import type { Recordable } from '@vben-core/typings';

import type { CollapsibleParamSchema } from './type';

import { computed, nextTick, ref, useTemplateRef, watch } from 'vue';

import { useNamespace } from '@vben-core/composables';

import { ChevronsDown } from 'lucide-vue-next';
import {
  CollapsibleContent,
  CollapsibleRoot,
  CollapsibleTrigger,
} from 'reka-ui';

import CollapsibleParamsItem from './collapsible-params-item.vue';

interface Props {
  defaultOpen?: boolean;
  maxHeight?: number | string;
  params: CollapsibleParamSchema[];
  visibleCount?: number;
}

const props = withDefaults(defineProps<Props>(), {
  visibleCount: 3,
  defaultOpen: false,
  maxHeight: undefined,
});

const emits = defineEmits<{ 'update:value': [any, string] }>();

const modelValue = defineModel('value', {
  default: {} as Recordable<CollapsibleParamSchema['defaultValue']>,
});

const visibleRefs = useTemplateRef('visibleRefs');
const collapsibleRefs = useTemplateRef('collapsibleRefs');

const { b } = useNamespace('collapsible-params');

const open = ref(props.defaultOpen);

// 最小可见为1
const finalVisibleCount = computed(() =>
  Math.max(1, Math.floor(props.visibleCount)),
);

const visibleRows = computed(() => {
  return props.params.slice(0, finalVisibleCount.value);
});

const collapsibleRows = computed(() => {
  return props.params.slice(finalVisibleCount.value);
});

const bodyStyle = computed(() => {
  if (!open.value || props.maxHeight == null) {
    return undefined;
  }

  return {
    maxHeight:
      typeof props.maxHeight === 'number'
        ? `${props.maxHeight}px`
        : props.maxHeight,
  };
});

function init(force = false) {
  const nextValue: Recordable<CollapsibleParamSchema['defaultValue']> = {
    ...modelValue.value,
  };

  for (const param of props.params) {
    if (force || nextValue[param.key] === undefined) {
      nextValue[param.key] = param.defaultValue ?? undefined;
    }
  }

  modelValue.value = nextValue;
}

function toggleCollapsed() {
  open.value = !open.value;
}

async function onParamValueChange(_: any, key: string) {
  await nextTick();
  emits('update:value', modelValue.value, key);
}

function resetValues() {
  if (visibleRefs.value)
    for (const rowRef of visibleRefs.value) {
      rowRef?.reset();
    }

  if (collapsibleRefs.value)
    for (const rowRef of collapsibleRefs.value) {
      rowRef?.reset();
    }

  init(true);
}

function updateValues(
  values: Recordable<CollapsibleParamSchema['defaultValue']>,
) {
  const allowedKeys = new Set(props.params.map((param) => param.key));
  const patch = {} as Recordable<CollapsibleParamSchema['defaultValue']>;

  for (const key in values) {
    if (!Object.hasOwn(values, key)) continue;
    if (!allowedKeys.has(key)) continue;

    patch[key] = values[key];
  }

  modelValue.value = { ...modelValue.value, ...patch };
}

watch(
  () => props.params,
  () => init(),
  { immediate: true, deep: true },
);

defineExpose({
  toggleCollapsed,
  resetValues,
  updateValues,
});
</script>

<template>
  <CollapsibleRoot
    v-model:open="open"
    class="border rounded-[0.5rem] flex flex-col w-full overflow-hidden"
    :class="[b()]"
    :unmount-on-hide="false"
  >
    <div class="wrapper w-full relative flex flex-col overflow-x-auto">
      <div class="w-full min-w-fit">
        <div
          class="header bg-accent w-full flex-none flex items-center rounded-t-[0.5rem] border-b"
        >
          <div
            class="header-cell pt-2 pb-2 px-5 leading-[1.5rem] flex items-center flex-nowrap"
          >
            Name
          </div>
          <div
            class="header-cell pt-2 pb-2 px-5 leading-[1.5rem] flex items-center flex-nowrap"
          >
            Value
          </div>
          <div
            class="header-cell pt-2 pb-2 px-5 leading-[1.5rem] flex items-center flex-nowrap"
          >
            Description
          </div>
        </div>

        <div
          class="body w-full flex-none flex flex-col overflow-x-hidden"
          :class="[
            open && !!props.maxHeight ? 'overflow-y-auto' : 'overflow-y-hidden',
          ]"
          :style="bodyStyle"
        >
          <CollapsibleParamsItem
            :data="row"
            v-for="row in visibleRows"
            :key="row.key"
            ref="visibleRefs"
            v-model:value="modelValue[row.key]"
            @update:value="(v) => onParamValueChange(v, row.key)"
          />
          <CollapsibleContent
            class="data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up"
          >
            <CollapsibleParamsItem
              :data="row"
              v-for="row in collapsibleRows"
              :key="row.key"
              ref="collapsibleRefs"
              v-model:value="modelValue[row.key]"
              @update:value="(v) => onParamValueChange(v, row.key)"
            />
          </CollapsibleContent>
        </div>
      </div>
    </div>
    <div
      class="gutter h-[1.5rem]"
      v-if="!open && collapsibleRows.length > 0"
    ></div>
    <div
      class="trigger-bar flex min-h-[2rem] border-t px-5 pt-1 pb-1 rounded-b-[0.5rem] z-1"
      :class="{
        'collapsed absolute bottom-[1px] left-[1px] right-[1px] border-t-0 pt-6':
          !open,
      }"
      v-if="collapsibleRows.length > 0"
    >
      <CollapsibleTrigger
        class="cursor-pointer h-[2rem] flex items-center gap-2"
      >
        <ChevronsDown
          class="transition-transform"
          :size="16"
          :class="{
            'rotate-180': open,
          }"
        />
        {{ open ? 'Fold' : 'Unfold' }}
      </CollapsibleTrigger>
    </div>
  </CollapsibleRoot>
</template>
<style>
.vben-collapsible-params {
  .wrapper {
    --column1: 11.25rem;
    --column2: 18.25rem;
    --column3: 27.5rem;

    .header-cell,
    .body-cell {
      &:nth-of-type(1) {
        flex: 0 0 var(--column1);

        /* min-width: var(--column1); */
      }

      &:nth-of-type(2) {
        flex: 0 0 var(--column2);

        /* min-width: var(--column2); */
      }

      &:nth-of-type(3) {
        flex: 1 1 var(--column3);
        min-width: var(--column3);
      }
    }
  }

  .trigger-bar {
    &.collapsed {
      background-image: linear-gradient(
        hsl(var(--foreground) / 0%) 0%,
        hsl(var(--foreground) / 12%) 31.76%,
        var(--color-border) 31.76%,
        var(--color-border) 33.43%,
        var(--color-background) 31.76%
      );
    }
  }
}
</style>
