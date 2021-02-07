<template>
  <div :class="`${prefixCls}__header`">
    <BasicTitle :helpMessage="helpMessage">
      <template v-if="title">
        {{ title }}
      </template>
      <template v-else>
        <slot name="title"></slot>
      </template>
    </BasicTitle>

    <div :class="`${prefixCls}__action`">
      <slot name="action"></slot>
      <BasicArrow v-if="canExpan" top :expand="show" @click="$emit('expand')" />
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicArrow, BasicTitle } from '/@/components/Basic';
  import { propTypes } from '/@/utils/propTypes';

  export default defineComponent({
    components: { BasicArrow, BasicTitle },
    inheritAttrs: false,
    props: {
      prefixCls: propTypes.string,
      helpMessage: propTypes.string,
      title: propTypes.string,
      show: propTypes.bool,
      canExpan: propTypes.bool,
    },
    emits: ['expand'],
  });
</script>
