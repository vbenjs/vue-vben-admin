<template>
  <section
    class="full-loading flex justify-center bg-mask-light items-center h-full w-full"
    :style="getStyle"
  >
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
      // 样式前缀
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
