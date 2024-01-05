<template>
  <div class="map-container">
    <div class="address">
      <a-input v-model:value="address" placeholder="请在地图上点选位置">
        <template #addonBefore> 当前点选位置 </template>
      </a-input>
    </div>
    <div class="map" :id="mapId"> </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import loadMap from './map.js';

  defineOptions({ name: 'LocationBMapGL' });
  const emit = defineEmits(['click']);
  const props = defineProps({
    addr: {
      type: String,
      default: '北京',
    },
    lng: {
      type: String,
      default: '116.404',
    },
    lat: {
      type: String,
      default: '39.928',
    },
  });
  const mapId = ref<any>('mapId');
  const address = ref<string>();
  const map = ref<any>(null);
  const geoc = ref<any>(null);

  onMounted(() => {
    mapId.value = 'mapId' + new Date().getTime();
    initMap();
  });

  function initMap() {
    // 调用map.js中loadMap()方法，引入百度地图脚本
    loadMap().then((BMapGL: any) => {
      // console.log('@k1', props.addr, props.lng, props.lat);
      address.value = props.addr;
      // 创建地图实例
      map.value = new BMapGL.Map(mapId.value);
      // 初始化地图，默认点坐标为北京，默认地图级别为15级
      let initPoint = new BMapGL.Point(props.lng, props.lat);
      map.value.centerAndZoom(initPoint, 13);
      let initPointMarker = new BMapGL.Marker(initPoint);
      map.value.addOverlay(initPointMarker);
      // 开启鼠标滚轮缩放
      map.value.enableScrollWheelZoom(true);
      // 地址逆解析
      geoc.value = new BMapGL.Geocoder();
      emit('click', { address: address.value, initPoint });

      // 监听单击事件
      map.value.addEventListener('click', (e) => {
        // 清除点(所以覆盖物)
        map.value.clearOverlays();
        // 增加点
        let point = e.latlng;
        let marker = new BMapGL.Marker(new BMapGL.Point(point.lng, point.lat));
        map.value.addOverlay(marker);
        // 显示地点
        geoc.value.getLocation(point, (rs) => {
          let addComp = rs.addressComponents;
          let addr = `${addComp.province},${addComp.city},${addComp.district},${addComp.street},${addComp.streetNumber}`;
          address.value = addr;
          // 将点和坐标反馈到父
          emit('click', { address: addr, point });
        });
      });
    });
  }
</script>

<style scoped>
  .map-container,
  .map {
    width: 100%;
    height: 100%;
  }

  .address {
    margin-bottom: 10px;
  }
</style>
