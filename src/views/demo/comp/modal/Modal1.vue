<template>
  <BasicModal
    v-bind="$attrs"
    destroyOnClose
    @register="register"
    title="Modal Title"
    :helpMessage="['提示1', '提示2']"
    @visible-change="handleShow"
  >
    <template v-if="loading">
      <div class="empty-tips"> 加载中，稍等3秒…… </div>
    </template>
    <template v-if="!loading">
      <ul>
        <li v-for="index in lines" :key="index">加载完成{{ index }}！</li>
      </ul>
    </template>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  export default defineComponent({
    components: { BasicModal },
    setup() {
      const loading = ref(true);
      const lines = ref(10);
      const [register, { setModalProps, redoModalHeight }] = useModalInner();
      function handleShow(visible: boolean) {
        if (visible) {
          loading.value = true;
          setModalProps({ loading: true });
          setTimeout(() => {
            lines.value = Math.round(Math.random() * 20 + 10);
            loading.value = false;
            setModalProps({ loading: false });
            redoModalHeight();
          }, 3000);
        }
      }
      return { register, loading, handleShow, lines };
    },
  });
</script>
<style scoped>
  .empty-tips {
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
</style>
