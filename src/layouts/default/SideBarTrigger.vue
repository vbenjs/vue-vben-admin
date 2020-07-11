<script lang="tsx">
  import { Icon } from '@/components/icon/index';
  import { defineComponent, computed, unref } from '@/setup/vue';

  // store
  import { menuStore } from '@/store/modules/menu';

  export default defineComponent({
    name: 'SideBarTrigger',
    setup() {
      const getType = computed(() => {
        return menuStore.getCollapsedState ? 'double-right' : 'double-left';
      });

      return () => <Icon type={unref(getType)} />;
    },
  });
</script>
