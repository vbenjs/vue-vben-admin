<template>
  <Button v-bind="getBindValue" :class="getButtonClass" @click="onClick">
    <template #default="data">
      <VbenIcon :icon="preIcon" v-if="preIcon" :size="iconSize" />
      <slot v-bind="data || {}"></slot>
      <VbenIcon :icon="postIcon" v-if="postIcon" :size="iconSize" />
    </template>
  </Button>
</template>

<script lang="ts" setup>
  import { useAttrs } from '@vben/hooks';
  import { VbenIcon } from '@vben/icons';
  import { Button } from 'ant-design-vue';
  import { computed, unref } from 'vue';

  import { buttonProps } from './props';

  defineOptions({
    name: 'AButton',
    extends: Button,
    inheritAttrs: false,
  });

  const props = defineProps(buttonProps);
  // get component class
  const attrs = useAttrs({ excludeDefaultKeys: false });
  const getButtonClass = computed(() => {
    const { color, disabled } = props;
    return [
      {
        [`ant-btn-${color}`]: !!color,
        [`is-disabled`]: disabled,
      },
    ];
  });

  // get inherit binding value
  const getBindValue = computed(() => ({ ...unref(attrs), ...props }));
</script>
