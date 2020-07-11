<script lang="tsx">
  import { defineComponent } from '@/setup/vue';

  export default defineComponent({
    name: 'BlankLayout',
    setup() {
      return () => <router-view />;
    },
  });
</script>
