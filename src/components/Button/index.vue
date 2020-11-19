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
  import { PropType } from 'vue';

  import { defineComponent, computed } from 'vue';
  import { Button } from 'ant-design-vue';
  import Icon from '/@/components/Icon';
  export default defineComponent({
    name: 'AButton',
    inheritAttrs: false,
    components: { Button, Icon },
    props: {
      type: {
        type: String as PropType<'primary' | 'default' | 'danger' | 'dashed' | 'link'>,
        default: 'default',
      },
      color: {
        type: String as PropType<'error' | 'warning' | 'success' | ''>,
      },
      loading: {
        type: Boolean as PropType<boolean>,
        default: false,
      },
      disabled: {
        type: Boolean as PropType<boolean>,
        default: false,
      },
      preIcon: {
        type: String as PropType<string>,
      },
      postIcon: {
        type: String as PropType<string>,
      },
    },
    setup(props, { attrs }) {
      const getIsCircleBtn = computed(() => {
        return attrs.shape === 'circle';
      });

      const getColor = computed(() => {
        const { color, disabled } = props;
        return [
          {
            [`ant-btn-${color}`]: !!color,
            [`is-disabled`]: disabled,
          },
        ];
      });

      const getBindValue = computed((): any => {
        return { ...attrs, ...props };
      });

      return { getBindValue, getColor, getIsCircleBtn };
    },
  });
</script>
