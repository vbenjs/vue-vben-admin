<script lang="tsx">
  import { defineComponent, ref, Ref } from 'compatible-vue';
  import { getSlot } from '@/utils/helper/tsxHelper';

  import { useClickOutside } from '@/hooks/event/useClickOutside';

  export default defineComponent({
    name: 'ClickOutSide',

    setup(props, { slots, emit }) {
      const wrapRef = ref<HTMLDivElement | null>(null);
      useClickOutside(wrapRef as Ref<HTMLDivElement>, () => {
        emit('clickOutside');
      });

      return () => <div ref={wrapRef}>{getSlot(slots, 'default')}</div>;
    },
  });
</script>
