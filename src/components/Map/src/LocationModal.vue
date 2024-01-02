<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    width="928px"
    title="选择位置"
    @ok="handleSubmit"
  >
    <div class="mapMode">
      <LocationBMapGL @click="HandlerClickMap" :addr="addr" :lng="lng" :lat="lat" />
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { LocationBMapGL } from '@/components/Map';

  defineOptions({ name: 'LocationModal' });
  const emit = defineEmits(['success', 'register']);

  const addr = ref<string>();
  const lng = ref<string>();
  const lat = ref<string>();
  const newGeoLoc = ref<any>();

  const [registerModal, { setModalProps, closeModal }] = useModalInner((data) => {
    setModalProps({ confirmLoading: false });
    console.log('@data.addr', data.addr);
    // 设置地图位置初始
    addr.value = data.addr || undefined;
    lng.value = data.lng || undefined;
    lat.value = data.lat || undefined;
  });

  async function handleSubmit() {
    try {
      setModalProps({ confirmLoading: true });
      // createMessage.success('成功');
      emit('success', newGeoLoc.value);
      closeModal();
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }

  async function HandlerClickMap(location: any) {
    // console.log('@loc', location);
    newGeoLoc.value = location;
  }
</script>
<style scoped>
  .address {
    margin-bottom: 10px;
  }

  .mapMode {
    width: 900px;
    height: 600px;
    overflow: hidden;
  }
</style>
