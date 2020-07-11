<script lang="tsx">
  import { defineComponent } from '@/setup/vue';

  export default defineComponent({
    name: 'Test1',
    setup() {
      return () => (
        <div>
          test1 page
          <input />
        </div>
      );
    },
  });
</script>
