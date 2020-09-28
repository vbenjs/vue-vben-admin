<template>
  <BasicModal v-bind="$attrs" @register="register" title="Modal Title">
    <p class="h-20">外部传递数据: {{ receiveModalDataRef }}</p>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  export default defineComponent({
    components: { BasicModal },
    setup() {
      const [register, { receiveModalDataRef }] = useModalInner();
      return { register, receiveModalDataRef };
    },
  });
</script>
