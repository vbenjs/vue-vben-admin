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
      const getClass = computed(() => {
        const { expand, top, bottom, inset } = props;
        return [
          'base-arrow',
          {
            'base-arrow__active': expand,
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
  .base-arrow {
    display: inline-block;
    transform: rotate(0deg);
    transition: all 0.3s ease 0.1s;
    transform-origin: center center;

    &.inset {
      line-height: 0px;
    }

    &__active {
      transform: rotate(90deg);
    }

    &.top {
      transform: rotate(-90deg);
    }

    &.bottom {
      transform: rotate(90deg);
    }

    &.top.base-arrow__active {
      transform: rotate(90deg);
    }

    &.bottom.base-arrow__active {
      transform: rotate(-90deg);
    }
  }
</style>
