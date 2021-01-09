<!--
 * @Author: Vben
 * @Description: Arrow component with animation
-->
<template>
  <span :class="getClass">
    <RightOutlined />
  </span>
</template>
<script lang="ts">
  import { defineComponent, computed } from 'vue';
  import { RightOutlined } from '@ant-design/icons-vue';
  import { propTypes } from '/@/utils/propTypes';
  import { useDesign } from '/@/hooks/web/useDesign';

  export default defineComponent({
    name: 'BasicArrow',
    components: { RightOutlined },
    props: {
      // Expand contract, expand by default
      expand: propTypes.bool,
      top: propTypes.bool,
      bottom: propTypes.bool,
      inset: propTypes.bool,
    },
    setup(props) {
      const { prefixCls } = useDesign('basic-arrow');

      const getClass = computed(() => {
        const { expand, top, bottom, inset } = props;
        return [
          prefixCls,
          {
            [`${prefixCls}--active`]: expand,
            top,
            inset,
            bottom,
          },
        ];
      });

      return {
        getClass,
      };
    },
  });
</script>
<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-basic-arrow';

  .@{prefix-cls} {
    display: inline-block;
    transform: rotate(0deg);
    transition: all 0.3s ease 0.1s;
    transform-origin: center center;

    &--active {
      transform: rotate(90deg);
    }

    &.inset {
      line-height: 0px;
    }

    &.top {
      transform: rotate(-90deg);
    }

    &.bottom {
      transform: rotate(90deg);
    }

    &.top.@{prefix-cls}--active {
      transform: rotate(90deg);
    }

    &.bottom.@{prefix-cls}--active {
      transform: rotate(-90deg);
    }
  }
</style>
