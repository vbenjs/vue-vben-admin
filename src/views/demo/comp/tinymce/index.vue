<template>
  <div class="flex p-4">
    <Tinymce value="Hello, World!" @change="handleChange" width="100%" />
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { Tinymce } from '/@/components/Tinymce/index';

  export default defineComponent({
    components: { Tinymce },
    setup() {
      function handleChange(value: string) {
        console.log(value);
      }
      return { handleChange };
    },
  });
</script>
