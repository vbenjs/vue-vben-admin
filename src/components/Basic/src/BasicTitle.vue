<template>
  <span class="base-title" :class="{ 'show-span': showSpan && $slots.default }">
    <slot />
    <BasicHelp class="base-title__help" v-if="helpMessage" :text="helpMessage" />
  </span>
</template>
<script lang="ts">
  import type { PropType } from 'vue';

  import { defineComponent } from 'vue';

  import BasicHelp from './BasicHelp.vue';

  export default defineComponent({
    name: 'BasicTitle',
    components: { BasicHelp },
    props: {
      helpMessage: {
        type: [String, Array] as PropType<string | string[]>,
        default: '',
      },
      showSpan: {
        type: Boolean as PropType<boolean>,
        default: false,
      },
    },
    setup() {
      return {};
    },
  });
</script>
<style lang="less" scoped>
  @import (reference) '../../../design/index.less';

  .base-title {
    position: relative;
    display: flex;
    padding-left: 7px;
    font-size: 16px;
    font-weight: 700;
    line-height: 24px;
    color: @text-color-base;

    .unselect();

    &.show-span::before {
      position: absolute;
      top: 4px;
      left: 0;
      width: 3px;
      height: 16px;
      margin-right: 4px;
      background: @primary-color;
      content: '';
    }

    &__help {
      margin-left: 10px;
    }
  }
</style>
