<template>
  <div class="collapse-container__header">
    <BasicTitle :helpMessage="$attrs.helpMessage">
      <template v-if="$attrs.title">
        {{ $attrs.title }}
      </template>
      <template v-else>
        <slot name="title" />
      </template>
    </BasicTitle>

    <div class="collapse-container__action">
      <slot name="action" />
      <BasicArrow v-if="$attrs.canExpan" :expand="$attrs.show" @click="$emit('expand')" />
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicArrow, BasicTitle } from '/@/components/Basic';
  export default defineComponent({
    inheritAttrs: false,
    components: { BasicArrow, BasicTitle },
  });
</script>
