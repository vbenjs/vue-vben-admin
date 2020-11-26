<template>
  <Button v-bind="getBindValue" :class="[getColor, $attrs.class]">
    <template #default="data">
      <Icon :icon="preIcon" :class="{ 'mr-1': !getIsCircleBtn }" v-if="preIcon" />
      <slot v-bind="data" />
      <Icon :icon="postIcon" :class="{ 'ml-1': !getIsCircleBtn }" v-if="postIcon" />
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
    inheritAttrs: false,
    components: { Button, Icon },
    props: {
      type: propTypes.oneOf(['primary', 'default', 'danger', 'dashed', 'link']).def('default'),
      color: propTypes.oneOf(['error', 'warning', 'success', '']),
      loading: propTypes.bool,
      disabled: propTypes.bool,
      preIcon: propTypes.string,
      postIcon: propTypes.string,
    },
    setup(props, { attrs }) {
      const getIsCircleBtn = computed(() => attrs.shape === 'circle');

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

      return { getBindValue, getColor, getIsCircleBtn };
    },
  });
</script>
