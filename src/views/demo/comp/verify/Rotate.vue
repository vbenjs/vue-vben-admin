<template>
  <div class="p-10">
    <div class="flex justify-center p-4 items-center bg-gray-700">
      <RotateDragVerify src="/@/assets/images/header.jpg" ref="el" @success="handleSuccess" />
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { RotateDragVerify } from '/@/components/Verify/index';

  export default defineComponent({
    components: { RotateDragVerify },
    setup() {
      const handleSuccess = () => {
        console.log('success!');
      };
      return {
        handleSuccess,
      };
    },
  });
</script>
