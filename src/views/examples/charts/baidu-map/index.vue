<script lang="tsx">
  import { defineComponent, reactive, Vue } from 'compatible-vue';
  import BaiduMap from 'vue-baidu-map';
  Vue.use(BaiduMap, {
    ak: 'GzjGVWCxUG9w6A0eIskR7gCxAVSGmH2S',
  });
  export default defineComponent({
    setup() {
      const state = reactive({
        zoom: 13,
        center: {
          lng: 118.188087,
          lat: 24.494134,
        },
      });

      function handlerReady({ BMap, map }) {
        const point = new BMap.Point(118.189525, 24.491541);
        map.centerAndZoom(point, 13);
        const marker = new BMap.Marker(point);
        map.addOverlay(marker);
        const circle = new BMap.Circle(point, 6, {
          strokeColor: 'Blue',
          strokeWeight: 6,
          strokeOpacity: 1,
          Color: 'Blue',
          fillColor: '#0593FF',
        });
        map.addOverlay(circle);
      }
      return () => (
        <baidu-map
          class="baidu-map-demo"
          onReady={handlerReady}
          scroll-wheel-zoom={true}
          center={state.center}
          zoom={state.zoom}
        >
          {
            //  比例尺控件
          }
          <bm-scale anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-scale>
          {
            //  缩放控件
          }
          <bm-navigation anchor="BMAP_ANCHOR_BOTTOM_RIGHT"></bm-navigation>
        </baidu-map>
      );
    },
  });
</script>
<style scoped lang="less">
  .baidu-map-demo {
    height: calc(100vh - 100px);
  }
</style>
