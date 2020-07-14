<script lang="tsx">
  import { defineComponent } from 'compatible-vue';

  export default defineComponent({
    name: 'AuthTest2',
    setup() {
      return () => (
        <div>
          normal角色可见
          <input />
        </div>
      );
    },
  });
</script>
