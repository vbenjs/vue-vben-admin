<script setup lang="ts">
import { cn } from '#/lib/utils';
import { TabsContent, type TabsContentProps } from 'radix-vue';
import { type HTMLAttributes, computed } from 'vue';

const props = defineProps<
  { class?: HTMLAttributes['class'] } & TabsContentProps
>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});
</script>

<template>
  <TabsContent
    :class="
      cn(
        'ring-offset-background focus-visible:ring-ring mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        props.class,
      )
    "
    v-bind="delegatedProps"
  >
    <slot></slot>
  </TabsContent>
</template>
