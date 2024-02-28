<template>
  <Button
    v-bind="getBindValue"
    :class="getButtonClass"
    :loading="loading"
    @click="handleClickButton"
  >
    <template #icon>
      <slot name="icon"></slot>
    </template>
    <template #default="data">
      <Icon :icon="preIcon" v-if="preIcon" :size="iconSize" />
      <slot v-bind="data || {}"></slot>
      <Icon :icon="postIcon" v-if="postIcon" :size="iconSize" />
    </template>
  </Button>
</template>

<script lang="ts" setup>
  import { computed, ref, unref } from 'vue';
  import { Button } from 'ant-design-vue';
  import Icon from '@/components/Icon/Icon.vue';
  import { buttonProps } from './props';
  import { ModalOptionsEx, useMessage } from '@/hooks/web/useMessage';
  import { debounce } from 'lodash-es';
  import { useAttrs } from '@vben/hooks';

  const props = defineProps({
    ...buttonProps,
    api: {
      type: Function as PropType<(...args: any[]) => Promise<any>>,
      default: null,
    },
    confirmConfig: {
      type: [Object, Boolean] as PropType<Partial<ModalOptionsEx> | false>,
      default: false,
    },
    delay: {
      type: Number as PropType<number>,
      default: 300,
    },
  });
  const { createConfirm } = useMessage();
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

  const loading = ref(false);
  const todo = debounce(async (api: (...args: any[]) => Promise<any>) => {
    try {
      loading.value = true;
      await api();
    } finally {
      loading.value = false;
    }
  }, props.delay);

  // get inherit binding value
  const getBindValue = computed(() => ({ ...unref(attrs), ...props }));
  const handleClickButton = async () => {
    const { api, confirmConfig, onClick } = props;
    if (!api) return onClick?.();

    if (confirmConfig) {
      return createConfirm({
        title: '提示',
        iconType: 'warning',
        content: '确定要执行吗？',
        ...confirmConfig,
        onOk: async () => {
          await api();
          return Promise.resolve();
        },
      });
    }

    todo(api);
  };
</script>
