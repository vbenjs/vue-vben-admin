<template>
  <Button v-bind="getBindValue" :class="[getColor, $attrs.class]" @click="onClick">
    <template #default="data">
      <Icon :icon="preIcon" v-if="preIcon" :size="14" />
      <slot v-bind="data"></slot>
      <Icon :icon="postIcon" v-if="postIcon" :size="14" />
    </template>
  </Button>
</template>
<script lang="ts">
  import { defineComponent, computed } from 'vue';

  import { Button } from 'ant-design-vue';
  import Icon from '/@/components/Icon';

  import { propTypes } from '/@/utils/propTypes';

  export default defineComponent({
    name: 'AButton',
    components: { Button, Icon },
    inheritAttrs: false,
    props: {
      type: propTypes.oneOf(['primary', 'default', 'danger', 'dashed', 'link']).def('default'),
      color: propTypes.oneOf(['error', 'warning', 'success', '']),
      loading: propTypes.bool,
      disabled: propTypes.bool,
      preIcon: propTypes.string,
      postIcon: propTypes.string,
      onClick: propTypes.func,
    },
    setup(props, { attrs }) {
      const getColor = computed(() => {
        const { color, disabled } = props;
        return {
          [`ant-btn-${color}`]: !!color,
          [`is-disabled`]: disabled,
        };
      });

      const getBindValue = computed((): any => {
        return { ...attrs, ...props };
      });

      return { getBindValue, getColor };
    },
  });
</script>
