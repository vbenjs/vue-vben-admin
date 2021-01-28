<template>
  <div ref="wrap">
    <slot></slot>
  </div>
</template>
<script lang="ts">
  import type { Ref } from 'vue';
  import { defineComponent, ref, onMounted } from 'vue';

  import { useClickOutside } from '/@/hooks/web/useClickOutside';

  export default defineComponent({
    name: 'ClickOutSide',
    emits: ['mounted', 'clickOutside'],
    setup(_, { emit }) {
      const wrap = ref<ElRef>(null);

      useClickOutside(wrap as Ref<HTMLDivElement>, () => {
        emit('clickOutside');
      });

      onMounted(() => {
        emit('mounted');
      });

      return { wrap };
    },
  });
</script>
