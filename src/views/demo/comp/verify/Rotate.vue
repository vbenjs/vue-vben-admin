<template>
  <div class="p-10">
    <div class="flex justify-center p-4 items-center bg-gray-700">
      <RotateDragVerify :src="img" ref="el" @success="handleSuccess" />
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { RotateDragVerify } from '/@/components/Verify/index';

  import img from '/@/assets/images/header.jpg';
  export default defineComponent({
    components: { RotateDragVerify },
    setup() {
      const handleSuccess = () => {
        console.log('success!');
      };
      return {
        handleSuccess,
        img,
      };
    },
  });
</script>
<style lang="less" scoped>
  .bg-gray-700 {
    background: #4a5568;
  }
</style>
