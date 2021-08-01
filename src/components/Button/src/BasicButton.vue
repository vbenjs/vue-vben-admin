<template>
  <Button v-bind="getBindValue" :class="getButtonClass" @click="onClick">
    <template #default="data">
      <Icon :icon="preIcon" v-if="preIcon" :size="iconSize" />
      <slot v-bind="data"></slot>
      <Icon :icon="postIcon" v-if="postIcon" :size="iconSize" />
    </template>
  </Button>
</template>
<script lang="ts">
  import { defineComponent, computed, unref } from 'vue';
  import { Button } from 'ant-design-vue';
  import Icon from '/@/components/Icon/src/Icon.vue';
  import { buttonProps } from './props';
  import { useAttrs } from '/@/hooks/core/useAttrs';

  export default defineComponent({
    name: 'AButton',
    components: { Button, Icon },
    inheritAttrs: false,
    props: buttonProps,
    setup(props) {
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

      return { getBindValue, getButtonClass };
    },
  });
</script>
