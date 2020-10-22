<template>
  <div class="flex p-4">
    {{ value }}
    <Tinymce v-model="value" @change="handleChange" width="100%" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { Tinymce } from '/@/components/Tinymce/index';

  export default defineComponent({
    components: { Tinymce },
    setup() {
      const value = ref('hello world!');
      function handleChange(value: string) {
        console.log(value);
      }
      // setTimeout(() => {
      //   value.value = '1233';
      // }, 5000);
      return { handleChange, value };
    },
  });
</script>
