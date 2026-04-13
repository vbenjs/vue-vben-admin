<script setup lang="ts">
import type { CollapsibleRootEmits, CollapsibleRootProps } from 'reka-ui';

import type { ClassType } from '@vben-core/typings';

import { computed } from 'vue';

import { ChevronsDown } from 'lucide-vue-next';
import {
  CollapsibleContent,
  CollapsibleRoot,
  CollapsibleTrigger,
  useForwardPropsEmits,
} from 'reka-ui';

const props = defineProps<
  CollapsibleRootProps & {
    class?: ClassType;
    showTrigger?: boolean;
  }
>();

const emits = defineEmits<CollapsibleRootEmits>();

const delegatedProps = computed(() => {
  const { class: _cls, ...delegated } = props;

  return delegated;
});

const forwarded = useForwardPropsEmits(delegatedProps, emits);

const open = defineModel('open', { default: true });

function toggle() {
  open.value = !open.value;
}

defineExpose({
  toggle,
});
</script>

<template>
  <CollapsibleRoot
    v-bind="forwarded"
    v-model:open="open"
    class="flex flex-col"
    :unmount-on-hide="false"
  >
    <div
      class="flex items-center justify-between"
      v-if="$slots.label || showTrigger"
    >
      <slot name="label" v-if="$slots.label"> </slot>
      <CollapsibleTrigger
        v-if="showTrigger"
        class="cursor-pointer rounded-full h-[25px] w-[25px] inline-flex items-center justify-center outline-none data-[state=closed]:bg-white data-[state=open]:bg-primary/20 hover:bg-primary/20 text-primary"
      >
        <slot name="trigger" :open>
          <ChevronsDown
            class="h-3.5 w-3.5 transition-transform"
            :class="{
              'rotate-180': open,
            }"
          />
        </slot>
      </CollapsibleTrigger>
    </div>

    <slot name="visibleContent" :open></slot>

    <CollapsibleContent
      class="data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up overflow-hidden justify-start"
    >
      <slot name="collapsibleContent" :open></slot>
    </CollapsibleContent>
  </CollapsibleRoot>
</template>
