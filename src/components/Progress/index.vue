<template>
  <Progress v-bind="myProps" />
</template>

<script lang="ts" setup>
  import { computed, PropType } from 'vue';
  import { progressProps, type ProgressProps } from 'ant-design-vue/es/progress/props';
  import { Progress } from 'ant-design-vue';

  type StrokeColorType = ProgressProps['strokeColor'];
  type StrokeColorFn = (percent) => StrokeColorType;

  const props = defineProps({
    ...progressProps(),
    strokeColor: {
      type: [String, Object, Function] as PropType<StrokeColorType | StrokeColorFn>,
    },
  });

  const myProps = computed(() => {
    if (typeof props.strokeColor === 'function') {
      return {
        ...props,
        strokeColor: props.strokeColor(props.percent),
      };
    } else {
      return {
        ...props,
        strokeColor: props.strokeColor as StrokeColorType,
      };
    }
  });
</script>
