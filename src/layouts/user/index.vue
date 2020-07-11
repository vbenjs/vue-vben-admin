<script lang="tsx">
  import { defineComponent } from 'compatible-vue';
  export default defineComponent({
    name: 'UserLayout',
    setup() {
      return () => <router-view />;
    },
  });
</script>
