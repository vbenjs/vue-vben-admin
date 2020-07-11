<script lang="tsx">
  import { defineComponent } from '@/setup/vue';
  export default defineComponent({
    name: 'UserLayout',
    setup() {
      return () => <router-view />;
    },
  });
</script>
