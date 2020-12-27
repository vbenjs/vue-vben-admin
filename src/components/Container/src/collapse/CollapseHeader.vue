<template>
  <div :class="`${prefixCls}__header`">
    <BasicTitle :helpMessage="$attrs.helpMessage">
      <template v-if="$attrs.title">
        {{ $attrs.title }}
      </template>
      <template v-else>
        <slot name="title" />
      </template>
    </BasicTitle>

    <div :class="`${prefixCls}__action`">
      <slot name="action" />
      <BasicArrow v-if="$attrs.canExpan" top :expand="$attrs.show" @click="$emit('expand')" />
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicArrow, BasicTitle } from '/@/components/Basic';
  export default defineComponent({
    inheritAttrs: false,
    components: { BasicArrow, BasicTitle },
    props: {
      prefixCls: String,
    },
  });
</script>
