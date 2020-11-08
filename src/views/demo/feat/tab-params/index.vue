<template>
  <div class="p-4">
    Current Param : {{ params }}
    <br />
    Keep Alive
    <input />
  </div>
</template>
<script lang="ts">
  import { computed, defineComponent, unref } from 'vue';
  import { useRouter } from 'vue-router';
  export default defineComponent({
    name: 'TestTab',
    setup() {
      const { currentRoute } = useRouter();
      return {
        params: computed(() => {
          return unref(currentRoute).params;
        }),
      };
    },
  });
</script>
