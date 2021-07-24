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
  import { defineComponent, computed } from 'vue';
  import { Button } from 'ant-design-vue';
  import Icon from '/@/components/Icon/src/Icon.vue';
  import { buttonProps } from './props';

  export default defineComponent({
    name: 'AButton',
    components: { Button, Icon },
    inheritAttrs: false,
    props: buttonProps,
    setup(props, { attrs }) {
      // get component class
      const getButtonClass = computed(() => {
        const { color, disabled } = props;
        return [
          {
            [`ant-btn-${color}`]: !!color,
            [`is-disabled`]: disabled,
          },
          attrs.class,
        ];
      });

      // get inherit binding value
      const getBindValue = computed(() => ({ ...attrs, ...props }));

      return { getBindValue, getButtonClass };
    },
  });
</script>
