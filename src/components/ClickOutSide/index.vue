<template>
  <div ref="wrapRef"><slot /></div>
</template>
<script lang="ts">
  import type { Ref } from 'vue';
  import { defineComponent, ref } from 'vue';

  import { useClickOutside } from '/@/hooks/web/useClickOutside';

  export default defineComponent({
    name: 'ClickOutSide',

    setup(_, { emit }) {
      const wrapRef = ref<Nullable<HTMLDivElement | null>>(null);

      useClickOutside(wrapRef as Ref<HTMLDivElement>, () => {
        emit('clickOutside');
      });

      return { wrapRef };
    },
  });
</script>
