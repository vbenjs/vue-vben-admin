<script lang="tsx">
  import { defineComponent } from 'compatible-vue';

  export default defineComponent({
    name: 'BlankLayout',
    setup() {
      return () => <router-view />;
    },
  });
</script>
