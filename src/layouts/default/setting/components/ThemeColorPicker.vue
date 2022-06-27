<template>
  <div :class="prefixCls">
    <template v-for="color in colorList || []" :key="color">
      <span
        @click="handleClick(color)"
        :class="[
          `${prefixCls}__item`,
          {
            [`${prefixCls}__item--active`]: def === color,
          },
        ]"
        :style="{ background: color }"
      >
        <CheckOutlined />
      </span>
    </template>
  </div>
</template>
<script lang="ts" setup name="ThemeColorPicker">
  import { PropType } from 'vue';
  import { CheckOutlined } from '@ant-design/icons-vue';

  import { useDesign } from '/@/hooks/web/useDesign';

  import { baseHandler } from '../handler';
  import { HandlerEnum } from '../enum';

  const props = defineProps({
    colorList: {
      type: Array as PropType<string[]>,
      defualt: [],
    },
    event: {
      type: Number as PropType<HandlerEnum>,
    },
    def: {
      type: String,
    },
  });
  const { prefixCls } = useDesign('setting-theme-picker');

  function handleClick(color: string) {
    props.event && baseHandler(props.event, color);
  }
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-setting-theme-picker';

  .@{prefix-cls} {
    display: flex;
    flex-wrap: wrap;
    margin: 16px 0;
    justify-content: space-around;

    &__item {
      width: 20px;
      height: 20px;
      cursor: pointer;
      border: 1px solid #ddd;
      border-radius: 2px;

      svg {
        display: none;
      }

      &--active {
        border: 1px solid lighten(@primary-color, 10%);

        svg {
          display: inline-block;
          margin: 0 0 3px 3px;
          font-size: 12px;
          fill: @white !important;
        }
      }
    }
  }
</style>
