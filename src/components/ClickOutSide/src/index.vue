<template>
  <div ref="wrap"><slot /></div>
</template>
<script lang="ts">
  import type { Ref } from 'vue';
  import { defineComponent, ref } from 'vue';

  import { useClickOutside } from '/@/hooks/web/useClickOutside';

  export default defineComponent({
    name: 'ClickOutSide',
    setup(_, { emit }) {
      const wrap = ref<ElRef>(null);

      useClickOutside(wrap as Ref<HTMLDivElement>, () => {
        emit('clickOutside');
      });

      return { wrap };
    },
  });
</script>
