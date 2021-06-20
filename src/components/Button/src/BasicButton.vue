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
  import { Icon } from '/@/components/Icon';

  const props = {
    color: { type: String, validator: (v) => ['error', 'warning', 'success', ''].includes(v) },
    loading: { type: Boolean },
    disabled: { type: Boolean },
    /**
     * Text before icon.
     */
    preIcon: { type: String },
    /**
     * Text after icon.
     */
    postIcon: { type: String },
    /**
     * preIcon and postIcon icon size.
     * @default: 14
     */
    iconSize: { type: Number, default: 14 },
    onClick: { type: Function as PropType<(...args) => any>, default: null },
  };

  export default defineComponent({
    name: 'AButton',
    components: { Button, Icon },
    inheritAttrs: false,
    props,
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
