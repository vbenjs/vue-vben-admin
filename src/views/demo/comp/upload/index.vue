<template>
  <div class="p-4">
    <UploadContainer :maxSize="5" />
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { UploadContainer } from '/@/components/Upload/index';

  //   import { Alert } from 'ant-design-vue';
  export default defineComponent({
    components: { UploadContainer },
    setup() {
      return {};
    },
  });
</script>
