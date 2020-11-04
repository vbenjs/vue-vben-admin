<template>
  <section class="full-loading" :style="getStyle">
    <BasicLoading :tip="tip" :size="SizeEnum.DEFAULT" />
  </section>
</template>
<script lang="ts">
  import type { PropType } from 'vue';
  import { defineComponent, computed } from 'vue';
  import BasicLoading from './BasicLoading.vue';

  import { SizeEnum } from '/@/enums/sizeEnum';

  export default defineComponent({
    name: 'FullLoading',
    components: { BasicLoading },
    props: {
      tip: {
        type: String as PropType<string>,
        default: '',
      },
      absolute: Boolean as PropType<boolean>,
    },
    setup(props) {
      const getStyle = computed((): any => {
        return props.absolute
          ? {
              position: 'absolute',
              left: 0,
              top: 0,
              'z-index': 1,
            }
          : {};
      });

      return { getStyle, SizeEnum };
    },
  });
</script>
<style lang="less" scoped>
  .full-loading {
    display: flex;
    width: 100%;
    height: 100%;
    // background: rgba(255, 255, 255, 0.3);
    // background: #f0f2f5;
    background: rgba(240, 242, 245, 0.5);
    justify-content: center;
    align-items: center;
  }
</style>
