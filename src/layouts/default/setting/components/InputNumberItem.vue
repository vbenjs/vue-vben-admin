<template>
  <div :class="prefixCls">
    <span> {{ title }}</span>
    <InputNumber
      v-bind="$attrs"
      size="small"
      :class="`${prefixCls}-input-number`"
      @change="handleChange"
    />
  </div>
</template>
<script lang="ts" setup>
  import { PropType } from 'vue';

  import { InputNumber } from 'ant-design-vue';
  import { useDesign } from '@/hooks/web/useDesign';
  import { baseHandler } from '../handler';
  import { HandlerEnum } from '../enum';

  defineOptions({ name: 'InputNumberItem' });

  const props = defineProps({
    event: {
      type: Number as PropType<HandlerEnum>,
    },
    title: {
      type: String,
    },
  });

  const { prefixCls } = useDesign('setting-input-number-item');

  function handleChange(e) {
    props.event && baseHandler(props.event, e);
  }
</script>
<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-setting-input-number-item';

  .@{prefix-cls} {
    display: flex;
    justify-content: space-between;
    margin: 16px 0;

    &-input-number {
      width: 126px !important;
    }
  }
</style>
