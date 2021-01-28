<template>
  <div :class="`${prefixCls}__header`">
    <BasicTitle :helpMessage="$attrs.helpMessage">
      <template v-if="$attrs.title">
        {{ $attrs.title }}
      </template>
      <template v-else>
        <slot name="title"></slot>
      </template>
    </BasicTitle>

    <div :class="`${prefixCls}__action`">
      <slot name="action"></slot>
      <BasicArrow v-if="$attrs.canExpan" top :expand="$attrs.show" @click="$emit('expand')" />
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicArrow, BasicTitle } from '/@/components/Basic';
  export default defineComponent({
    components: { BasicArrow, BasicTitle },
    inheritAttrs: false,
    props: {
      prefixCls: String,
    },
    emits: ['expand'],
  });
</script>
