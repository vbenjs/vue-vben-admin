<script setup lang="ts">
import { cn } from '#/lib/utils';
import {
  PinInputRoot,
  type PinInputRootEmits,
  type PinInputRootProps,
  useForwardPropsEmits,
} from 'radix-vue';
import { type HTMLAttributes, computed } from 'vue';

const props = defineProps<
  { class?: HTMLAttributes['class'] } & PinInputRootProps
>();
const emits = defineEmits<PinInputRootEmits>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;
  return delegated;
});

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <PinInputRoot
    v-bind="forwarded"
    :class="cn('flex items-center gap-2', props.class)"
  >
    <slot></slot>
  </PinInputRoot>
</template>
